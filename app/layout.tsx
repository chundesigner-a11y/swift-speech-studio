import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Video Speed Reader — Transcripts in three minutes",
  description:
    "Upload your video, get a clean, accurate transcript in three minutes. Chinese and English, powered by Whisper.",
  openGraph: {
    title: "Video Speed Reader — Transcripts in three minutes",
    description:
      "上傳影片，三分鐘內拿到逐字稿。Accurate Chinese & English transcripts for creators, educators, and engineers.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
