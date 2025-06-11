import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitHub Trending Dashboard",
  description: "Discover the hottest repositories on GitHub with an enhanced trending dashboard. Filter by language and time range to find the most popular projects.",
  keywords: ["GitHub", "trending", "repositories", "dashboard", "programming", "open source"],
  authors: [{ name: "GitHub Trending Dashboard" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script 
          data-goatcounter="https://github-trending-dashboard.goatcounter.com/count"
          async 
          src="//gc.zgo.at/count.js"
        ></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        {children}
      </body>
    </html>
  );
}
