import { after, NextResponse } from "next/server";
import { validateLead } from "@/lib/lead";
import { clientContext, isSameOrigin } from "@/lib/server/request";
import { sendToCrm } from "@/lib/server/crm";
import { sendCapiEvent } from "@/lib/server/capi";
import { notifyNewLead } from "@/lib/server/notify";
import { OFFERS, type OfferId } from "@/lib/offers";

export const runtime = "nodejs";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"] as const;

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = await req.json().catch(() => ({}));

  // Honeypot: bots fill every field. Pretend success.
  if (body.company_website) return NextResponse.json({ ok: true });

  const v = validateLead(body);
  if (!v.ok) return NextResponse.json({ error: "invalid", errors: v.errors }, { status: 400 });

  const offer = OFFERS[(body.offer as OfferId) in OFFERS ? (body.offer as OfferId) : "strategy"];
  const ctx = clientContext(req);
  const sourceUrl = typeof body.sourceUrl === "string" ? body.sourceUrl.slice(0, 500) : ctx.referer;
  const eventId = typeof body.eventId === "string" ? body.eventId.slice(0, 100) : `lead_${crypto.randomUUID()}`;
  const utm: Record<string, string> = {};
  for (const k of UTM_KEYS) if (typeof body.utm?.[k] === "string") utm[k] = body.utm[k].slice(0, 200);

  // Respond immediately; deliver to CRM + Meta after the response is sent.
  after(() =>
    Promise.all([
      sendToCrm("lead.created", v.lead, { offer: offer.id, page_url: sourceUrl, ...utm }),
      sendCapiEvent({ eventName: "Lead", eventId, sourceUrl, ctx, user: v.lead, customData: { content_name: offer.contentName } }),
      offer.paid ? Promise.resolve() : notifyNewLead(offer, v.lead, { pageUrl: sourceUrl, utm }),
    ]),
  );

  return NextResponse.json({ ok: true, lead: v.lead });
}
