import type { Metadata } from "next";
import { Oxanium, Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
  weight: ["400", "500", "600", "700"],
});

const shareTech = Share_Tech_Mono({
  subsets: ["latin"],
  variable: "--font-share",
  weight: "400",
});

export const metadata: Metadata = {
  title: "QRR // Qubic Risk Radar",
  description:
    "Self-hosted FastAPI watch for the Qubic network: webhook ingest, rule engine, incidents, Discord/Telegram dispatch.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oxanium.variable} ${shareTech.variable}`}>
      <body>{children}</body>
    </html>
  );
}
