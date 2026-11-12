import "server-only";
import { strapiClient } from "./strapi.api";
export const getBanners = async () => {
  const result = await strapiClient.banners.find({
    populate: ["web_image", "mobile_image"],
  });

  const mapped = result.map((_) => ({
    ..._,
    web_image: `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${_.web_image?.url}`,
    mobile_image:
      _.mobile_image &&
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${_.mobile_image?.url}`,
    title: _.Title,
  }));
  console.log({ mapped });
  return mapped;
};
