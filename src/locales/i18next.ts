import i18next from "i18next";
import * as reactI18next from "react-i18next";
import ja from "@/locales/ja";
import en from "@/locales/en";

i18next.use(reactI18next.initReactI18next).init({
  lng: `ja`,
  resources: {
    ja: { translation: ja },
    en: { translation: en },
  },
});

export default i18next;
