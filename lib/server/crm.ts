import "server-only";
import { splitName, type Lead } from "@/lib/lead";

export type CrmEvent = "lead.created" | "order.paid" | "call.booked";

/**
 * Posts a flat JSON payload to CRM_WEBHOOK_URL (GoHighLevel inbound webhook, HubSpot workflow,
 * Zapier/Make hook, ...). Never throws. Returns whether the CRM accepted it.
 */
export async function sendToCrm(event: CrmEvent, lead: Lead, extra: Record<string, unknown> = {}): Promise<boolean> {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) {
    console.warn(`[crm] CRM_WEBHOOK_URL not set; dropping ${event} for ${lead.email}`);
    return false;
  }
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
