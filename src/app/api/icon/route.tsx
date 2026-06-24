import { ImageResponse } from "next/og";

export const runtime = "edge";

// Brand app icon at any size, used by the web manifest (192/512, incl. maskable).
// Full-bleed ember background keeps it safe inside a maskable circle.
export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const size = Math.min(1024, Math.max(48, Number(searchParams.get("size")) || 512));
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#c2453d",
          color: "#fbf7f2",
          fontSize: Math.round(size * 0.52),
          fontFamily: "Georgia, serif",
        }}
      >
        奥
      </div>
    ),
    { width: size, height: size }
  );
}
