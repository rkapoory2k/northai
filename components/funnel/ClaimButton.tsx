"use client";

import type { ReactNode } from "react";
import { useFunnel } from "./FunnelProvider";

export default function ClaimButton({ className, children }: { className?: string; children: ReactNode }) {
  const { openClaim } = useFunnel();
  return (
    <a
      href="#claim"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        openClaim();
      }}
    >
      {children}
    </a>
  );
}
