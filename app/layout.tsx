import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import MetaPixel from "@/components/MetaPixel";
import ConsentBanner from "@/components/ConsentBanner";
import { SITE_URL } from "@/lib/config";
import "./globals.css";

const title = "$49 2027 Creative Strategy | North AI";
const description =
  "Walk into 2027 with a data-backed creative strategy: competitor analysis, key creative trends, five data-backed mock-ups and a full paid media strategy. All for $49.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { title, description, url: "/", siteName: "North AI", type: "website", locale: "en_GB" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = { themeColor: "#F5F5F2", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://player.vimeo.com" />
        <link rel="preconnect" href="https://js.stripe.com" />
      </head>
      <body>
        {children}
        <MetaPixel />
        <ConsentBanner />
      </body>
    </html>
  );
}
