import type { Metadata } from "next";
import { Orbitron, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { BASE_APP_ID } from "@/lib/env";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Vim Genius",
  description: "Cyberpunk Vim grid puzzles on Base — swipe hjkl, daily check-in.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  icons: {
    icon: "/app-icon.jpg",
    apple: "/app-icon.jpg",
  },
  openGraph: {
    title: "Vim Genius",
    description: "Cyberpunk Vim grid puzzles on Base.",
    images: [{ url: "/app-thumbnail.jpg", width: 1910, height: 1000, alt: "Vim Genius" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${orbitron.variable} ${jetbrains.variable}`}>
      <head>
        <meta name="base:app_id" content={BASE_APP_ID} />
      </head>
      <body className="relative z-0 min-h-dvh bg-[#050810] font-mono antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
