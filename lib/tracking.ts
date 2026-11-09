"use client";

import { CONSENT_COOKIE, PIXEL_ID, REQUIRE_CONSENT } from "./config";

type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue: unknown[]; push: Fbq; loaded: boolean; version: string };
declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export type Consent = "granted" | "denied" | null;
export const CONSENT_EVENT = "na:consent";

export const newEventId = (prefix: string) =>
  `${prefix}_${typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36)}`;

function readCookie(name: string) {
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}
function writeCookie(name: string, value: string, days: number) {
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${days * 86400}; Path=/; SameSite=Lax${secure}`;
}

export function getConsent(): Consent {
  if (!REQUIRE_CONSENT) return "granted";
  const v = readCookie(CONSENT_COOKIE);
  return v === "granted" || v === "denied" ? v : null;
}
export function setConsent(granted: boolean) {
  writeCookie(CONSENT_COOKIE, granted ? "granted" : "denied", 365);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: granted }));
}

/* ---------- Attribution (UTM + fbclid), first touch per session ---------- */
const ATTR_KEY = "na_attr";
const ATTR_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"];

export function captureAttribution() {
  try {
    if (sessionStorage.getItem(ATTR_KEY)) return;
    const q = new URLSearchParams(location.search);
    const attr: Record<string, string> = {};
    for (const k of ATTR_PARAMS) {
      const v = q.get(k);
      if (v) attr[k] = v;
    }
    attr.fbclid_ts = String(Date.now());
    sessionStorage.setItem(ATTR_KEY, JSON.stringify(attr));
  } catch {}
}
export function getAttribution(): Record<string, string> {
  try {
    return JSON.parse(sessionStorage.getItem(ATTR_KEY) || "{}");
  } catch {
    return {};
  }
}

/** If the visitor arrived from a Meta ad but consented later, still record the click id. */
function ensureFbc() {
  const { fbclid, fbclid_ts } = getAttribution();
  if (fbclid && !readCookie("_fbc")) writeCookie("_fbc", `fb.1.${fbclid_ts || Date.now()}.${fbclid}`, 90);
}

/* ---------- Meta Pixel ---------- */
export function loadPixel() {
  if (!PIXEL_ID || typeof window === "undefined" || window.fbq) return;
  if (getConsent() !== "granted") return;
  ensureFbc();
  const n = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else n.queue.push(args);
  } as Fbq;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  window.fbq = n;
  if (!window._fbq) window._fbq = n;
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
}

function pixel(eventName: string, data: Record<string, unknown>, eventId: string) {
  if (!PIXEL_ID || getConsent() !== "granted") return;
  loadPixel();
  window.fbq?.("track", eventName, data, { eventID: eventId });
}

type TrackExtra = { lead?: { name: string; email: string; phone: string }; [k: string]: unknown };

/**
 * Fire a browser Pixel event and (for events without their own server path) the matching
 * CAPI event via /api/track, sharing one event_id for deduplication.
 */
export function track(
  eventName: "Lead" | "InitiateCheckout" | "Purchase" | "Schedule" | "ViewContent",
  data: Record<string, unknown>,
  opts: { eventId?: string; server?: boolean; extra?: TrackExtra } = {},
) {
  const eventId = opts.eventId ?? newEventId(eventName.toLowerCase());
  pixel(eventName, data, eventId);
  if (opts.server) {
    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ eventName, eventId, sourceUrl: location.href, ...opts.extra }),
    }).catch(() => {});
  }
  return eventId;
}
