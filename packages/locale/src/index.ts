export * from "./locales/ar";
export * from "./locales/en";

export const localeLoader = async (lng: string, ns: string) => {
  const file = await import(`./locales/${lng}/${ns}.json`);
  return file;
};
