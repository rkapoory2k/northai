import { NextResponse } from "next/server";
import { validateLead } from "@/lib/lead";
import { clientContext, isSameOrigin } from "@/lib/server/request";
import { stripe } from "@/lib/server/stripe";
import { CURRENCY, PRICE_CENTS, PRODUCT_NAME } from "@/lib/config";

export const runtime = "nodejs";

const cap = (v: unknown, n = 480) => (typeof v === "string" && v ? v.slice(0, n) : undefined);

/**
 * Creates the $49 PaymentIntent for the Payment Element (deferred-intent flow: the Element is
 * rendered first, the intent is created on submit). The browser context needed for the
 * server-side Purchase event is stored in metadata and read back by the Stripe webhook.
 */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const v = validateLead(body.lead ?? {});
  if (!v.ok) return NextResponse.json({ error: "invalid", errors: v.errors }, { status: 400 });

  const ctx = clientContext(req);
  const metadata: Record<string, string> = {};
  const put = (k: string, val: unknown) => {
    const s = cap(val);
    if (s) metadata[k] = s;
  };
  put("lead_name", v.lead.name);
  put("lead_email", v.lead.email);
  put("lead_phone", v.lead.phone);
  put("source_url", body.sourceUrl);
  put("client_ip", ctx.ip);
  put("client_ua", ctx.ua);
  put("fbp", ctx.fbp);
  put("fbc", ctx.fbc);
  metadata.tracking_consent = ctx.consent ? "granted" : "denied";
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) put(k, body.utm?.[k]);

  try {
    const pi = await stripe().paymentIntents.create(
      {
        amount: PRICE_CENTS,
        currency: CURRENCY,
        automatic_payment_methods: { enabled: true },
        description: PRODUCT_NAME,
        receipt_email: v.lead.email,
        statement_descriptor_suffix: "2027 STRATEGY",
        metadata,
      },
      // Same attempt id from the browser => same intent (double clicks, retries).
      typeof body.attemptId === "string" ? { idempotencyKey: `pi_${body.attemptId.slice(0, 80)}` } : undefined,
    );
    return NextResponse.json({ clientSecret: pi.client_secret, paymentIntentId: pi.id });
  } catch (err) {
    console.error("[checkout] create PaymentIntent failed", err);
    return NextResponse.json({ error: "Payment could not be started. Please try again." }, { status: 500 });
  }
}
