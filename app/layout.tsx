import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YouTube News SEO Optimizer",
  description: "AI-powered SEO optimization for YouTube news channels",
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
