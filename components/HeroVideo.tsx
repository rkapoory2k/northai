"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/tracking";

/** Vimeo embed; fires ViewContent (Pixel + CAPI) the first time the video plays. */
export default function HeroVideo({ vimeoId, title, loop = false }: { vimeoId?: string; title: string; loop?: boolean }) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!vimeoId) return;
    let player: import("@vimeo/player").default | undefined;
    let done = false;
    (async () => {
      const { default: Player } = await import("@vimeo/player");
      if (!ref.current) return;
      player = new Player(ref.current);
      player.on("play", () => {
        if (done) return;
        done = true;
        track("ViewContent", { content_name: "Hero video" }, { server: true });
      });
    })();
    return () => {
      player?.off("play");
    };
  }, [vimeoId]);

  return (
    <div className="relative mt-6 aspect-[4/3] w-full max-w-[880px] overflow-hidden rounded-[26px] border border-line bg-ink shadow-[0_30px_70px_-30px_rgba(10,10,10,0.7)]">
      {!vimeoId ? (
        <div className="dots-dark absolute inset-0 flex flex-col items-center justify-center gap-[18px]">
          <span className="flex size-[84px] items-center justify-center rounded-full bg-white shadow-[0_20px_50px_-20px_rgba(168,239,160,0.6)]">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="#0A0A0A" className="ml-1" aria-hidden><path d="M7 4.5v15l13-7.5z" /></svg>
          </span>
          <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-white/75">Video coming soon</span>
        </div>
      ) : (
      <iframe
        ref={ref}
        src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&autoplay=1&muted=1&dnt=1${loop ? "&loop=1" : ""}`}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 block h-full w-full border-0"
      />
      )}
    </div>
  );
}
