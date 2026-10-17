import { PageAnimatePresence } from "@tcg/ui-web/next";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageAnimatePresence type="sticker-packs">{children}</PageAnimatePresence>
  );
}
