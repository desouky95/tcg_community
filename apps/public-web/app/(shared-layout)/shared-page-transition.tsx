"use client";

import { PageAnimatePresence } from "@tcg/ui-web/next";
import { usePathname } from "next/navigation";

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

const tcgImages = [
  "https://ripped.topps.com/wp-content/uploads/2026/02/Arsenal-FC-202526-Team-Set-800x1100.webp",
  "https://ripped.topps.com/wp-content/uploads/2026/09/20-years-ma-800x1100.webp",
  "https://ripped.topps.com/wp-content/uploads/2026/09/chase-800x1100.webp",
  "https://ripped.topps.com/wp-content/uploads/2026/09/hobby-dropping-soon-1-800x1100.webp",
  "https://ripped.topps.com/wp-content/uploads/2026/02/Dropping-Soon-Manchester-United-202526-Team-Set-1-800x1100.webp",
  "https://ripped.topps.com/wp-content/uploads/2026/02/Topps-UEFA-Club-Competitions-Knockout-800x1100.webp",
  "https://images.topps.com/v3/assets/bltc7206971cb4b2bfc/blt5d9f40ed231d3b60/6aaabe4c14e384f5b94ea59c/T27MCT_MANCITY_GOLD_VAULT_CRF_2004_-_Sergio_Aguero.jpg",
  "https://images.topps.com/v3/assets/bltc7206971cb4b2bfc/blt1cf9e3512d6ed369/6ac3bdce4e42ee13847fd682/T27ACT_FOR_THE_BADGE_F_ARSENAL_CRF_1107_-_Arsene_Wenger.jpg",
  "https://cdn.sanity.io/images/hj34sz77/development/70c3ba72d07e771e9a3915677571f1ae761f07ea-875x1225.jpg?auto=format&fit=max&w=3840",
];
export function SharedPageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const usesTcgArtwork =
    matchesRoute(pathname, "/marketplace") ||
    matchesRoute(pathname, "/swapping") ||
    matchesRoute(pathname, "/s");
  return (
    <PageAnimatePresence
      type={usesTcgArtwork ? "tcg-games" : "sticker-packs"}
      tcgImages={usesTcgArtwork ? tcgImages : undefined}
      //   key={pathname}
    >
      {children}
    </PageAnimatePresence>
  );
}
