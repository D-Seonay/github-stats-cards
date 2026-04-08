import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://github-stats-cards.matheodelaunay.studio"),
  title: {
    default: "STAT-STATS // Console",
    template: "%s // STAT-STATS",
  },
  description: "High-tech stealth GitHub stats cards generator for your profile README.",
  openGraph: {
    title: "STAT-STATS // Console",
    description: "Generate high-tech GitHub stats cards with real-time preview.",
    url: "https://github-stats-cards.matheodelaunay.studio",
    siteName: "STAT-STATS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STAT-STATS // Console",
    description: "Generate high-tech GitHub stats cards with real-time preview.",
    creator: "@D-Seonay",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon",
    apple: "/icon",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="bg-zinc-950 text-zinc-100 font-sans antialiased">{children}</body>
    </html>
  );
}
