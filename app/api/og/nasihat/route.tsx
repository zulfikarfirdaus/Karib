import { ImageResponse } from "next/og";
import { safeFetch } from "@/sanity/lib/client";
import { nasihatPosterQuery } from "@/lib/queries";


const themeConfig = {
  pasir: { bg: "#F5EDD8", text: "#3D2B0E", accent: "#A0621A", border: "#D4B87A" },
  zaitun: { bg: "#2C3A2A", text: "#D4E0D0", accent: "#8FBF84", border: "#4A6347" },
  arang: { bg: "#1E1C1A", text: "#E8E4DC", accent: "#C97E2A", border: "#3C3835" },
  krem: { bg: "#FAF5EC", text: "#2C2218", accent: "#A0621A", border: "#E8DCC8" },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }

  const nasihat = await safeFetch(nasihatPosterQuery, { slug });
  if (!nasihat) return new Response("Not found", { status: 404 });

  const tema = (nasihat.tema ?? "pasir") as keyof typeof themeConfig;
  const theme = themeConfig[tema] ?? themeConfig.pasir;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1080px",
          height: "1080px",
          background: theme.bg,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Top accent line */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "3px",
              background: theme.accent,
              borderRadius: "2px",
              display: "flex",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: theme.accent,
              fontFamily: "sans-serif",
              fontWeight: 700,
              display: "flex",
            }}
          >
            {nasihat.kategori?.nama ?? "Ustadzi"}
          </span>
        </div>

        {/* Quote text */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", padding: "40px 0" }}>
          <div
            style={{
              fontSize: nasihat.teks.length > 150 ? "34px" : "42px",
              lineHeight: 1.6,
              color: theme.text,
              fontStyle: "italic",
              display: "flex",
            }}
          >
            {nasihat.teks}
          </div>
        </div>

        {/* Bottom: divider + attribution */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              width: "60px",
              height: "1px",
              background: theme.border,
              marginBottom: "20px",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: "16px",
              color: theme.accent,
              fontFamily: "sans-serif",
              fontWeight: 700,
              letterSpacing: "0.05em",
              display: "flex",
            }}
          >
            {nasihat.narasumber ?? "Ustadzi"}
          </div>
          {nasihat.referensiKitab && (
            <div
              style={{
                fontSize: "12px",
                color: theme.text,
                opacity: 0.5,
                fontFamily: "sans-serif",
                marginTop: "6px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                display: "flex",
              }}
            >
              {nasihat.referensiKitab}
            </div>
          )}
        </div>
      </div>
    ),
    {
      width: 1080,
      height: 1080,
    }
  );
}
