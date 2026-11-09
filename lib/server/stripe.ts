import "server-only";
import Stripe from "stripe";

let client: Stripe | undefined;

/** Lazily constructed so builds don't need the secret key. */
export function stripe() {
  if (!client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    client = new Stripe(key, { appInfo: { name: "north-ai-strategy-landing" } });
  }
  return client;
}
