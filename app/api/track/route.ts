import { after, NextResponse } from "next/server";
import { validateLead } from "@/lib/lead";
import { clientContext, isSameOrigin } from "@/lib/server/request";
import { sendCapiEvent } from "@/lib/server/capi";
import { sendToCrm } from "@/lib/server/crm";

export const runtime = "nodejs";

// Lead and Purchase have dedicated server paths (/api/lead, Stripe webhook); only these are accepted here.
const ALLOWED = new Set(["ViewContent", "InitiateCheckout", "Schedule"] as const);
type Allowed = "ViewContent" | "InitiateCheckout" | "Schedule";

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json().catch(() => ({}));
  const eventName = body.eventName as Allowed;
  if (!ALLOWED.has(eventName) || typeof body.eventId !== "string") {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const ctx = clientContext(req);
  const v = body.lead ? validateLead(body.lead) : null;
  const user = v?.ok ? v.lead : undefined;
  const sourceUrl = typeof body.sourceUrl === "string" ? body.sourceUrl.slice(0, 500) : ctx.referer;

  const customData =
    eventName === "InitiateCheckout"
      ? { value: 49, currency: "USD", num_items: 1, content_name: "2027 strategy" }
      : eventName === "ViewContent"
        ? { content_name: "Hero video" }
        : { content_name: "Kickoff call" };

  after(async () => {
    await sendCapiEvent({ eventName, eventId: body.eventId.slice(0, 100), sourceUrl, ctx, user, customData });
    if (eventName === "Schedule" && user) {
      const s = (x: unknown) => (typeof x === "string" ? x.slice(0, 300) : undefined);
      await sendToCrm("call.booked", user, {
        calendly_event_uri: s(body.calendly?.event),
        calendly_invitee_uri: s(body.calendly?.invitee),
        stripe_payment_intent: s(body.paymentIntentId),
      });
    }
  });

  return NextResponse.json({ ok: true });
}
