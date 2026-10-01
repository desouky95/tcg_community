import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "TCG Nexus | Collect, trade, belong",
  description:
    "An Egypt-first home for collectors, checklists, and thoughtful trades.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

