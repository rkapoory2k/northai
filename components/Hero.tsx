import type { ReactNode } from "react";

/**
 * Landing hero. Phones/tablets stack headline → video → CTA → copy, so the video and CTA sit on
 * the first screen; desktops (lg+) put headline, copy and CTA on the left and the video on the right.
 */
export default function Hero({ eyebrow, title, video, cta, body }: { eyebrow: ReactNode; title: ReactNode; video: ReactNode; cta: ReactNode; body: ReactNode }) {
  return (
    <section
      id="top"
      className="mx-auto flex max-w-[1080px] flex-col items-center gap-5 px-6 pt-8 pb-16 text-center sm:gap-7 sm:pt-16 lg:grid lg:max-w-[1240px] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:items-center lg:gap-x-14 lg:gap-y-6 lg:pt-14 lg:text-left"
    >
      <div className="hidden sm:block lg:col-start-1 lg:row-start-1">{eyebrow}</div>
      <h1 className="m-0 text-[clamp(36px,5.4vw,70px)] leading-none font-bold tracking-[-0.04em] text-balance lg:col-start-1 lg:row-start-2 lg:text-[clamp(40px,3.9vw,58px)]">
        {title}
      </h1>
      <div className="flex w-full justify-center lg:col-start-2 lg:row-span-4 lg:row-start-1">{video}</div>
      <div className="flex flex-col items-center gap-3 lg:col-start-1 lg:row-start-4 lg:items-start">{cta}</div>
      <p className="m-0 max-w-[740px] text-[20px] leading-normal text-pretty text-body lg:col-start-1 lg:row-start-3 lg:text-[18px]">{body}</p>
    </section>
  );
}
