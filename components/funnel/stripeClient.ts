"use client";

import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { STRIPE_PK } from "@/lib/config";

let promise: Promise<Stripe | null> | undefined;
export const getStripe = () => (promise ??= STRIPE_PK ? loadStripe(STRIPE_PK) : Promise.resolve(null));
