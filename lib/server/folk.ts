import "server-only";
import { splitName, type Lead } from "@/lib/lead";
import type { CrmEvent } from "./crm";

/**
 * folk CRM (https://developer.folk.app). Upserts the buyer as a person in FOLK_GROUP_ID,
 * moves the group's status field forward (Lead → Paid → Booked, never backwards) and
 * logs a note with the details of each funnel step.
 */

const BASE = "https://api.folk.app";
const STATUS_RANK = ["Lead", "Paid", "Booked"] as const;
const STATUS_FOR: Record<CrmEvent, (typeof STATUS_RANK)[number]> = {
  "lead.created": "Lead",
  "order.paid": "Paid",
  "call.booked": "Booked",
};

type FolkPerson = {
  id: string;
  phones?: string[];
  emails?: string[];
  groups?: { id: string }[];
  customFieldValues?: Record<string, Record<string, unknown>>;
};

export const folkEnabled = () => Boolean(process.env.FOLK_API_KEY && process.env.FOLK_GROUP_ID);

async function folk<T>(path: string, init: RequestInit & { idempotencyKey?: string } = {}): Promise<T> {
  const headers: Record<string, string> = {
    authorization: `Bearer ${process.env.FOLK_API_KEY}`,
    "content-type": "application/json",
  };
  if (init.idempotencyKey) headers["idempotency-key"] = init.idempotencyKey;
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${BASE}${path}`, { ...init, headers, signal: AbortSignal.timeout(10000) });
    if (res.status === 429 && attempt < 2) {
      const wait = Math.min(5, Number(res.headers.get("retry-after")) || 1);
      await new Promise((r) => setTimeout(r, wait * 1000));
      continue;
    }
    const text = await res.text();
    if (!res.ok) throw new Error(`folk ${init.method || "GET"} ${path.split("?")[0]} → ${res.status} ${text.slice(0, 500)}`);
    return (text ? JSON.parse(text) : {}) as T;
  }
}

async function findByEmail(email: string): Promise<FolkPerson | undefined> {
  const q = new URLSearchParams({ "filter[emails][eq]": email, limit: "1" });
  const r = await folk<{ data: { items: FolkPerson[] } }>(`/v1/people?${q}`);
  return r.data.items[0];
}

function noteFor(event: CrmEvent, extra: Record<string, unknown>) {
  const lines: string[] = [];
  const add = (label: string, v: unknown) => v !== undefined && v !== null && v !== "" && lines.push(`- **${label}:** ${v}`);
  if (event === "lead.created") {
    lines.push("**2027 Strategy funnel: lead captured** (step 1 of checkout)");
    add("Page", extra.page_url);
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid"]) add(k, extra[k]);
  } else if (event === "order.paid") {
    lines.push(`**2027 Strategy funnel: paid ${extra.amount ?? ""} ${extra.currency ?? ""}**`);
    add("Product", extra.product);
    add("Stripe payment", extra.stripe_payment_intent);
    for (const k of ["utm_source", "utm_medium", "utm_campaign"]) add(k, extra[k]);
  } else {
    lines.push("**2027 Strategy funnel: kickoff call booked** (Calendly)");
    add("Calendly event", extra.calendly_event_uri);
    add("Stripe payment", extra.stripe_payment_intent);
  }
  return lines.join("\n");
}

export async function sendToFolk(event: CrmEvent, lead: Lead, extra: Record<string, unknown> = {}): Promise<boolean> {
  const groupId = process.env.FOLK_GROUP_ID!;
  const statusField = process.env.FOLK_STATUS_FIELD ?? "Status";
  const status = STATUS_FOR[event];

  try {
    const existing = await findByEmail(lead.email);
    let personId: string;

    if (!existing) {
      const { first, last } = splitName(lead.name);
      const body: Record<string, unknown> = {
        firstName: first,
        lastName: last,
        emails: [lead.email],
        phones: lead.phone ? [lead.phone] : [],
        groups: [{ id: groupId }],
      };
      if (statusField) body.customFieldValues = { [groupId]: { [statusField]: status } };
      const r = await folk<{ data: { id: string } }>("/v1/people", {
        method: "POST",
        body: JSON.stringify(body),
        idempotencyKey: `${event}:${lead.email}:${String(extra.stripe_payment_intent ?? new Date().toISOString().slice(0, 13))}`,
      });
      personId = r.data.id;
    } else {
      personId = existing.id;
      // List fields replace the old values in folk, so send the full merged lists.
      const groups = existing.groups?.map((g) => ({ id: g.id })) ?? [];
      if (!groups.some((g) => g.id === groupId)) groups.push({ id: groupId });
      const phones = [...(existing.phones ?? [])];
      if (lead.phone && !phones.includes(lead.phone)) phones.push(lead.phone);

      const patch: Record<string, unknown> = { groups, phones };
      const current = existing.customFieldValues?.[groupId]?.[statusField];
      const currentRank = STATUS_RANK.indexOf(current as (typeof STATUS_RANK)[number]);
      if (statusField && STATUS_RANK.indexOf(status) > currentRank) {
        patch.customFieldValues = { [groupId]: { [statusField]: status } };
      }
      await folk(`/v1/people/${personId}`, { method: "PATCH", body: JSON.stringify(patch) });
    }

    await folk("/v1/notes", {
      method: "POST",
      body: JSON.stringify({ entity: { id: personId }, visibility: "public", content: noteFor(event, extra) }),
    });
    console.info(`[folk] ${event} → ${personId} (${status})`);
    return true;
  } catch (err) {
    console.error(`[folk] ${event} failed for ${lead.email}`, err);
    return false;
  }
}
