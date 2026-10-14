// The texts an admin can change (Admin → Site texts). Each one is named by where it sits in
// the dictionaries, e.g. "visit.faqs.2.a", and the dictionary's own text is used while it is empty.
// This file only uses relative imports so that the chat function can load it too.

import { format, type Locale } from "../i18n/config.js";
import en, { type Dictionary } from "../i18n/dictionaries/en.js";

/** One row of the `site_content` table. An empty value means "use the built-in text". */
export type ContentRow = { key: string; th: string; en: string };

export type ContentField = {
  key: string;
  /** The field's label, given the dictionary of the admin's language. */
  label: (t: Dictionary) => string;
  /** Shown as a tall box, for paragraphs. */
  long?: boolean;
};

export type ContentGroup = { id: keyof Dictionary["admin"]["contentForm"]["groups"]; fields: ContentField[] };

/** The longest text the form and the database accept. */
export const CONTENT_MAX_LENGTH = 4000;

type Labels = Dictionary["admin"]["contentForm"]["labels"];
const labels = (t: Dictionary) => t.admin.contentForm.labels;
const numbered = (name: keyof Labels, index: number) => (t: Dictionary) => format(labels(t)[name], { n: index + 1 });

// Lists are read from the English dictionary so that a list that grows there gets its fields here.
export const CONTENT_GROUPS: ContentGroup[] = [
  {
    id: "site",
    fields: [
      { key: "site.name", label: (t) => labels(t).siteName },
      { key: "site.tagline", label: (t) => labels(t).tagline },
      { key: "footer.about", label: (t) => labels(t).footerAbout, long: true },
      { key: "footer.rights", label: (t) => labels(t).footerRights },
    ],
  },
  {
    id: "home",
    fields: [
      { key: "home.title", label: (t) => labels(t).heading },
      { key: "home.lede", label: (t) => labels(t).intro, long: true },
    ],
  },
  {
    id: "story",
    fields: [
      { key: "about.lede", label: (t) => labels(t).intro, long: true },
      ...en.about.story.map((_, i) => ({ key: `about.story.${i}`, label: numbered("paragraph", i), long: true })),
    ],
  },
  {
    id: "founder",
    fields: [
      { key: "about.founder.name", label: (t) => labels(t).founderName },
      { key: "about.founder.title", label: (t) => labels(t).founderTitle },
      { key: "about.founder.org", label: (t) => labels(t).founderOrg },
      { key: "about.founder.bio", label: (t) => labels(t).founderBio, long: true },
    ],
  },
  {
    id: "activities",
    fields: en.farm.activities.flatMap((_, i) => [
      { key: `farm.activities.${i}.title`, label: numbered("activityName", i) },
      { key: `farm.activities.${i}.body`, label: numbered("activityDetail", i) },
    ]),
  },
  {
    id: "stay",
    fields: [
      { key: "farm.roomsValue", label: (t) => t.farm.roomsLabel },
      ...en.farm.stay.map((_, i) => ({ key: `farm.stay.${i}.value`, label: (t: Dictionary) => t.farm.stay[i].label })),
    ],
  },
  {
    id: "visit",
    fields: [
      { key: "visit.hoursValue", label: (t) => t.visit.hours },
      { key: "visit.hoursNote", label: (t) => labels(t).hoursNote },
      { key: "visit.phoneHours", label: (t) => labels(t).phoneHours },
    ],
  },
  {
    id: "faq",
    fields: en.visit.faqs.flatMap((_, i) => [
      { key: `visit.faqs.${i}.q`, label: numbered("question", i) },
      { key: `visit.faqs.${i}.a`, label: numbered("answer", i), long: true },
    ]),
  },
  {
    id: "privacy",
    fields: [
      { key: "privacy.updated", label: (t) => labels(t).privacyUpdated },
      ...en.privacy.sections.flatMap((section, i) => [
        { key: `privacy.sections.${i}.title`, label: numbered("sectionTitle", i) },
        ...section.body.map((_, j) => ({
          key: `privacy.sections.${i}.body.${j}`,
          label: (t: Dictionary) => format(labels(t).sectionParagraph, { n: i + 1, m: j + 1 }),
          long: true,
        })),
      ]),
    ],
  },
];

export const CONTENT_KEYS = CONTENT_GROUPS.flatMap((group) => group.fields.map((field) => field.key));

const EDITABLE = new Set(CONTENT_KEYS);

type Node = Record<string, unknown>;

// Every editable key is a path that exists in the dictionary, so each step is an object or a list.
const parentOf = (dictionary: Dictionary, path: string[]) =>
  path.slice(0, -1).reduce<Node>((node, part) => node[part] as Node, dictionary as unknown as Node);

/** The text a dictionary holds for an editable key. */
export function textAt(dictionary: Dictionary, key: string): string {
  const path = key.split(".");
  return parentOf(dictionary, path)[path[path.length - 1]] as string;
}

/** A copy of `base` with the admin's texts for `lang` in place of the built-in ones. */
export function applyContent(base: Dictionary, rows: ContentRow[], lang: Locale): Dictionary {
  const edited = rows.filter((row) => EDITABLE.has(row.key) && typeof row[lang] === "string" && row[lang].trim() !== "");
  if (edited.length === 0) return base;

  const copy = structuredClone(base);
  for (const row of edited) {
    const path = row.key.split(".");
    parentOf(copy, path)[path[path.length - 1]] = row[lang].trim();
  }
  return copy;
}
