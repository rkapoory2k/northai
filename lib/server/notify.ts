import "server-only";
import type { Lead } from "@/lib/lead";
import type { Offer } from "@/lib/offers";
import { sendEmail } from "./email";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Emails DIGEST_TO when someone submits the details form of a free offer. Never throws. */
export async function notifyNewLead(offer: Offer, lead: Lead, ctx: { pageUrl?: string; utm?: Record<string, string> }) {
  const to = process.env.DIGEST_TO;
  if (!to || !process.env.RESEND_API_KEY) return;
  const rows: [string, string][] = [
    ["Name", lead.name],
    ["Email", lead.email],
    ["Phone", lead.phone],
    ["Page", ctx.pageUrl || "—"],
    ...Object.entries(ctx.utm ?? {}).map(([k, v]) => [k, v] as [string, string]),
  ];
  const subject = `New ${offer.contentName} request: ${lead.name}`;
  const text = [`${subject}`, "", ...rows.map(([k, v]) => `${k}: ${v}`), "", "They're now being asked to book a call in Calendly. You'll get Calendly's usual email if they book."].join("\n");
  const cell = "padding:8px 12px;border-bottom:1px solid #E7E5DF;text-align:left;vertical-align:top";
  const html = `<div style="font-family:system-ui,sans-serif;color:#0A0A0A;max-width:600px">
<h2 style="margin:0 0 6px">New request: ${esc(offer.contentName)}</h2>
<p style="margin:0 0 16px;color:#4A4A4A">They've just submitted their details and are being asked to book a call. You'll get Calendly's usual email if they book.</p>
<table style="border-collapse:collapse;width:100%;font-size:14px">
${rows.map(([k, v]) => `<tr><th style="${cell};background:#F5F5F2;width:120px">${esc(k)}</th><td style="${cell}">${k === "Email" ? `<a href="mailto:${esc(v)}">${esc(v)}</a>` : k === "Phone" ? `<a href="tel:${esc(v)}">${esc(v)}</a>` : esc(v)}</td></tr>`).join("\n")}
</table></div>`;
  try {
    await sendEmail({ to, subject, html, text });
  } catch (err) {
    console.error("[notify] new lead email failed", err);
  }
}
