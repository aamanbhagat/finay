import { ImageResponse } from "next/og";
import { SITE, getCategory } from "@/lib/constants";

export const runtime = "edge";
export const contentType = "image/png";

const SIZE = { width: 1200, height: 630 };

/** Dynamic OG image: branded navy + gold card with title, category, author. */
export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? `${SITE.name} — ${SITE.tagline}`;
  const author = searchParams.get("author") ?? "";
  const categorySlug = searchParams.get("category") ?? "";
  const category = categorySlug ? getCategory(categorySlug) : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0a1628 0%, #0f1e33 55%, #15253d 100%)",
          color: "#e8edf4",
          padding: "64px 80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Ledger hairlines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0 47px, rgba(244,185,66,0.06) 47px 48px)",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 8,
              background: "#0a1628",
              border: "1px solid rgba(244,185,66,0.5)",
              color: "#f4b942",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            C
          </div>
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.5, display: "flex" }}>
            {SITE.name}
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative" }}>
          {category && (
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "8px 16px",
                borderRadius: 999,
                background: "rgba(244,185,66,0.16)",
                color: "#f4b942",
                fontSize: 18,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1.5,
                marginBottom: 24,
              }}
            >
              {category.name}
            </div>
          )}
          <div
            style={{
              display: "flex",
              fontSize: title.length > 80 ? 56 : 68,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: -1.5,
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "rgba(232,237,244,0.7)",
            position: "relative",
          }}
        >
          <div style={{ display: "flex" }}>{author ? `by ${author}` : SITE.tagline}</div>
          <div style={{ display: "flex", color: "#f4b942" }}>{SITE.url.replace(/^https?:\/\//, "")}</div>
        </div>
      </div>
    ),
    SIZE,
  );
}
