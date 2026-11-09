import "server-only";
import { CONSENT_COOKIE, REQUIRE_CONSENT } from "@/lib/config";

function cookie(req: Request, name: string) {
  const m = (req.headers.get("cookie") || "").match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

/** Everything Meta CAPI wants to know about the browser that made this request. */
export function clientContext(req: Request) {
  const fwd = req.headers.get("x-forwarded-for") || "";
  return {
    ip: fwd.split(",")[0]?.trim() || req.headers.get("x-real-ip") || undefined,
    ua: req.headers.get("user-agent") || undefined,
    fbp: cookie(req, "_fbp"),
    fbc: cookie(req, "_fbc"),
    consent: !REQUIRE_CONSENT || cookie(req, CONSENT_COOKIE) === "granted",
    referer: req.headers.get("referer") || undefined,
  };
}
export type ClientContext = ReturnType<typeof clientContext>;

/** Same-origin check for browser-only endpoints. */
export function isSameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-CORS same-origin navigations / older browsers
  try {
    return new URL(origin).host === new URL(req.url).host || new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}
