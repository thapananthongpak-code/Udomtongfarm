// What the chat assistant knows. Everything here is built from the same text the pages
// show, so updating the site's wording or the collection updates the assistant's answers.

import { createClient } from "@supabase/supabase-js";
import { seedSpecies } from "../../src/data/species.js";
import en from "../../src/i18n/dictionaries/en.js";
import th from "../../src/i18n/dictionaries/th.js";
import { DEFAULT_CONTACT, FOUNDER, SETTINGS_FIELDS, formatPhone, type SiteSettings } from "../../src/lib/farm.js";
import type { Species } from "../../src/lib/species/types.js";

// The same public values the website uses. Vercel makes them available to this function too.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false, autoRefreshToken: false } })
    : null;

/** The published collection and contact details: from Supabase when connected, otherwise the bundled data. */
async function loadFarmData(): Promise<{ species: Species[]; contact: SiteSettings }> {
  if (!supabase) return { species: seedSpecies, contact: DEFAULT_CONTACT };

  const [species, settings] = await Promise.all([
    supabase.from("species").select("*").eq("published", true),
    supabase.from("site_settings").select(SETTINGS_FIELDS.join(",")).eq("id", 1).maybeSingle(),
  ]);
  return {
    species: species.error ? seedSpecies : (species.data as Species[]),
    contact: settings.error || !settings.data ? DEFAULT_CONTACT : (settings.data as unknown as SiteSettings),
  };
}

const INSTRUCTIONS = `You are the visitor assistant on the website of Udomtong Farm (ฟาร์มอุดมทอง), a farm in Chaiyaphum province, Thailand, that breeds rare animals and plants and is open to the public. People reach you through a small chat window on the site. Most are members of the public deciding whether to visit, or curious about an animal or plant kept at the farm.

How to answer:

Facts about the farm itself must come from the farm information below, which is everything the farm has published. When a visitor asks about something it does not cover, such as the price of a room or an activity, whether a room is free on a given date, or an animal or plant that is not in the species list, say plainly that you do not have that information and suggest contacting the farm using the contact details below. For a species that is not in the list, say that it is not in the collection the farm has published, rather than that the farm does not have it. Do not fill the gap with a guess or with how farms usually work: a visitor may travel a long way on the strength of your answer.

Entry to the farm is free, and for homestay guests the drinking water, breakfast and fishing are free. No other prices have been published, so do not describe anything else as free or quote a price for it. Rooms are booked by contacting the farm; you cannot take a booking yourself.

The farm describes the café as something it will have. Do not say it is open now.

For questions about the biology or care of a species in the list, use the species information below. You may add well-established general facts about that species when they help, but do not invent details about the individual animals or plants at this farm.

Reply in the language named at the very end of these instructions, which is the language of the visitor's latest message. In Thai, write natural, polite Thai and end sentences with ครับ where it fits.

Keep replies short, usually two to four sentences. The chat window is small and shows plain text only, so write ordinary sentences with no Markdown, headings, bullet symbols or emoji. When a species has more to read, mention that its page in the Collection section of this website has the full description.

Stay on the subject of the farm, its animals and plants, and visiting. If asked about anything else, say that you can only help with questions about Udomtong Farm.`;

const lines = (items: string[]) => items.filter(Boolean).join("\n");

function speciesLine(sp: Species): string {
  const scientific = sp.scientific_name ? ` (${sp.scientific_name})` : "";
  const status = sp.status ? `${sp.status} (${en.status[sp.status]} / ${th.status[sp.status]})` : "not evaluated";
  return lines([
    `- ${sp.name_th} / ${sp.name_en}${scientific}`,
    `  kind: ${sp.type}; IUCN status: ${status}; groups: ${sp.tags.join(", ") || "none"}`,
    sp.summary_th && `  th: ${sp.summary_th}`,
    sp.summary_en && `  en: ${sp.summary_en}`,
  ]);
}

/**
 * The part of the prompt that is the same for every visitor: the instructions and
 * everything the farm has published. Species are sorted so the text is identical
 * from one request to the next, which lets Gemini reuse it at a lower price.
 */
