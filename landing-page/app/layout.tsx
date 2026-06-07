import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qubic Risk Radar | Secure the Network",
  description: "The definitive open-source monitoring layer for Qubic. Real-time surveillance, automated threat mitigation, and industrial intelligence for the decentralized web.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
