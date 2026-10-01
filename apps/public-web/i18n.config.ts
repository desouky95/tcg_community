import type { I18nConfig } from "next-i18next";
import { localeLoader } from "@tcg/locale";
const i18nConfig: I18nConfig = {
  supportedLngs: ["en", "ar"],
  fallbackLng: "en",
  ns: ["common", "checklists","collection"],
  resourceLoader: async (lng, ns) => {
    const resource = await localeLoader(lng, ns);
    return resource;
  },
  reloadOnPrerender: process.env.NODE_ENV === "development",
  persistCookie: false,
};

export default i18nConfig;
