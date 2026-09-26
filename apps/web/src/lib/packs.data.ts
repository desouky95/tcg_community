import type { Pack } from "../components/interactive/PackGallery";

export const PACKS: Pack[] = [
  {
    name: "Germany 2006",
    series: "World Cup Heritage",
    img: "/images/packs/world_cup_2006.jpg",
    color: "bg-blue-500/10",
    canOpen: true,
    cardImages: ["/images/packs/r9.png", "/images/packs/zizo.png"],
  },
  {
    name: "Club World Cup 2025",
    series: "FIFA",
    img: "/images/packs/cwc_2025.jpg",
    color: "bg-blue-500/10",
    canOpen: true,
    cardImages: [
      "/images/packs/cwc_1.jpg",
      "/images/packs/cwc_2.jpg",
      "/images/packs/cwc_3.jpg",
      "/images/packs/cwc_4.jpg",
      "/images/packs/cwc_5.jpg",
      "/images/packs/cwc_6.jpg",
      "/images/packs/cwc_7.jpg",
    ],
  },
  {
    name: "UCL 24/25",
    series: "Elite Modern",
    img: "/images/packs/ucl_24_25.jpg",
    color: "bg-cyan-500/10",
    cardImages: [
      "/images/packs/yamal.png",
      "/images/packs/martinez.png",
      "/images/packs/neves.png",
    ],
    canOpen: true,
  },
  {
    name: "Premier League",
    series: "2026 Season",
    img: "/images/packs/topps_pl_2026.jpg",
    color: "bg-purple-500/10",
    canOpen: true,
    cardImages: [
      "/images/packs/aguero.webp",
      "/images/packs/torres.webp",
      "/images/packs/sabo.jpg",
      "/images/packs/lampard.jpg",
    ],
  },
  {
    name: "Sonic",
    series: "Special Collection",
    img: "/images/packs/sonic_panini.png",
    color: "bg-blue-600/10",
    canOpen: true,
    cardImages: [
      "/images/packs/sonic1.webp",
      "/images/packs/sonic2.webp",
      "/images/packs/sonic3.jpg",
      "/images/packs/sonic4.jpg",
      "/images/packs/sonic5.png",
      "/images/packs/sonic6.png",
    ],
  },
];
