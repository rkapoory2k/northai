import "server-only";
import type Stripe from "stripe";
import { stripe } from "./stripe";

/**
 * Booking state lives on the Stripe PaymentIntent's metadata (no database needed):
 * - booked_at: set when the buyer books in the embedded Calendly (step 3)
 * - unbooked_notified_at: set once the buyer has been included in a "paid but not booked" digest
 */

export async function markBooked(paymentIntentId: string | undefined, email: string) {
  if (!paymentIntentId?.startsWith("pi_") || !process.env.STRIPE_SECRET_KEY) return;
  try {
    const pi = await stripe().paymentIntents.retrieve(paymentIntentId);
    // Only the buyer's own booking can mark their payment as booked.
    if (pi.status !== "succeeded" || (pi.metadata.lead_email || "").toLowerCase() !== email.toLowerCase()) return;
    if (pi.metadata.booked_at) return;
    await stripe().paymentIntents.update(pi.id, { metadata: { booked_at: new Date().toISOString() } });
    console.info(`[bookings] ${pi.id} marked booked`);
  } catch (err) {
    console.error("[bookings] markBooked failed", err);
  }
}

/** Succeeded payments from the last `lookbackDays`, paid over `minAgeHours` ago, not booked and not yet reported. */
export async function findUnbooked({ minAgeHours = 2, lookbackDays = 14 } = {}) {
  const now = Math.floor(Date.now() / 1000);
  const out: Stripe.PaymentIntent[] = [];
  for await (const pi of stripe().paymentIntents.list({ created: { gte: now - lookbackDays * 86400 }, limit: 100 })) {
    if (pi.status !== "succeeded") continue;
    if (pi.created > now - minAgeHours * 3600) continue;
    if (pi.metadata.booked_at || pi.metadata.unbooked_notified_at) continue;
    if (!pi.metadata.lead_email) continue; // not from this funnel
    out.push(pi);
  }
  return out.sort((a, b) => a.created - b.created);
}

export async function markNotified(ids: string[]) {
  const at = new Date().toISOString();
  for (const id of ids) {
    await stripe().paymentIntents.update(id, { metadata: { unbooked_notified_at: at } });
  }
}
