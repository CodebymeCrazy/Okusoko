import { ImageResponse } from "next/og";

export const runtime = "edge";

// Branded social-preview card. Accepts optional ?title= and ?subtitle= so the
// same route can back both the generic invite preview and a session-specific one.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "The 36 questions, together.";
  const subtitle =
    searchParams.get("subtitle") ??
    "You can't see their answer until you've written yours.";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#fbf7f2",
          padding: "72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", color: "#c2453d", fontSize: 30 }}>
          Closer · Deeper
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 68, color: "#1a1625", lineHeight: 1.1 }}>{title}</div>
          <div style={{ fontSize: 34, color: "#574e63", marginTop: 28 }}>{subtitle}</div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#574e63" }}>
          Arthur Aron's study · ~45 minutes · two phones
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
