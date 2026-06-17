import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  const base = SITE.url.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/og"],
        disallow: ["/admin", "/api/newsletter", "/api/search-index", "/search"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
