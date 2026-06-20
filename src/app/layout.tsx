import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Invoice Home",
  description: "Create simple Australian receipts on your phone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" className="h-full antialiased">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
