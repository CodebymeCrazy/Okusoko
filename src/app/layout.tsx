import type { Metadata } from "next";
import "./globals.css";

const title = "Closer — the 36 questions, answered together";
const description =
  "Arthur Aron's 36 questions for two. Answer at your own pace — you can't see their answer until you've written yours.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "Closer" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/api/og"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-8">
          {children}
        </div>
      </body>
    </html>
  );
}
