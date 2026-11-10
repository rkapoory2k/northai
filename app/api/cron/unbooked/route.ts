import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { findUnbooked, markNotified } from "@/lib/server/bookings";
import { sendEmail } from "@/lib/server/email";
import { CALENDLY_URL } from "@/lib/config";

export const runtime = "nodejs";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const when = (pi: Stripe.PaymentIntent) =>
  new Date(pi.created * 1000).toLocaleString("en-GB", { timeZone: "Europe/London", dateStyle: "medium", timeStyle: "short" });
const amount = (pi: Stripe.PaymentIntent) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: pi.currency.toUpperCase() }).format((pi.amount_received || pi.amount) / 100);

/**
 * Daily (vercel.json cron): emails DIGEST_TO a list of buyers who paid but haven't booked the
 * kickoff call. Each buyer is reported once. Vercel calls this with `Authorization: Bearer $CRON_SECRET`.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const to = process.env.DIGEST_TO;
  if (!to) return NextResponse.json({ error: "DIGEST_TO not set" }, { status: 500 });

  const people = await findUnbooked();
  if (!people.length) {
    console.info("[unbooked] nobody to report");
    return NextResponse.json({ sent: false, count: 0 });
  }

  const rows = people.map((pi) => {
    const m = pi.metadata;
    return { name: m.lead_name || "—", email: m.lead_email, phone: m.lead_phone || "—", paid: `${amount(pi)} · ${when(pi)}`, id: pi.id };
  });
  const n = rows.length;
  const subject = `${n} ${n === 1 ? "person has" : "people have"} paid but not booked a call`;
  const text = [
    `${subject}.`,
    "",
    ...rows.map((r) => `- ${r.name} · ${r.email} · ${r.phone} · paid ${r.paid}`),
    "",
    `Booking link to send them: ${CALENDLY_URL}`,
  ].join("\n");
  const cell = "padding:10px 12px;border-bottom:1px solid #E7E5DF;text-align:left;vertical-align:top";
  const html = `<div style="font-family:system-ui,sans-serif;color:#0A0A0A;max-width:680px">
<h2 style="margin:0 0 6px">${esc(subject)}</h2>
<p style="margin:0 0 18px;color:#4A4A4A">They bought the $49 2027 strategy but haven't booked their kickoff call yet. Each person appears in one digest only.</p>
<table style="border-collapse:collapse;width:100%;font-size:14px">
<tr style="background:#F5F5F2"><th style="${cell}">Name</th><th style="${cell}">Email</th><th style="${cell}">Phone</th><th style="${cell}">Paid</th></tr>
${rows
  .map(
    (r) =>
      `<tr><td style="${cell}">${esc(r.name)}</td><td style="${cell}"><a href="mailto:${esc(r.email)}">${esc(r.email)}</a></td><td style="${cell}"><a href="tel:${esc(r.phone)}">${esc(r.phone)}</a></td><td style="${cell}">${esc(r.paid)}<br><a href="https://dashboard.stripe.com/payments/${r.id}" style="color:#8A8A8A;font-size:12px">View in Stripe</a></td></tr>`,
  )
  .join("\n")}
</table>
<p style="margin:18px 0 0;color:#4A4A4A">Booking link to send them: <a href="${esc(CALENDLY_URL)}">${esc(CALENDLY_URL)}</a></p>
</div>`;

  try {
    await sendEmail({ to, subject, html, text });
  } catch (err) {
    console.error("[unbooked] email failed", err);
    return NextResponse.json({ error: "email failed" }, { status: 502 });
  }
  await markNotified(people.map((p) => p.id));
  console.info(`[unbooked] reported ${n}`);
  return NextResponse.json({ sent: true, count: n });
}
