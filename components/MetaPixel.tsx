"use client";

import { useEffect } from "react";
import { CONSENT_EVENT, captureAttribution, loadPixel } from "@/lib/tracking";

/** Captures UTMs and loads the Pixel (PageView) once consent is granted. */
export default function MetaPixel() {
  useEffect(() => {
    captureAttribution();
    loadPixel();
    const onConsent = () => loadPixel();
    window.addEventListener(CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(CONSENT_EVENT, onConsent);
  }, []);
  return null;
}
