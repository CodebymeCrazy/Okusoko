import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

const title = "Okusoko — the 36 questions, all the way down";
const description =
  "Okusoko (奥底): the innermost depths of the heart. Arthur Aron's 36 questions for two — answer at your own pace, and you can't see their answer until you've written yours.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title,
  description,
  openGraph: {
    title,
    description,
    type: "website",
    images: [{ url: "/api/og", width: 1200, height: 630, alt: "Okusoko" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/api/og"],
  },
  appleWebApp: { capable: true, title: "Okusoko", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#c2453d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col px-5 py-8">
          {children}
        </div>
        <Analytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
