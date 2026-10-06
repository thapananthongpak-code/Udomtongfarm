import { useParams } from "react-router-dom";
import { defaultLocale, getDictionary, isLocale, type Locale } from "./index";

/** The language of the current page, taken from the first part of the address. */
export function useLang(): Locale {
  const { lang } = useParams();
  return isLocale(lang) ? lang : defaultLocale;
}

/** The dictionary for the current page's language. */
export const useT = () => getDictionary(useLang());
