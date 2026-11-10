import type { Metadata } from "next";
import Image from "next/image";
import { LEGAL } from "@/lib/config";

export const metadata: Metadata = {
  title: "2027 Strategy purchase terms | North AI",
  description: "Terms for the $49 2027 Creative & Paid Media Strategy from North AI Ltd, including the 14-day refund policy.",
  alternates: { canonical: "/terms" },
};

const UPDATED = "10 November 2026";

const sections: { h: string; p: React.ReactNode[] }[] = [
  {
    h: "1. Who we are",
    p: [
      <>The 2027 Creative &amp; Paid Media Strategy (the “Strategy”) is sold by <strong>North AI Ltd</strong>, a company registered in the United Kingdom (“North AI”, “we”, “us”).</>,
      <>These purchase terms apply to the Strategy only. Anything they don’t cover is governed by the North AI <a href={LEGAL.mainTerms}>Terms of Service</a>. Where the two differ, these purchase terms apply to your Strategy order.</>,
    ],
  },
  {
    h: "2. What you get",
    p: [
      "For a one-off payment of $49 (USD), we prepare a 2027 creative strategy for your brand, consisting of: a competitor analysis, the key creative trends for your category, five data-backed creative mock-ups (concepts to brief from, not finished ads) and a paid media strategy.",
      "After payment you book a 30-minute kickoff call so we can gather what we need about your brand, market and channels. We may ask for additional information; sharing ad account access is optional.",
      "The Strategy is based on market data and our professional judgement. It is guidance, not a guarantee of any particular commercial result.",
    ],
  },
  {
    h: "3. Price and payment",
    p: [
      "The price is $49 USD, charged once at checkout. There are no subscriptions, retainers or hidden costs. Payments are processed securely by Stripe; we never see or store your full card details. Your bank may apply currency conversion fees if your card isn’t in USD.",
    ],
  },
  {
    h: "4. 14-day refund policy",
    p: [
      <>You can request a full refund for any reason within <strong>14 days of purchase</strong>. Email <a href={`mailto:${LEGAL.contact}`}>{LEGAL.contact}</a> from the email address you ordered with, or include it in your message. Refunds are made to the original payment method, usually within 5–10 business days of our confirmation, depending on your bank.</>,
      "Nothing in these terms affects your statutory rights.",
    ],
  },
  {
    h: "5. Ownership and confidentiality",
    p: [
      "Once delivered, the Strategy and mock-ups are yours to keep and use within your business, including with your in-house team, your agency or anyone else you choose, whether or not you work with us again. This continues to apply if you are refunded.",
      "We treat everything you share with us about your brand as confidential and will not disclose it to third parties, other than the service providers we use to deliver the Strategy. We are happy to sign a mutual NDA on request.",
      "North AI keeps ownership of its underlying methods, tools, software and data.",
    ],
  },
  {
    h: "6. No obligation",
    p: [
      "Buying the Strategy does not commit you to any further work, retainer or software with North AI. If you would like help putting it into practice, we can discuss that separately.",
    ],
  },
  {
    h: "7. Liability",
    p: [
      "Our total liability to you in connection with the Strategy is limited to the amount you paid for it. We are not liable for indirect or consequential losses, or for loss of profits, revenue or data. Nothing in these terms limits liability that cannot be limited by law.",
    ],
  },
  {
    h: "8. Your data",
    p: [
      <>We use the details you give us (name, email, phone) to process your order, arrange your kickoff call and deliver the Strategy. See our <a href={LEGAL.privacy}>Privacy Policy</a> and <a href={LEGAL.cookies}>Cookie Policy</a> for how we handle personal data and cookies, including Meta advertising measurement, which only runs if you accept cookies.</>,
    ],
  },
  {
    h: "9. Governing law and contact",
    p: [
      <>These terms are governed by the laws of England and Wales. Questions or refund requests: <a href={`mailto:${LEGAL.contact}`}>{LEGAL.contact}</a>.</>,
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-line bg-[rgba(245,245,242,0.88)] backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-3.5">
          <a href="/" className="flex items-center">
            <Image src="/logo-wordmark.png" alt="North AI" width={107} height={28} priority className="block h-7 w-auto" />
          </a>
          <a href="/" className="btn-dark px-5 py-[11px] text-[15px]">Back to the strategy</a>
        </div>
      </header>
      <main className="mx-auto flex max-w-[760px] flex-col gap-10 px-6 py-20">
        <div className="flex flex-col gap-4">
          <span className="eyebrow text-violet-deep">Legal · Purchase terms</span>
          <h1 className="h2">2027 Strategy purchase terms</h1>
          <p className="m-0 font-mono text-[13px] tracking-[0.04em] text-body">Last updated: {UPDATED}</p>
        </div>
        {sections.map((s) => (
          <section key={s.h} className="flex flex-col gap-3">
            <h2 className="m-0 text-[22px] font-semibold tracking-[-0.015em]">{s.h}</h2>
            {s.p.map((para, i) => (
              <p key={i} className="m-0 text-[17px] leading-[1.6] text-body [&_a]:text-violet-deep [&_a]:underline">{para}</p>
            ))}
          </section>
        ))}
      </main>
      <footer className="border-t border-white/14 bg-ink text-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-5 px-6 py-8">
          <Image src="/logo-wordmark.png" alt="North AI" width={92} height={24} className="block h-6 w-auto invert" />
          <nav className="flex flex-wrap gap-5 text-[14px]">
            <a href={LEGAL.terms} className="text-white/70 hover:text-white">Purchase terms</a>
            <a href={LEGAL.privacy} className="text-white/70 hover:text-white">Privacy Policy</a>
            <a href={LEGAL.cookies} className="text-white/70 hover:text-white">Cookie Policy</a>
          </nav>
          <span className="text-[14px] text-white/60">© {new Date().getFullYear()} North AI Ltd. All rights reserved.</span>
        </div>
      </footer>
    </>
  );
}
