import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS "Add to Home Screen" icon.
export default function AppleIcon() {
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
          fontSize: 96,
          fontFamily: "Georgia, serif",
        }}
      >
        奥
      </div>
    ),
    { ...size }
  );
}
