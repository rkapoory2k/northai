import FunnelProvider from "@/components/funnel/FunnelProvider";
import ClaimButton from "@/components/funnel/ClaimButton";
import Faq from "@/components/Faq";
import HeroVideo from "@/components/HeroVideo";
import Hero from "@/components/Hero";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { SPOTS_CAPACITY, SPOTS_LEFT, SPOTS_LINE, VIMEO_ID } from "@/lib/config";
import { Brands, SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { alternatives, compare, faqs, outcomes, parts, promises, stack, timeline } from "@/lib/content";

const Dot = ({ className }: { className: string }) => <span aria-hidden className={`size-1.5 shrink-0 rounded-full ${className}`} />;

export default function Page() {
  return (
    <FunnelProvider>
      <SiteHeader note={SPOTS_LINE} cta="Claim your strategy" />

      <main>
        {/* Hero */}
        <Hero
          eyebrow={
            <span className="inline-flex items-center gap-2.5 rounded-full bg-ink/6 px-4 py-[9px] font-mono text-[13px] font-medium uppercase tracking-[0.1em] text-body">
            <Dot className="bg-violet" />$49 2027 marketing strategy
          </span>
          }
          title={<>Walk into 2027 with a <span className="highlight"><span className="whitespace-nowrap">data-backed</span> creative strategy</span> your team can build from day one.</>}
          video={<HeroVideo vimeoId={VIMEO_ID} title="2027 Marketing Strategy" />}
          cta={
            <>
            <ClaimButton className="btn-dark gap-3 whitespace-nowrap px-9 py-[22px] text-[20px] max-sm:px-7 max-sm:py-[18px] max-sm:text-[18px]">
              Get your strategy for $49 <ArrowIcon />
            </ClaimButton>
            <span className="font-mono text-[13px] tracking-[0.04em] text-body">Full refund available · Yours to keep · Strict NDA</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-mint-light px-3.5 py-[7px] font-mono text-[12px] font-medium uppercase tracking-[0.08em] text-ink">
              <Dot className="bg-green" />{SPOTS_LINE}
            </span>
            </>
          }
          body={<>We map what your competitors are running, what’s working for them and where the outliers are. Then we hand you next year’s creative trends, five data-backed mock-ups and a full paid media strategy. All for $49.</>}
        />

        <Brands />

        {/* The cost of guessing */}
        <section className="border-y border-line bg-white">
          <div className="mx-auto flex max-w-[1080px] flex-col gap-14 px-6 py-[104px]">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-12">
              <div className="flex flex-col gap-[18px]">
                <span className="eyebrow text-violet-deep">The cost of guessing</span>
                <h2 className="h2">Most brands plan next year’s creative on gut feel.</h2>
              </div>
              <div className="flex flex-col gap-[18px] text-[18px] leading-[1.6] text-body">
                <p className="m-0 text-pretty">The brief gets written from last year’s best performer and a few ads someone saw on their feed. Meanwhile your competitors are already testing the angles that will define your category next year.</p>
                <p className="m-0 text-pretty">The outliers, the ads quietly outperforming everything around them, are visible in the data. Most teams just never look.</p>
                <p className="m-0 font-medium text-pretty text-ink">A strategy built from that data gives your creative team a head start, not a blank page.</p>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <h3 className="m-0 text-[22px] font-semibold tracking-[-0.015em]">Here’s what changes when your strategy is built on data</h3>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-3.5">
                {outcomes.map((o) => (
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
              <h2 className="h2">Your 2027 creative strategy, <span className="text-mint">built for your brand.</span></h2>
              <p className="m-0 max-w-[640px] text-[19px] leading-normal text-pretty text-white/75">Everything your team needs to know what to make next, and where to run it.</p>
            </div>
            <div className="flex flex-col overflow-hidden rounded-[24px] border border-white/14">
              {stack.map((s) => (
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
                <span className="text-[20px] font-semibold tracking-[-0.01em]">Your investment today</span>
                <span className="text-[44px] font-extrabold tracking-[-0.04em]">$49</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3.5 text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-mint/14 px-3.5 py-[7px] font-mono text-[12px] uppercase tracking-[0.08em] text-mint">
                <Dot className="bg-mint" />{SPOTS_LINE}
              </span>
              <ClaimButton className="btn-light gap-3 px-[34px] py-5 text-[19px]">Claim your strategy for $49</ClaimButton>
              <span className="font-mono text-[13px] tracking-[0.04em] text-white/65">Fully refundable · Yours to keep · Strict NDA</span>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mx-auto flex max-w-[1080px] flex-col gap-12 px-6 py-[104px]">
          <div className="flex max-w-[720px] flex-col gap-[18px]">
            <span className="eyebrow text-violet-deep">Exactly how it works</span>
            <h2 className="h2">You spend two minutes. <span className="font-semibold text-muted">We do the rest.</span></h2>
          </div>
          <div className="flex flex-col border-t-2 border-ink">
            {timeline.map((s) => (
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

        {/* The 4-part strategy */}
        <section className="bg-mint-band">
          <div className="mx-auto flex max-w-[1080px] flex-col gap-12 px-6 py-[104px]">
            <div className="flex max-w-[720px] flex-col gap-[18px]">
              <span className="eyebrow text-green">What we build</span>
              <h2 className="h2">The 4-part 2027 strategy</h2>
              <p className="m-0 text-[19px] leading-normal text-pretty text-body">Every strategy is built around four parts. Each one has a single job: give your team a clear, evidence-backed answer to “what do we make next?”</p>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-[18px]">
              {parts.map((p) => (
                <div key={p.n} className="flex flex-col gap-3.5 rounded-[24px] border border-line bg-white px-7 py-[30px]">
                  <span className="text-[56px] leading-[0.85] font-extrabold tracking-[-0.05em] text-ink">{p.n}</span>
                  <h3 className="m-0 text-[24px] leading-[1.1] font-bold tracking-[-0.02em]">{p.t}</h3>
                  <p className="m-0 text-[16px] leading-normal text-pretty text-body">{p.d}</p>
                  <div className="mt-1 flex flex-col gap-2">
                    {p.points.map((pt) => (
                      <span key={pt} className="flex gap-2.5 text-[15px] leading-[1.4]"><span className="font-bold text-green">✓</span>{pt}</span>
                    ))}
                  </div>
                  <span className="mt-auto border-t border-line pt-3.5 text-[15px] font-semibold text-violet-deep">→ {p.job}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why a strategy */}
        <section className="mx-auto flex max-w-[1080px] flex-col gap-11 px-6 py-[104px]">
          <div className="flex max-w-[760px] flex-col gap-[18px]">
            <span className="eyebrow text-violet-deep">Why a strategy</span>
            <h2 className="h2">Why a strategy, and not more budget or more creative</h2>
            <p className="m-0 text-[19px] leading-normal text-pretty text-body">Every way of planning next year costs you something. Money, production time, or another quarter of guessing. A strategy built on market data is the only one that tells you where to aim first.</p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-3.5">
            {alternatives.map((a) => (
              <div key={a.k} className="flex flex-col gap-2.5 rounded-[20px] border border-line bg-white px-6 py-[26px]">
                <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-muted">{a.k}</span>
                <h3 className="m-0 text-[21px] font-bold tracking-[-0.015em]">{a.t}</h3>
                <p className="m-0 text-[16px] leading-normal text-pretty text-body">{a.d}</p>
              </div>
            ))}
            <div className="flex flex-col gap-2.5 rounded-[20px] bg-ink px-6 py-[26px] text-white shadow-[0_24px_60px_-28px_rgba(75,30,140,0.6)]">
              <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-mint">The fix</span>
              <h3 className="m-0 text-[21px] font-bold tracking-[-0.015em]">A North AI strategy</h3>
              <p className="m-0 text-[16px] leading-normal text-pretty text-white/75">Just $49 and built from real market data. Your team starts 2027 knowing exactly what to make and where to run it.</p>
            </div>
          </div>
        </section>

        {/* Your options */}
        <section className="border-y border-line bg-white">
          <div className="mx-auto flex max-w-[1080px] flex-col gap-11 px-6 py-[104px]">
            <div className="flex flex-col items-center gap-[18px] text-center">
              <span className="eyebrow text-violet-deep">Your options</span>
              <h2 className="h2">Three ways to plan your 2027 creative</h2>
              <p className="m-0 text-[19px] leading-normal text-body">Do it in-house, hire an agency, or let our team build it for you.</p>
            </div>
            <div className="overflow-x-auto">
              <div className="flex min-w-[620px] flex-col" role="table" aria-label="Comparison of planning options">
                <div role="row" className="grid grid-cols-[1.4fr_1fr_1fr_1fr] gap-3 border-b-2 border-ink px-5 pb-3.5 font-mono text-[13px] uppercase tracking-[0.08em] text-muted">
                  <span role="columnheader" />
                  <span role="columnheader" className="text-center">In-house</span>
                  <span role="columnheader" className="text-center">Agency</span>
                  <span role="columnheader" className="text-center text-violet-deep">North AI</span>
                </div>
                {compare.map((r) => (
                  <div role="row" key={r.label} className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-3 border-b border-line px-5 py-[18px] text-[16px]">
                    <span role="rowheader" className="text-[17px] font-semibold">{r.label}</span>
                    <span role="cell" className="text-center text-body">{r.a}</span>
                    <span role="cell" className="text-center text-body">{r.b}</span>
                    <span role="cell" className="rounded-[10px] bg-mint-band py-2 text-center font-bold">{r.c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Zero risk */}
        <section className="mx-auto max-w-[1080px] px-6 py-[104px]">
          <div className="dots-dark grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-center gap-10 rounded-[28px] bg-ink px-6 py-12 text-white sm:px-11 sm:py-14">
            <div className="flex flex-col gap-[18px]">
              <span className="eyebrow text-mint">Zero risk</span>
              <h2 className="m-0 text-[clamp(32px,4vw,52px)] leading-none font-bold tracking-[-0.035em] text-balance">$49, yours to keep, and no strings.</h2>
              <p className="m-0 text-[18px] leading-[1.55] text-pretty text-white/75">You keep the strategy and all five mock-ups whether we ever work together or not. Take them to your in-house team, your agency, or anyone you like.</p>
            </div>
            <div className="flex flex-col gap-2.5">
              {promises.map((p) => (
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
            <span className="eyebrow text-violet-deep">Questions CMOs ask</span>
            <h2 className="h2">Clear answers.</h2>
          </div>
          <Faq items={faqs} />
        </section>

        {/* Apply */}
        <section id="apply" className="dots-dark scroll-mt-[60px] bg-ink text-white">
          <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-start gap-14 px-6 py-[104px]">
            <div className="flex flex-col gap-[22px]">
              <h2 className="m-0 text-[clamp(38px,5vw,64px)] leading-[0.98] font-bold tracking-[-0.04em] text-balance">
                Stop guessing. <span className="text-mint">Start 2027 with a plan.</span>
              </h2>
              <div className="flex flex-col gap-2.5 rounded-[20px] border border-white/12 bg-white/5 px-6 py-[22px]">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-mono text-[12px] uppercase tracking-[0.1em] text-white/60">Strategies open this month</span>
                  <span className="text-[18px] font-bold whitespace-nowrap">
                    <span className="text-[32px] font-extrabold tracking-[-0.03em]">{SPOTS_LEFT}</span> of {SPOTS_CAPACITY} left
                  </span>
                </div>
                <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${SPOTS_CAPACITY}, minmax(0, 1fr))` }} aria-hidden>
                  {Array.from({ length: SPOTS_CAPACITY }, (_, i) => (
                    <span key={i} className={`h-2.5 rounded-[5px] ${i < SPOTS_CAPACITY - SPOTS_LEFT ? "bg-white/14" : "bg-mint"}`} />
                  ))}
                </div>
                <span className="text-[14px] text-white/65">Every strategy is researched and built by senior strategists, so we cap it at {SPOTS_CAPACITY} brands a month.</span>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <span className="eyebrow text-mint">P.S. The whole thing in three lines</span>
                <p className="m-0 text-[18px] leading-[1.55] text-white/80">Your competitors are already testing the angles that will define your category in 2027.</p>
                <p className="m-0 text-[18px] leading-[1.55] text-white/80">For $49, we map what’s working for them, the trends coming next, and hand you five mock-ups and a full paid media strategy.</p>
                <p className="m-0 text-[18px] leading-[1.55] font-semibold text-white">Yours to keep, under NDA, and no obligation.</p>
              </div>
            </div>
            <div className="flex flex-col items-start gap-4 self-center">
              <ClaimButton className="btn-light gap-3.5 px-10 py-6 text-[21px] shadow-[0_30px_70px_-30px_rgba(168,239,160,0.5)]">
                Claim my 2027 strategy <ArrowIcon size={20} />
              </ClaimButton>
              <span className="font-mono text-[13px] tracking-[0.04em] text-white/65">Confidential · Zero obligations · Strict NDA policy</span>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </FunnelProvider>
  );
}
