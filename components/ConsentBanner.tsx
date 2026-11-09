"use client";

import { useEffect, useState } from "react";
import { LEGAL, REQUIRE_CONSENT } from "@/lib/config";
import { getConsent, setConsent } from "@/lib/tracking";

export default function ConsentBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (REQUIRE_CONSENT && getConsent() === null) setShow(true);
  }, []);
  if (!show) return null;

  const choose = (granted: boolean) => {
    setConsent(granted);
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-4 bottom-4 z-[90] mx-auto flex max-w-[640px] flex-col gap-4 rounded-[20px] border border-white/12 bg-ink p-5 text-white shadow-[0_30px_70px_-30px_rgba(10,10,10,0.7)] sm:flex-row sm:items-center"
    >
      <p className="m-0 flex-1 text-[14px] leading-[1.5] text-white/75">
        We use cookies to measure our ads (Meta Pixel). Accept to help us improve, or decline and we’ll only use essential cookies.{" "}
        <a href={LEGAL.cookies} className="text-white underline hover:text-mint">Cookie policy</a>
      </p>
      <div className="flex shrink-0 gap-2">
        <button onClick={() => choose(false)} className="cursor-pointer rounded-full border border-white/20 bg-transparent px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-white/10">
          Decline
        </button>
        <button onClick={() => choose(true)} className="cursor-pointer rounded-full border-0 bg-white px-4 py-2.5 text-[14px] font-semibold text-ink hover:bg-mint-light">
          Accept
        </button>
      </div>
    </div>
  );
}
