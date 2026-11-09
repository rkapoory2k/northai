import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/server/stripe";
import { sendCapiEvent } from "@/lib/server/capi";
import { sendToCrm } from "@/lib/server/crm";

export const runtime = "nodejs";

/**
 * Stripe webhook: on payment_intent.succeeded, send the server-side Purchase to Meta CAPI
 * (event_id `purchase_<pi id>` — identical to the browser Pixel event, so Meta dedupes)
 * and mark the lead as paid in the CRM.
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) return NextResponse.json({ error: "not configured" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await req.text(), sig, secret);
  } catch (err) {
    console.error("[stripe-webhook] bad signature", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const m = pi.metadata || {};
    const lead = { name: m.lead_name || "", email: m.lead_email || pi.receipt_email || "", phone: m.lead_phone || "" };
    const value = (pi.amount_received || pi.amount) / 100;

    await Promise.all([
      sendCapiEvent({
        eventName: "Purchase",
        eventId: `purchase_${pi.id}`,
        eventTime: pi.created,
        sourceUrl: m.source_url,
        ctx: { ip: m.client_ip, ua: m.client_ua, fbp: m.fbp, fbc: m.fbc, consent: m.tracking_consent === "granted" },
        user: lead,
        customData: { value, currency: pi.currency.toUpperCase(), content_name: pi.description, order_id: pi.id },
      }),
      lead.email
        ? sendToCrm("order.paid", lead, {
            amount: value,
            currency: pi.currency.toUpperCase(),
            product: pi.description,
            stripe_payment_intent: pi.id,
            page_url: m.source_url,
            utm_source: m.utm_source,
            utm_medium: m.utm_medium,
            utm_campaign: m.utm_campaign,
            utm_content: m.utm_content,
            utm_term: m.utm_term,
          })
        : Promise.resolve(false),
    ]);
  }

  return NextResponse.json({ received: true });
}
