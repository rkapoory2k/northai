import { ImageResponse } from "next/og";

export const alt = "North AI — $49 2027 creative strategy";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0A0A0A", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, letterSpacing: 4, textTransform: "uppercase", color: "#A8EFA0" }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: "#A8EFA0" }} />
          $49 2027 marketing strategy
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3 }}>
          <span>Walk into 2027 with a</span>
          <span style={{ color: "#A8EFA0" }}>data-backed creative strategy.</span>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "rgba(255,255,255,0.7)" }}>North AI · Competitor analysis · Trends · 5 mock-ups · Paid media plan</div>
      </div>
    ),
    size,
  );
}
