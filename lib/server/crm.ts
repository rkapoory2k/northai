import "server-only";
import { splitName, type Lead } from "@/lib/lead";
import { folkEnabled, sendToFolk } from "./folk";

export type CrmEvent = "lead.created" | "order.paid" | "call.booked";

/**
 * Delivers a funnel event to the CRM: folk (when FOLK_API_KEY + FOLK_GROUP_ID are set) and/or a
 * generic JSON webhook (CRM_WEBHOOK_URL). Never throws. Returns whether any destination accepted it.
 */
export async function sendToCrm(event: CrmEvent, lead: Lead, extra: Record<string, unknown> = {}): Promise<boolean> {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url && !folkEnabled()) {
    console.warn(`[crm] no CRM configured (FOLK_API_KEY/FOLK_GROUP_ID or CRM_WEBHOOK_URL); dropping ${event} for ${lead.email}`);
    return false;
  }
  const results = await Promise.all([
    folkEnabled() ? sendToFolk(event, lead, extra) : Promise.resolve(false),
    url ? sendToWebhook(url, event, lead, extra) : Promise.resolve(false),
  ]);
  return results.some(Boolean);
}

async function sendToWebhook(url: string, event: CrmEvent, lead: Lead, extra: Record<string, unknown>): Promise<boolean> {
  const { first, last } = splitName(lead.name);
  const payload = {
    event,
    occurred_at: new Date().toISOString(),
    source: "strategy-landing",
    full_name: lead.name,
    first_name: first,
    last_name: last,
    email: lead.email,
    phone: lead.phone,
    tags: ["2027-strategy", event],
    ...extra,
  };
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (process.env.CRM_WEBHOOK_SECRET) headers["x-webhook-secret"] = process.env.CRM_WEBHOOK_SECRET;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(payload), signal: AbortSignal.timeout(8000) });
      if (res.ok) return true;
      console.error(`[crm] ${event} HTTP ${res.status}`, await res.text().catch(() => ""));
      if (res.status < 500) return false;
    } catch (err) {
      console.error(`[crm] ${event} error`, err);
    }
  }
  return false;
}
