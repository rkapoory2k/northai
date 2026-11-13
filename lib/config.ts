// Public, build-time configuration (safe to ship to the browser).

const int = (v: string | undefined, d: number) => {
  const n = Number.parseInt(v ?? "", 10);
  return Number.isFinite(n) ? n : d;
};

export const SPOTS_CAPACITY = Math.max(1, int(process.env.NEXT_PUBLIC_SPOTS_CAPACITY, 10));
export const SPOTS_LEFT = Math.max(0, Math.min(SPOTS_CAPACITY, int(process.env.NEXT_PUBLIC_SPOTS_LEFT, 6)));
export const SPOTS_LINE = `Only ${SPOTS_LEFT} of ${SPOTS_CAPACITY} strategies left this month`;

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://strategy.north-ai.com").replace(/\/$/, "");

export const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/rishi-north-ai/30-min-meeting";

export const VIMEO_ID = "1245185215";

export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";
export const STRIPE_PK = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
export const REQUIRE_CONSENT = process.env.NEXT_PUBLIC_REQUIRE_CONSENT !== "false";
export const CONSENT_COOKIE = "na_consent";

export const LEGAL = {
  terms: process.env.NEXT_PUBLIC_TERMS_URL || "/terms",
  mainTerms: "https://north-ai.com/terms",
  privacy: process.env.NEXT_PUBLIC_PRIVACY_URL || "https://north-ai.com/privacy",
  cookies: process.env.NEXT_PUBLIC_COOKIE_URL || "https://north-ai.com/cookies",
  contact: "legal@north-ai.com",
};

// The product. The amount charged is defined server-side (lib/server/product.ts) and must match.
export const PRODUCT_NAME = "2027 Creative & Paid Media Strategy";
export const PRICE_CENTS = 4900;
export const CURRENCY = "usd";
export const DEFAULT_PHONE_COUNTRY = "GB" as const;

/** Hero video for the Black Friday page; empty shows a "video coming soon" placeholder. */
export const BFCM_VIMEO_ID = process.env.NEXT_PUBLIC_BFCM_VIMEO_ID || "";
