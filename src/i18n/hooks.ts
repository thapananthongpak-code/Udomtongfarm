import { useParams } from "react-router-dom";
import { useData } from "@/state/data";
import { defaultLocale, isLocale, type Locale } from "./index";

/** The language of the current page, taken from the first part of the address. */
export function useLang(): Locale {
  const { lang } = useParams();
  return isLocale(lang) ? lang : defaultLocale;
}

/** The dictionary for the current page's language, with the texts an admin has changed. */
export const useT = () => useData().dictionaries[useLang()];
