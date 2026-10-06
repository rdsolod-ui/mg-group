import type { Metadata, Viewport } from "next";
import { site } from "@/data/site-metadata";
import "./globals.css";
import "./visuals.css";
import "./chapter-photography.css";
import "./motion.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://marketing.parkskazka.ru"),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "Amusement park engineering and operations",
  referrer: "strict-origin-when-cross-origin",
  alternates: { canonical: site.url },
  openGraph: {
    type: "website",
    title: site.title,
    description: site.description,
    siteName: site.name,
    url: site.url,
    locale: "ar_OM",
    alternateLocale: ["en_GB"],
    images: [
      { url: `${site.url}${site.image}`, secureUrl: `${site.url}${site.image}`, width: 1200, height: 630, type: "image/jpeg", alt: site.imageAlt },
      { url: `${site.url}social/mg-group-square-v1.jpg`, secureUrl: `${site.url}social/mg-group-square-v1.jpg`, width: 1200, height: 1200, type: "image/jpeg", alt: site.imageAlt },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [{ url: `${site.url}social/mg-group-card-v1.jpg`, alt: site.imageAlt }],
  },
  robots: {
    index: true, follow: true,
    "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  icons: {
    icon: [
      { url: "/mg-group/favicon.ico", sizes: "16x16 24x24 32x32 48x48 64x64", type: "image/x-icon" },
      { url: "/mg-group/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/mg-group/icons/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/mg-group/icons/favicon-96.png", sizes: "96x96", type: "image/png" },
      { url: "/mg-group/icons/favicon.svg", sizes: "any", type: "image/svg+xml" },
    ],
    apple: [152, 167, 180].map((size) => ({ url: `/mg-group/icons/apple-touch-icon-${size}.png`, sizes: `${size}x${size}`, type: "image/png" })),
  },
  manifest: "/mg-group/site.webmanifest",
  appleWebApp: { capable: true, title: site.name, statusBarStyle: "default" },
  formatDetection: { telephone: false, address: false, email: false },
  other: {
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#102d40",
    "msapplication-TileImage": "/mg-group/icons/mstile-150.png",
    "msapplication-config": "/mg-group/browserconfig.xml",
  },
};
export const viewport: Viewport = {
  width: "device-width", initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ee" },
    { media: "(prefers-color-scheme: dark)", color: "#102d40" },
  ],
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="mask-icon" href="/mg-group/icons/safari-pinned-tab.svg" color="#183e58" />
      </head>
      <body>{children}</body>
    </html>
  );
}
