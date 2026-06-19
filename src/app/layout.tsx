import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tax Invoice",
  description: "Create professional Australian tax invoices and export them as PDF.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
