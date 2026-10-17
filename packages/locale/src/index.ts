import {
  arChecklistsLocale,
  arCollectionLocale,
  arCommonLocale,
} from "./locales/ar";
import {
  enChecklistsLocale,
  enCollectionLocale,
  enCommonLocale,
} from "./locales/en";

export * from "./locales/ar";
export * from "./locales/en";

export type SupportedLocale = "en" | "ar";
export type LocaleNamespace = "common" | "checklists" | "collection";

/** Static resource map so consumers and bundlers never need a variable JSON import. */
export const localeResources: Record<
  SupportedLocale,
  Record<LocaleNamespace, object>
> = {
  en: {
    common: enCommonLocale,
    checklists: enChecklistsLocale,
    collection: enCollectionLocale,
  },
  ar: {
    common: arCommonLocale,
    checklists: arChecklistsLocale,
    collection: arCollectionLocale,
  },
};

export const localeLoader = async (lng: string, ns: string) => {
  const resource = localeResources[lng as SupportedLocale]?.[
    ns as LocaleNamespace
  ];

  if (!resource) {
    throw new Error(`Unsupported locale resource: ${lng}/${ns}`);
  }

  return resource;
};