export async function buildFarmKnowledge(): Promise<{ prompt: string; species: Species[] }> {
  const { species, contact } = await loadFarmData();
  const sorted = [...species].sort((a, b) => a.id.localeCompare(b.id));
  const animals = sorted.filter((sp) => sp.type === "animal");
  const plants = sorted.filter((sp) => sp.type === "plant");

  const prompt = lines([
    INSTRUCTIONS,
    "",
    "<farm_information>",
    "<about>",
    ...th.about.story,
    ...en.about.story,
    `Farm area: ${en.farm.areaFull} / ${th.farm.areaFull}`,
    `Owner and founder: ${FOUNDER.name.th} / ${FOUNDER.name.en}`,
    ...th.farm.offers.map((offer) => `${offer.title}: ${offer.body}`),
    ...en.farm.offers.map((offer) => `${offer.title}: ${offer.body}`),
    "</about>",
    "",
    "<activities>",
    ...th.farm.activities.map((activity) => `${activity.title}: ${activity.body}`),
    ...en.farm.activities.map((activity) => `${activity.title}: ${activity.body}`),
    "</activities>",
    "",
    "<homestay>",
    ...th.farm.stay.map((row) => `${row.label}: ${row.value}`),
    ...en.farm.stay.map((row) => `${row.label}: ${row.value}`),
    "</homestay>",
    "",
    "<visiting>",
    `Admission: ${en.visit.admissionValue} / ${th.visit.admissionValue}`,
    `Visiting hours: ${en.visit.hoursValue} (${en.visit.hoursNote}) / ${th.visit.hoursValue} (${th.visit.hoursNote})`,
    ...th.visit.routes.map((route) => `${route.title}: ${route.body}`),
    ...en.visit.routes.map((route) => `${route.title}: ${route.body}`),
    ...th.visit.faqs.map((faq) => `Q: ${faq.q} A: ${faq.a}`),
    ...en.visit.faqs.map((faq) => `Q: ${faq.q} A: ${faq.a}`),
    "</visiting>",
    "",
    "<contact>",
    `Phone: ${formatPhone(contact.phone)} (${en.visit.phoneHours} / ${th.visit.phoneHours})`,
    contact.facebook_url ? `Facebook: ${contact.facebook_url}` : "",
    `Address (Thai): ${contact.address_th}`,
    `Address (English): ${contact.address_en}`,
    contact.map_url ? `Google Maps: ${contact.map_url}` : "",
    "</contact>",
    "",
    `<species count="${sorted.length}" animals="${animals.length}" plants="${plants.length}">`,
    "Animals:",
    ...animals.map(speciesLine),
    "",
    "Plants:",
    ...plants.map(speciesLine),
    "</species>",
    "</farm_information>",
  ]);

  return { prompt, species: sorted };
}

const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, " ").trim();

/** Names a visitor might type for a species: "ต้นคูน (ราชพฤกษ์)" gives ต้นคูน, คูน and ราชพฤกษ์. */
function namesOf(sp: Species): string[] {
  return [sp.name_th, sp.name_en]
    .flatMap((name) => name.split(/[()]/))
    .flatMap((name) => [name, name.replace(/^ต้น/, "")])
    .map(normalize)
    .filter((name) => name.length >= 3);
}

/**
 * Full descriptions of the species the visitor has named, to add after the cached part
 * of the prompt. Sending every description with every question would cost several times more.
 */
export function describeMentioned(question: string, species: Species[], limit = 3): string | null {
  const text = normalize(question);
  const mentioned = species.filter((sp) => namesOf(sp).some((name) => text.includes(name))).slice(0, limit);
  if (mentioned.length === 0) return null;

  return lines([
    "Full descriptions of the species the visitor has mentioned:",
    ...mentioned.map((sp) =>
      lines([`<species_detail name="${sp.name_en}">`, sp.body_th, sp.body_en, "</species_detail>"]),
    ),
  ]);
}
