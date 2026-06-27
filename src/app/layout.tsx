import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura Arts Centre | Kingdom of Bahrain",
  description: "Bringing Artistic Excellence - Aura Arts Centre conducts stage performances, cultural events, and more in Bahrain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
