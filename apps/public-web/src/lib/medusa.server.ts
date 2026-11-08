import { sdk } from "./sdk";

export type StoreProduct = {
  id: string;
  title: string;
  handle: string | null;
  description: string | null;
  thumbnail: string | null;
};

export const initRegion = () => {
  const regionId =
    localStorage.getItem("region_id") ||
    process.env.NEXT_PUBLIC_DEFAULT_REGION ||
    "EG";

  sdk.store.region.retrieve(regionId).then(({ region }) => {
    localStorage.setItem("region_id", region.id);
  });
};

export async function listStoreProducts() {
  return await sdk.store.product.list();
}

export async function getStoreProduct(handle: string) {
  try {
    return await sdk.store.product.retrieve(handle, { country_code: "eg" });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
