import { HeroSlideItem, HeroSlider } from "@tcg/ui-web";
import { getBanners } from "#lib/strapi.server";

// Placeholder content; replace this array with banner data from the API.
const banners: HeroSlideItem[] = [
  {
    web_image: "/images/landing/yamal.jpg",
    mobile_image: "/images/landing/yamal.jpg",
    title: "Find your next pull.",
    subtitle: "Explore cards and collectibles for every kind of collector.",
    url: "/shop",
  },
  {
    web_image: "/images/landing/messi.jpg",
    mobile_image: "/images/landing/messi.jpg",
    title: "Your collection has a home.",
    subtitle: "Discover Collector Disk and what’s coming for the community.",
    url: "/collector-disk",
  },
];

export default async function HomePage() {
  
  const _ = await getBanners()
  return <HeroSlider slides={_ as any} />;
}
