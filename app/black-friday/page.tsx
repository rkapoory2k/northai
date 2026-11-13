import type { Metadata } from "next";
import FunnelProvider from "@/components/funnel/FunnelProvider";
import ClaimButton from "@/components/funnel/ClaimButton";
import Faq from "@/components/Faq";
import HeroVideo from "@/components/HeroVideo";
import { Brands, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { BFCM_VIMEO_ID, LEGAL } from "@/lib/config";
import { bfFaqs, bfOutcomes, bfPromises, bfStack, bfTimeline } from "@/lib/content-bfcm";

const title = "Free Black Friday creative analysis | North AI";
const description =
  "Every brand spends more over Black Friday and Cyber Monday. Send us 5 of your ads and we’ll show you how to stand out, for free.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/black-friday" },
  openGraph: { title, description, url: "/black-friday", siteName: "North AI", type: "website", locale: "en_GB" },
  twitter: { card: "summary_large_image", title, description },
};

const Dot = ({ className }: { className: string }) => <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${className}`} />;
const NOTE = "Free for Black Friday & Cyber Monday";

export default function BlackFridayPage() {
  return (
    <FunnelProvider offer="bfcm">
      <SiteHeader note={NOTE} cta="Claim your free analysis" />

      <main>
        {/* Hero */}
        <section id="top" className="mx-auto flex max-w-[1080px] flex-col items-center gap-7 px-6 pt-[88px] pb-16 text-center">
          <span className="inline-flex items-center gap-2.5 rounded-full bg-ink/6 px-4 py-[9px] font-mono text-[13px] font-medium uppercase tracking-[0.1em] text-body">
            <Dot className="bg-violet" />Black Friday &amp; Cyber Monday
          </span>
          <h1 className="m-0 text-[clamp(38px,5.4vw,70px)] leading-none font-bold tracking-[-0.04em] text-balance">
            Stand out this Black Friday. <span className="highlight">We’ll analyse 5 of your ads</span> for free.
          </h1>
          <p className="m-0 max-w-[740px] text-[20px] leading-normal text-pretty text-body">
            Every brand is about to spend more than ever, at the same time. Feeds fill up, costs climb, and most ads look the same. We’ll show you which of your creatives will stop the scroll, which will get skipped, and how to fix them before you spend.
          </p>
          <div className="flex flex-col items-center gap-3.5">
            <span className="inline-flex items-center gap-2 rounded-full bg-mint-light px-3.5 py-[7px] font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-ink">
              <Dot className="bg-green" />{NOTE}
            </span>
            <ClaimButton className="btn-dark gap-3 px-9 py-[22px] text-[20px]">
              Get my free analysis <ArrowIcon />
            </ClaimButton>
            <span className="font-mono text-[13px] tracking-[0.04em] text-body">Completely free · No card needed · Strict NDA</span>
          </div>
          <HeroVideo vimeoId={BFCM_VIMEO_ID} title="5 Free Ad Tests - Black Friday" loop />
        </section>

        <Brands />

        {/* The problem */}
        <section className="border-y border-line bg-white">
          <div className="mx-auto flex max-w-[1080px] flex-col gap-14 px-6 py-[104px]">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-12">
              <div className="flex flex-col gap-[18px]">
                <span className="eyebrow text-violet-deep">The Black Friday problem</span>
                <h2 className="h2">Everyone’s spending more. Most of it looks the same.</h2>
              </div>
              <div className="flex flex-col gap-[18px] text-[18px] leading-[1.6] text-body">
                <p className="m-0 text-pretty">Over Black Friday and Cyber Monday, almost every brand in your category raises its budget at once. Auctions get more competitive, costs go up, and feeds fill with near-identical discount ads.</p>
                <p className="m-0 text-pretty">When everyone is shouting “30% off”, the ads that win are the ones people actually stop for: a sharper hook, a clearer offer, a format that doesn’t look like everything around it.</p>
                <p className="m-0 font-medium text-pretty text-ink">A few fixes before launch can matter more than a bigger budget during it.</p>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <h3 className="m-0 text-[22px] font-semibold tracking-[-0.015em]">What changes when your creative is checked first</h3>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-3.5">
                {bfOutcomes.map((o) => (
                  <div key={o.n} className="flex flex-col gap-2.5 rounded-[20px] border border-line bg-paper p-6">
                    <span className="flex size-10 items-center justify-center rounded-[11px] bg-mint-light font-mono text-[13px] font-medium">{o.n}</span>
                    <h4 className="m-0 text-[20px] font-bold tracking-[-0.015em]">{o.t}</h4>
                    <p className="m-0 text-[16px] leading-normal text-pretty text-body">{o.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Everything you get */}
        <section className="dots-dark bg-ink text-white">
          <div className="mx-auto flex max-w-[880px] flex-col gap-11 px-6 py-[104px]">
            <div className="flex flex-col items-center gap-[18px] text-center">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/8 px-4 py-[9px] font-mono text-[13px] font-medium uppercase tracking-[0.1em] text-white/85">
                <Dot className="bg-mint" />Everything you get
              </span>
              <h2 className="h2">Your 5 creatives, <span className="text-mint">analysed for free.</span></h2>
              <p className="m-0 max-w-[640px] text-[19px] leading-normal text-pretty text-white/75">Know what to fix before Black Friday, not after.</p>
            </div>
            <div className="flex flex-col overflow-hidden rounded-[24px] border border-white/14">
              {bfStack.map((s) => (
                <div key={s.t} className="flex items-start gap-[18px] border-b border-white/10 bg-white/3 px-[26px] py-6">
                  <CheckIcon className="mt-0.5 shrink-0" />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-[20px] font-semibold tracking-[-0.01em]">{s.t}</span>
                    <span className="text-[16px] leading-[1.45] text-pretty text-white/70">{s.d}</span>
                  </div>
                  <span className="shrink-0 rounded-full bg-mint/14 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-mint max-sm:hidden">Included</span>
                </div>
              ))}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white px-[26px] py-6 text-ink">
                <span className="text-[20px] font-semibold tracking-[-0.01em]">Your investment</span>
                <span className="text-[44px] font-extrabold tracking-[-0.04em]">Free</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3.5 text-center">
              <ClaimButton className="btn-light gap-3 px-[34px] py-5 text-[19px]">Claim my free analysis</ClaimButton>
              <span className="font-mono text-[13px] tracking-[0.04em] text-white/65">No card needed · Yours to keep · Strict NDA</span>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto flex max-w-[1080px] flex-col gap-12 px-6 py-[104px]">
          <div className="flex max-w-[720px] flex-col gap-[18px]">
            <span className="eyebrow text-violet-deep">Exactly how it works</span>
            <h2 className="h2">You book a call. <span className="font-semibold text-muted">We do the analysis.</span></h2>
          </div>
          <div className="flex flex-col border-t-2 border-ink">
            {bfTimeline.map((s) => (
              <div key={s.n} className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] items-start gap-x-8 gap-y-3 border-b border-line py-[26px]">
                <div className="flex items-center gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-[12px] bg-ink font-mono text-[15px] font-medium text-white">{s.n}</span>
                  <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-green">{s.when}</span>
                </div>
                <div className="col-span-2 flex flex-col gap-1.5 max-[499px]:col-span-1">
                  <h3 className="m-0 text-[22px] font-semibold tracking-[-0.015em]">{s.t}</h3>
                  <p className="m-0 text-[17px] leading-normal text-pretty text-body">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Zero risk */}
        <section className="mx-auto max-w-[1080px] px-6 pb-[104px]">
          <div className="dots-dark grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-10 rounded-[28px] bg-ink px-6 py-12 text-white sm:px-11 sm:py-14">
            <div className="flex flex-col gap-[18px]">
              <span className="eyebrow text-mint">Zero risk</span>
              <h2 className="m-0 text-[clamp(32px,4vw,52px)] leading-none font-bold tracking-[-0.035em] text-balance">Free, yours to keep, and no strings.</h2>
              <p className="m-0 text-[18px] leading-[1.55] text-pretty text-white/75">Use the analysis however you like: with your in-house team, your agency, or on your own. There’s nothing to buy.</p>
            </div>
            <div className="flex flex-col gap-2.5">
              {bfPromises.map((p) => (
                <div key={p} className="flex items-center gap-3.5 rounded-[16px] border border-white/12 bg-white/5 px-[18px] py-4 text-[17px]">
                  <CheckIcon size={20} className="shrink-0" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto flex max-w-[880px] flex-col gap-9 px-6 pb-[104px]">
          <div className="flex flex-col items-center gap-[18px] text-center">
            <span className="eyebrow text-violet-deep">Questions brands ask</span>
            <h2 className="h2">Clear answers.</h2>
          </div>
          <Faq items={bfFaqs} />
        </section>

        {/* Apply */}
        <section id="apply" className="dots-dark scroll-mt-[60px] bg-ink text-white">
          <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-14 px-6 py-[104px]">
            <div className="flex flex-col gap-[22px]">
              <h2 className="m-0 text-[clamp(38px,5vw,64px)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
                Don’t disappear in the rush. <span className="text-mint">Get your ads checked first.</span>
              </h2>
              <div className="flex flex-col gap-3 pt-2">
                <span className="eyebrow text-mint">P.S. The whole thing in three lines</span>
                <p className="m-0 text-[18px] leading-[1.55] text-white/80">Over Black Friday and Cyber Monday, every brand in your category is competing for the same attention.</p>
                <p className="m-0 text-[18px] leading-[1.55] text-white/80">Book a call, send us 5 ads, and we’ll show you how to make them stand out before you spend.</p>
                <p className="m-0 text-[18px] leading-[1.55] font-semibold text-white">Free, under NDA, and no obligation.</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-4 self-center">
              <ClaimButton className="btn-light gap-3.5 px-10 py-6 text-[21px] shadow-[0_30px_70px_-30px_rgba(168,239,160,0.5)]">
                Claim my free analysis <ArrowIcon size={20} />
              </ClaimButton>
              <span className="font-mono text-[13px] tracking-[0.04em] text-white/65">Free · Confidential · Strict NDA policy</span>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter termsHref={LEGAL.mainTerms} />
    </FunnelProvider>
  );
}
