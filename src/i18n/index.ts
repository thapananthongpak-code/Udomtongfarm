import type { Locale } from "./config";
import en, { type Dictionary } from "./dictionaries/en";
import th from "./dictionaries/th";

const dictionaries: Record<Locale, Dictionary> = { th, en };

export const getDictionary = (lang: Locale): Dictionary => dictionaries[lang];

export type { Dictionary };
export * from "./config";
