import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import '@solana/wallet-adapter-react-ui/styles.css';
import Provider from "@/components/Provider";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wing | Fund gives you wings",
  icons: {
    icon: '/logo.svg',
  },
  description:
    "Wing is a SOL-based tipping platform that lets creators receive instant support from their fans — fully decentralized and powered by Solana.",
  twitter: {
    card: "summary_large_image",
    title: "Wing | Fund gives you wings",
    description:
      "Instant, decentralized tipping on Solana. Support creators directly with $SOL on Wing.",
    images: ["/logo.svg"],
    creator: "@IsNikunj",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950/96 text-zinc-100 tracking-wide`} >
        <Provider>
          <Navbar />
          {children}
        </Provider>
        <Analytics />
      </body>
    </html>
  );
}
