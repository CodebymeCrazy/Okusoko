import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Okusoko — the 36 questions",
    short_name: "Okusoko",
    description:
      "Answer the 36 questions together, at your own pace. You can't see their answer until you've written yours.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7f2",
    theme_color: "#c2453d",
    icons: [
      { src: "/api/icon?size=192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/api/icon?size=512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/api/icon?size=512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
