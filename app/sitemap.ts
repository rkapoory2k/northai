import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/black-friday`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
