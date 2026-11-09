import "server-only";
import type { HeroSlideItem } from "@tcg/ui-web";

import { StrapiError } from "@tcg/strapi-client";
import { strapiClient } from "./strapi.api";

const cmsURL = (
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"
)
  .replace(/\/$/, "")
  .replace(/\/api$/, "");

async function fetchHomepage() {
  return strapiClient.homepage.find(
    {
      status: "published",
      populate: {
        sections: {
          on: {
            "slider.hero-slider": {
              populate: {
                banners: { populate: ["web_image", "mobile_image"] },
              },
            },
            "homepage.product-section": { populate: { products: true } },
            "homepage.latest-products": true,
            "homepage.banner-strip": { populate: { image: true } },
          },
        },
      },
    },
    { cache: "no-store" },
  );
}

async function fetchPageTransition() {
  return strapiClient.pageTransition.find(
    {
      status: "published",
      populate: {
        packs: true,
      },
    },
    { cache: "no-store" },
  );
}

type Homepage = Awaited<ReturnType<typeof fetchHomepage>>;
type Section = NonNullable<Homepage["sections"]>[number];
type HeroBlock = Extract<Section, { __component: "slider.hero-slider" }>;
type Banner = NonNullable<HeroBlock["banners"]>[number];
type Media = Banner["web_image"];
type PageTransition = Awaited<ReturnType<typeof fetchPageTransition>>;
export type HomepageState =
  | { kind: "ready"; sections: Section[] }
  | { kind: "setup" }
  | { kind: "unavailable" };

export type PageTransitionState = PageTransition;

export async function getHomepage(): Promise<HomepageState> {
  try {
    const homepage = await fetchHomepage();
    console.log(homepage);
    return homepage
      ? { kind: "ready", sections: homepage.sections ?? [] }
      : { kind: "setup" };
  } catch (error) {
    return error instanceof StrapiError && error.status === 404
      ? { kind: "setup" }
      : { kind: "unavailable" };
  }
}

export function mediaURL(media: Media | undefined): string | undefined {
  if (!media?.url) return;
  try {
    return new URL(media.url, cmsURL).toString();
  } catch {
    return;
  }
}

export function mapHeroSlides(banners: Banner[] = []): HeroSlideItem[] {
  return banners.flatMap((banner) => {
    const web = mediaURL(banner.web_image);
    const mobile = mediaURL(banner.mobile_image);
    if (!banner.active || !banner.Title || !banner.url || !web) return [];

    if (!banner.url.startsWith("/") || banner.url.startsWith("//")) {
      try {
        if (!["http:", "https:"].includes(new URL(banner.url).protocol))
          return [];
      } catch {
        return [];
      }
    }
    return {
      title: banner.Title,
      subtitle: banner.subtitle,
      url: banner.url,
      web_image: web,
      mobile_image: mobile,
    };
  }) as HeroSlideItem[];
}

export async function getPageTransition(): Promise<PageTransitionState> {
  try {
    const pagetransition = await fetchPageTransition();
    console.log(pagetransition);
    return pagetransition;
  } catch (error) {
    throw error;
  }
}

export function getStrapiURL(path = "") {
  return `${cmsURL}${path}`;
}
export {
  getHomepageProducts,
  getLatestHomepageProducts,
} from "./homepage-product-data";
