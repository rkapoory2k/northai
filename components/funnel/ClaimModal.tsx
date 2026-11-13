"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { useFunnel, type Step } from "./FunnelProvider";
import { getStripe } from "./stripeClient";
import { validateLead, type Lead, type LeadErrors } from "@/lib/lead";
import { getAttribution, newEventId, track } from "@/lib/tracking";
import { CALENDLY_URL, CURRENCY, LEGAL, PRICE_CENTS, PRODUCT_NAME, STRIPE_PK } from "@/lib/config";
import { stack } from "@/lib/content";
import { ArrowIcon, CheckIcon, LockIcon } from "../icons";

const inputCls =
  "rounded-[12px] border border-line bg-paper px-4 py-[15px] text-[16px] text-ink outline-none transition-colors focus:border-violet focus:bg-white aria-[invalid=true]:border-[#D64545]";
const primaryBtn =
  "flex cursor-pointer items-center justify-center gap-3 rounded-full border-0 bg-ink px-7 py-[18px] text-[18px] font-semibold text-white hover:bg-[#2a2a2a] disabled:cursor-wait disabled:opacity-70";

export default function ClaimModal() {
  const { state, close, offer } = useFunnel();
  const steps: [Step, string][] = offer.paid
    ? [[1, "Your details"], [2, "Order"], [3, "Book call"]]
    : [[1, "Your details"], [2, "Book call"]];
  const bookStep: Step = offer.paid ? 3 : 2;
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  return (
    <div
      onClick={close}
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[rgba(10,10,10,0.62)] px-4 py-10 backdrop-blur-[6px]"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={offer.modalTitle}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: state.step === bookStep ? 880 : 560 }}
        className="w-full overflow-hidden rounded-[26px] bg-white text-ink shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)] outline-none transition-[max-width] duration-250 ease-in-out"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-[26px] py-5">
          <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
            {steps.map(([n, label]) => {
              const on = state.step >= n;
              return (
                <li key={n} className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] ${on ? "text-ink" : "text-muted"}`} aria-current={state.step === n ? "step" : undefined}>
                  <span className={`inline-flex size-[22px] items-center justify-center rounded-full text-[11px] ${on ? "bg-ink text-white" : "bg-ink/8 text-body"}`}>{n}</span>
                  <span className={n === state.step ? "" : "max-sm:hidden"}>{label}</span>
                </li>
              );
            })}
          </ol>
          <button onClick={close} aria-label="Close" className="size-9 shrink-0 cursor-pointer rounded-full border-0 bg-ink/6 text-[20px] leading-none text-ink hover:bg-ink/10">×</button>
        </div>
        {state.step === 1 && <DetailsStep />}
        {offer.paid && state.step === 2 && <OrderStep />}
        {state.step === bookStep && <BookStep />}
      </div>
    </div>
  );
}

/* ------------------------------ Step 1 ------------------------------ */

function DetailsStep() {
  const { state, setForm, setStep, offer } = useFunnel();
  const [form, setLocal] = useState<Lead>(state.form);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [busy, setBusy] = useState(false);
  const honeypot = useRef<HTMLInputElement>(null);

  const fields: { name: keyof Lead; label: string; type: string; ph: string; ac: string; mode?: "tel" | "email" }[] = [
    { name: "name", label: "Full name", type: "text", ph: "Jane Smith", ac: "name" },
    { name: "email", label: "Email", type: "email", ph: "jane@company.com", ac: "email", mode: "email" },
    { name: "phone", label: "Phone number", type: "tel", ph: "+44 7700 900000", ac: "tel", mode: "tel" },
  ];

  async function submit(e: FormEvent) {
    e.preventDefault();
    const v = validateLead(form);
    if (!v.ok) {
      setErrors(v.errors);
      return;
    }
    setErrors({});
    setBusy(true);
    const eventId = newEventId("lead");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...v.lead, offer: offer.id, eventId, sourceUrl: location.href, utm: getAttribution(), company_website: honeypot.current?.value || "" }),
      });
      if (res.status === 400) {
        const data = await res.json().catch(() => ({}));
        if (data.errors) {
          setErrors(data.errors);
          setBusy(false);
          return;
        }
      }
    } catch {
      // Network hiccup: don't block the sale; the Stripe webhook still records the buyer.
    }
    track("Lead", { content_name: offer.contentName }, { eventId });
    setForm(v.lead, eventId);
    setBusy(false);
    setStep(2);
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4 px-[26px] pt-7 pb-[30px]">
      <div className="flex flex-col gap-1.5">
        <h3 className="m-0 text-[28px] leading-[1.05] font-bold tracking-[-0.025em]">{offer.modalTitle}</h3>
        <span className="text-[15px] text-body">{offer.modalSub}</span>
      </div>
      {fields.map((f) => (
        <label key={f.name} className="flex flex-col gap-[7px]">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-body">{f.label}</span>
          <input
            name={f.name}
            type={f.type}
            inputMode={f.mode}
            autoComplete={f.ac}
            placeholder={f.ph}
            required
            value={form[f.name]}
            aria-invalid={!!errors[f.name]}
            aria-describedby={errors[f.name] ? `${f.name}-err` : undefined}
            onChange={(e) => setLocal({ ...form, [f.name]: e.target.value })}
            className={inputCls}
          />
          {errors[f.name] && <span id={`${f.name}-err`} className="text-[13px] text-[#B42318]">{errors[f.name]}</span>}
        </label>
      ))}
      {/* honeypot */}
      <input ref={honeypot} name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <button type="submit" disabled={busy} className={`mt-1.5 ${primaryBtn}`}>
        {offer.submitLabel} <ArrowIcon size={18} />
      </button>
      <span className="text-center font-mono text-[12px] tracking-[0.04em] text-body">Confidential · Strict NDA · No spam</span>
    </form>
  );
}

/* ------------------------------ Step 2 ------------------------------ */

const elementsOptions: StripeElementsOptions = {
  mode: "payment",
  amount: PRICE_CENTS,
  currency: CURRENCY,
  fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" }],
  appearance: {
    theme: "stripe",
    variables: {
      fontFamily: "Geist, system-ui, sans-serif",
      fontSizeBase: "16px",
      colorPrimary: "#4B1E8C",
      colorText: "#0A0A0A",
      colorTextSecondary: "#4A4A4A",
      colorTextPlaceholder: "#8A8A8A",
      colorBackground: "#F5F5F2",
      colorDanger: "#B42318",
      borderRadius: "12px",
      spacingUnit: "4px",
    },
    rules: {
      ".Input": { border: "1px solid #E7E5DF", boxShadow: "none", padding: "15px 16px" },
      ".Input:focus": { borderColor: "#8B7BFF", backgroundColor: "#FFFFFF", boxShadow: "none" },
      ".Label": { fontFamily: "'Geist Mono', monospace", fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", color: "#4A4A4A" },
      ".Tab": { border: "1px solid #E7E5DF", boxShadow: "none" },
      ".Tab--selected": { borderColor: "#0A0A0A", boxShadow: "none" },
    },
  },
};

function OrderStep() {
  const { state, setStep } = useFunnel();
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    track("InitiateCheckout", { value: 49, currency: "USD", num_items: 1, content_name: "2027 strategy" }, { server: true, extra: { lead: state.form } });
  }, [state.form]);

  return (
    <div className="flex flex-col gap-5 px-[26px] pt-7 pb-[30px]">
      <div className="flex flex-col gap-1.5">
        <h3 className="m-0 text-[28px] leading-[1.05] font-bold tracking-[-0.025em]">Complete your order</h3>
        <span className="text-[15px] break-words text-body">Ordering as {state.form.name} · {state.form.email}</span>
      </div>
      <div className="overflow-hidden rounded-[18px] border border-line">
        <div className="bg-paper px-[18px] py-3.5 font-mono text-[11px] uppercase tracking-[0.1em] text-body">Order summary</div>
        <div className="flex items-start justify-between gap-4 px-[18px] py-4">
          <div className="flex flex-col gap-2">
            <span className="text-[17px] font-semibold">{PRODUCT_NAME}</span>
            {stack.map((it) => (
              <span key={it.t} className="flex gap-2 text-[14px] text-body"><span className="font-bold text-green">✓</span>{it.t}</span>
            ))}
          </div>
          <span className="text-[17px] font-bold">$49</span>
        </div>
        <div className="flex items-baseline justify-between border-t border-line px-[18px] py-4">
          <span className="text-[16px] font-semibold">Total due today</span>
          <span className="text-[30px] font-extrabold tracking-[-0.03em]">$49 <span className="text-[13px] font-medium tracking-normal text-body">USD</span></span>
        </div>
      </div>

      {STRIPE_PK ? (
        <Elements stripe={getStripe()} options={elementsOptions}>
          <PaymentForm />
        </Elements>
      ) : (
        <p className="m-0 rounded-[12px] bg-paper p-4 text-[15px] text-body">Payments aren’t configured yet (missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={() => setStep(1)} className="cursor-pointer border-0 bg-transparent p-0 text-[14px] text-body underline">← Edit details</button>
        <span className="inline-flex items-center gap-1.5 font-mono text-[12px] text-body"><LockIcon />Secure checkout · Fully refundable</span>
      </div>
    </div>
  );
}

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { state, markPaid, clearPaymentError } = useFunnel();
  const [error, setError] = useState<string | undefined>(state.paymentError);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const attemptId = useRef(newEventId("checkout"));

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError(undefined);
    clearPaymentError();

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message);
      setBusy(false);
      return;
    }

    let clientSecret: string;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lead: state.form, attemptId: attemptId.current, sourceUrl: location.href, utm: getAttribution() }),
      });
      const data = await res.json();
      if (!res.ok || !data.clientSecret) throw new Error(data.error || "Payment could not be started.");
      clientSecret = data.clientSecret;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment could not be started.");
      setBusy(false);
      return;
    }

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      redirect: "if_required",
      confirmParams: {
        return_url: `${location.origin}${location.pathname}?checkout=return`,
        payment_method_data: { billing_details: { name: state.form.name, email: state.form.email, phone: state.form.phone } },
      },
    });

    if (confirmError) {
      setError(confirmError.message || "Your payment was declined. Please try again.");
      setBusy(false);
      // A failed confirm leaves the intent reusable, but a fresh attempt id keeps things simple.
      attemptId.current = newEventId("checkout");
      return;
    }
    if (paymentIntent?.status === "succeeded") {
      markPaid(paymentIntent.id);
    } else if (paymentIntent?.status === "processing") {
      setError("Your payment is processing. We’ll email you as soon as it’s confirmed.");
      setBusy(false);
    } else {
      setError("Payment wasn’t completed. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-body">Payment details</span>
        <PaymentElement
          onReady={() => setReady(true)}
          options={{
            layout: "tabs",
            defaultValues: { billingDetails: { name: state.form.name, email: state.form.email, phone: state.form.phone } },
            fields: { billingDetails: { name: "never", email: "never", phone: "never" } },
          }}
        />
        {!ready && <div className="h-[120px] animate-pulse rounded-[12px] bg-paper" aria-hidden />}
      </div>
      {error && <p role="alert" className="m-0 rounded-[12px] bg-[#FEF3F2] px-4 py-3 text-[14px] text-[#B42318]">{error}</p>}
      <button type="submit" disabled={!stripe || !ready || busy} className={primaryBtn}>
        {busy ? "Processing…" : "Complete order · $49"}
      </button>
      <p className="m-0 -mt-2 text-center text-[13px] leading-snug text-body">
        By completing your order you agree to the{" "}
        <a href={LEGAL.terms} target="_blank" rel="noopener" className="underline">purchase terms</a>, including our 14-day refund policy.
      </p>
    </form>
  );
}

/* ------------------------------ Step 3 ------------------------------ */

function BookStep() {
  const { state, offer } = useFunnel();
  const first = state.form.name.trim().split(/\s+/)[0];

  const src = (() => {
    const q = new URLSearchParams({
      hide_gdpr_banner: "1",
      embed_type: "Inline",
      embed_domain: location.hostname,
      name: state.form.name,
      email: state.form.email,
      a1: state.form.phone,
      primary_color: "4b1e8c",
    });
    return `${CALENDLY_URL}${CALENDLY_URL.includes("?") ? "&" : "?"}${q}`;
  })();

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== "https://calendly.com" || e.data?.event !== "calendly.event_scheduled") return;
      const ref = state.paymentIntentId ?? state.leadId ?? newEventId("s");
      const key = `na_scheduled_${ref}`;
      try {
        if (sessionStorage.getItem(key)) return;
        sessionStorage.setItem(key, "1");
      } catch {}
      track("Schedule", { content_name: `${offer.contentName}: call` }, {
        eventId: `schedule_${ref}`,
        server: true,
        extra: {
          offer: offer.id,
          lead: state.form,
          paymentIntentId: state.paymentIntentId,
          calendly: { event: e.data.payload?.event?.uri, invitee: e.data.payload?.invitee?.uri },
        },
      });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [state.form, state.paymentIntentId, state.leadId, offer]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4 border-b border-line px-[26px] pt-6 pb-[18px]">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-mint-light"><CheckIcon size={22} color="#0A0A0A" /></span>
        <div className="flex flex-col gap-1">
          <h3 className="m-0 text-[24px] font-bold tracking-[-0.02em]">{offer.confirmTitle(first)}</h3>
          <span className="text-[15px] text-body">{offer.confirmSub}</span>
        </div>
      </div>
      <iframe src={src} title="Book your kickoff call" className="block h-[700px] w-full border-0 bg-white" />
    </div>
  );
}
