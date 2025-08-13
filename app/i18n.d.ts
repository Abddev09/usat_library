import "react-i18next"
import type uzTranslation from "../public/locales/uz/translation.json"

declare module "react-i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation"
    resources: {
      translation: typeof uzTranslation
    }
  }
}
