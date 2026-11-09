import "server-only";
import { createHash } from "node:crypto";
import { PIXEL_ID } from "@/lib/config";
import { splitName } from "@/lib/lead";
import type { ClientContext } from "./request";

const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");
const norm = (v: string) => v.trim().toLowerCase();

export type CapiEvent = {
  eventName: "Lead" | "InitiateCheckout" | "Purchase" | "Schedule" | "ViewContent";
  eventId: string;
  sourceUrl?: string;
  ctx: Omit<ClientContext, "referer">;
  user?: { email?: string; phone?: string; name?: string };
  customData?: Record<string, unknown>;
  eventTime?: number;
};

/**
 * Sends one event to the Meta Conversions API. Never throws: tracking must not break the funnel.
 * Deduplicates with the browser Pixel via `event_id` (+ event_name).
 */
export async function sendCapiEvent(e: CapiEvent): Promise<void> {
  const token = process.env.META_CAPI_TOKEN;
  if (!PIXEL_ID || !token) {
    console.warn(`[capi] ${e.eventName} skipped: Pixel ID or META_CAPI_TOKEN not set`);
    return;
  }
  if (!e.ctx.consent) {
    console.info(`[capi] ${e.eventName} skipped: no tracking consent`);
    return;
  }

  const user_data: Record<string, unknown> = {
    client_ip_address: e.ctx.ip,
    client_user_agent: e.ctx.ua,
    fbp: e.ctx.fbp,
    fbc: e.ctx.fbc,
  };
  if (e.user?.email) {
    user_data.em = [sha256(norm(e.user.email))];
    user_data.external_id = [sha256(norm(e.user.email))];
  }
  if (e.user?.phone) user_data.ph = [sha256(e.user.phone.replace(/\D/g, ""))];
  if (e.user?.name) {
    const { first, last } = splitName(e.user.name);
    if (first) user_data.fn = [sha256(norm(first))];
    if (last) user_data.ln = [sha256(norm(last))];
  }
  for (const k of Object.keys(user_data)) if (user_data[k] === undefined) delete user_data[k];

  const body: Record<string, unknown> = {
    data: [
      {
        event_name: e.eventName,
        event_time: e.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: e.eventId,
        action_source: "website",
        event_source_url: e.sourceUrl,
        user_data,
        custom_data: e.customData,
      },
    ],
  };
  if (process.env.META_TEST_EVENT_CODE) body.test_event_code = process.env.META_TEST_EVENT_CODE;

  const version = process.env.META_GRAPH_API_VERSION || "v24.0";
  try {
    const res = await fetch(
      `https://graph.facebook.com/${version}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(8000) },
    );
    const text = await res.text();
    if (!res.ok) console.error(`[capi] ${e.eventName} failed`, res.status, text);
    else console.info(`[capi] ${e.eventName} sent (event_id ${e.eventId}${body.test_event_code ? `, test code ${body.test_event_code}` : ""})`, text);
  } catch (err) {
    console.error(`[capi] ${e.eventName} error`, err);
  }
}
