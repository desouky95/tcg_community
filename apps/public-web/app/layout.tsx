import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TCG Nexus | Collect, trade, belong",
  description: "An Egypt-first home for collectors, checklists, and thoughtful trades.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
