"use client";

import { useState } from "react";

export default function Faq({ items }: { items: [string, string][] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="flex flex-col border-t-2 border-ink">
      {items.map(([q, a], i) => {
        const isOpen = open === i;
        return (
          <div key={q} className="border-b border-line">
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              aria-controls={`faq-${i}`}
              className="flex w-full cursor-pointer items-center justify-between gap-4 border-0 bg-transparent px-1 py-[22px] text-left text-ink"
            >
              <span className="text-[20px] font-semibold tracking-[-0.015em]">{q}</span>
              <span
                aria-hidden
                className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[20px] leading-none ${isOpen ? "bg-ink text-white" : "bg-ink/6 text-ink"}`}
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            {isOpen && (
              <p id={`faq-${i}`} className="m-0 max-w-[680px] px-1 pb-6 text-[17px] leading-[1.55] text-pretty text-body">{a}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
