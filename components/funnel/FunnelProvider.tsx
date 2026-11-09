"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Lead } from "@/lib/lead";
import { getStripe } from "./stripeClient";
import { track } from "@/lib/tracking";
import ClaimModal from "./ClaimModal";

export type Step = 1 | 2 | 3;
export type FunnelState = {
  open: boolean;
  step: Step;
  form: Lead;
  paymentIntentId?: string;
  paymentError?: string;
};

type Ctx = {
  state: FunnelState;
  openClaim: () => void;
  close: () => void;
  setStep: (s: Step) => void;
  setForm: (f: Lead) => void;
  markPaid: (paymentIntentId: string) => void;
  clearPaymentError: () => void;
};

const STORAGE_KEY = "na_funnel";
const initial: FunnelState = { open: false, step: 1, form: { name: "", email: "", phone: "" } };
const FunnelContext = createContext<Ctx | null>(null);

export const useFunnel = () => {
  const c = useContext(FunnelContext);
  if (!c) throw new Error("useFunnel outside FunnelProvider");
  return c;
};

/** Browser Purchase, once per PaymentIntent (event_id matches the webhook's CAPI event). */
function firePurchase(paymentIntentId: string) {
  const key = `na_purchase_${paymentIntentId}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {}
  track("Purchase", { value: 49, currency: "USD", content_name: "2027 strategy" }, { eventId: `purchase_${paymentIntentId}` });
}

export default function FunnelProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FunnelState>(initial);
  const [hydrated, setHydrated] = useState(false);

  // Restore progress (refresh-safe) and handle redirect-based payment methods returning here.
  useEffect(() => {
    let restored: FunnelState = initial;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) restored = { ...initial, ...JSON.parse(raw), paymentError: undefined };
    } catch {}

    const q = new URLSearchParams(location.search);
    const clientSecret = q.get("payment_intent_client_secret");
    if (!clientSecret) {
      setState(restored);
      setHydrated(true);
      return;
    }
    // Strip Stripe's params so a refresh doesn't re-process them.
    for (const k of ["payment_intent", "payment_intent_client_secret", "redirect_status", "checkout"]) q.delete(k);
    history.replaceState(null, "", location.pathname + (q.size ? `?${q}` : "") + location.hash);

    (async () => {
      const stripe = await getStripe();
      const res = stripe ? await stripe.retrievePaymentIntent(clientSecret) : null;
      const pi = res?.paymentIntent;
      if (pi?.status === "succeeded") {
        firePurchase(pi.id);
        setState({ ...restored, open: true, step: 3, paymentIntentId: pi.id });
      } else if (pi?.status === "processing") {
        setState({ ...restored, open: true, step: 2, paymentError: "Your payment is processing. We’ll email you as soon as it’s confirmed." });
      } else {
        setState({ ...restored, open: true, step: 2, paymentError: "That payment didn’t go through. Please try another method." });
      }
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, paymentError: undefined }));
    } catch {}
  }, [state, hydrated]);

  const openClaim = useCallback(
    // Paid customers go straight back to booking; everyone else resumes where they were.
    () => setState((s) => ({ ...s, open: true, step: s.paymentIntentId ? 3 : s.step === 2 && s.form.email ? 2 : 1 })),
    [],
  );
  const value = useMemo<Ctx>(
    () => ({
      state,
      openClaim,
      close: () => setState((s) => ({ ...s, open: false })),
      setStep: (step) => setState((s) => ({ ...s, step, paymentError: undefined })),
      setForm: (form) => setState((s) => ({ ...s, form })),
      markPaid: (paymentIntentId) => {
        firePurchase(paymentIntentId);
        setState((s) => ({ ...s, step: 3, paymentIntentId, paymentError: undefined }));
      },
      clearPaymentError: () => setState((s) => ({ ...s, paymentError: undefined })),
    }),
    [state, openClaim],
  );

  return (
    <FunnelContext.Provider value={value}>
      {children}
      {state.open && <ClaimModal />}
    </FunnelContext.Provider>
  );
}
