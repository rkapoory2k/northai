"use client";

import { useEffect, useRef } from "react";
import { VIMEO_ID } from "@/lib/config";
import { track } from "@/lib/tracking";

/** Vimeo embed; fires ViewContent (Pixel + CAPI) the first time the video plays. */
export default function HeroVideo() {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <div className="relative mt-6 aspect-[4/3] w-full max-w-[880px] overflow-hidden rounded-[26px] border border-line bg-ink shadow-[0_30px_70px_-30px_rgba(10,10,10,0.7)]">
      <iframe
        ref={ref}
        src={`https://player.vimeo.com/video/${VIMEO_ID}?badge=0&autopause=0&autoplay=1&muted=1&dnt=1`}
        title="North AI 2027 strategy video"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-0 block h-full w-full border-0"
      />
    </div>
  );
}
