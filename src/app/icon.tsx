import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Favicon — the 奥 mark on ember.
export default function Icon() {
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
          fontSize: 22,
          fontFamily: "Georgia, serif",
        }}
      >
        奥
      </div>
    ),
    { ...size }
  );
}
