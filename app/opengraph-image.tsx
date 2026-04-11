import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "STAT-STATS // Console";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#09090b",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
        border: "1px solid #18181b",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 50% 50%, #18181b 0%, transparent 100%)",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: "80px",
            fontWeight: 900,
            fontStyle: "italic",
            letterSpacing: "-0.05em",
            color: "white",
            lineHeight: 1,
          }}
        >
          STAT-STATS
        </div>
        <div
          style={{
            fontSize: "14px",
            letterSpacing: "0.4em",
            color: "#52525b",
            fontWeight: 700,
            textTransform: "uppercase",
          }}
        >
          {"//"} High-Tech GitHub Cards
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
