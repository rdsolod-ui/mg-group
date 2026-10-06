import type { Metadata } from "next";
import "./globals.css";
import "./visuals.css";
import "./chapter-photography.css";
import "./motion.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://marketing.parkskazka.ru"),
  title: "MG Group | Engineering, construction & park operations",
  description:
    "مجموعة إم جي: الهندسة والتركيب والإطلاق والتشغيل الفني للمنتزهات. Engineering, installation, launch and operation of amusement destinations in Russia and Oman.",
  alternates: { canonical: "/mg-group/" },
  openGraph: {
    title: "MG Group — From engineering to experience",
    description:
      "Engineering, installation, launch and park operations. Eight projects in Russia and Oman.",
    url: "/mg-group/",
    images: [{ url: "/mg-group/brand/og.jpg", width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
