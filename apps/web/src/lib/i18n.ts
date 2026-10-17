import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import {
  arChecklistsLocale,
  arCollectionLocale,
  arCommonLocale,
  enChecklistsLocale,
  enCollectionLocale,
  enCommonLocale,
} from "@tcg/locale";

const resources = {
  en: {
    translation: {
      ...enCommonLocale,
      checklists: enChecklistsLocale,
      collection: enCollectionLocale,
    },
  },
  ar: {
    translation: {
      ...arCommonLocale,
      checklists: arChecklistsLocale,
      collection: arCollectionLocale,
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
