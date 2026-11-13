import Image from "next/image";
import ClaimButton from "@/components/funnel/ClaimButton";
import { LEGAL } from "@/lib/config";
import { brands } from "@/lib/content";

export function SiteHeader({ note, cta }: { note?: string; cta: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-[rgba(245,245,242,0.88)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-6 py-3.5">
        <a href="#top" className="flex items-center">
          <Image src="/logo-wordmark.png" alt="North AI" width={107} height={28} priority className="block h-7 w-auto" />
        </a>
        <div className="flex items-center gap-[18px]">
          {note && (
            <span className="hidden items-center gap-2 font-mono text-[12px] uppercase tracking-[0.06em] text-body md:inline-flex">
              <span className="size-[7px] rounded-full bg-green" />
              {note}
            </span>
          )}
          <ClaimButton className="btn-dark px-5 py-[11px] text-[15px]">{cta}</ClaimButton>
        </div>
      </div>
    </header>
  );
}

export function Brands() {
  return (
    <section className="mx-auto flex max-w-[1080px] flex-col items-center gap-8 px-6 pt-4 pb-[88px]">
      <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-body">Brands we’ve worked with</span>
      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(150px,1fr))] items-center justify-items-center gap-x-8 gap-y-9">
        {brands.map((b) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={b.src} src={b.src} alt={b.name} loading="lazy" style={{ height: b.h }} className="block w-auto max-w-full object-contain" />
        ))}
      </div>
    </section>
  );
}

export function SiteFooter({ termsHref = LEGAL.terms }: { termsHref?: string }) {
  return (
    <footer className="border-t border-white/14 bg-ink text-white">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-5 px-6 py-8">
        <Image src="/logo-wordmark.png" alt="North AI" width={92} height={24} className="block h-6 w-auto invert" />
        <nav className="flex flex-wrap gap-5 text-[14px]">
          <a href={termsHref} className="text-white/70 hover:text-white">Terms of Service</a>
          <a href={LEGAL.privacy} className="text-white/70 hover:text-white">Privacy Policy</a>
          <a href={LEGAL.cookies} className="text-white/70 hover:text-white">Cookie Policy</a>
        </nav>
        <span className="text-[14px] text-white/60">© {new Date().getFullYear()} North AI Ltd. All rights reserved. Registered in the United Kingdom.</span>
      </div>
    </footer>
  );
}
