// Facts about the farm, shared by the pages and the chat assistant.
// This file has no dependencies so that the chat function can load it too.

import type { Bilingual, Locale } from "../i18n/config.js";

/**
 * Starting contact details. Once Supabase is connected these are edited in the
 * admin dashboard; the values here are only the fallback.
 */
export const DEFAULT_CONTACT = {
  phone: "0811733620",
  facebook_url: "https://www.facebook.com/Udomtongfarm",
  map_url: "https://maps.app.goo.gl/wZU3hkUTgYLfEhK38",
  address_th: "ตำบลห้วยบง อำเภอเมืองชัยภูมิ จังหวัดชัยภูมิ 36000",
  address_en: "Huai Bong, Mueang Chaiyaphum, Chaiyaphum 36000, Thailand",
};

/** Contact details an admin can change. The shape matches the `site_settings` table. */
export type SiteSettings = typeof DEFAULT_CONTACT;

export const SETTINGS_FIELDS = Object.keys(DEFAULT_CONTACT) as (keyof SiteSettings)[];

// Plus code R537+R9M, Huai Bong, Mueang Chaiyaphum
export const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=R537%2BR9M+%E0%B8%AB%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B8%9A%E0%B8%87+%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%87%E0%B8%8A%E0%B8%B1%E0%B8%A2%E0%B8%A0%E0%B8%B9%E0%B8%A1%E0%B8%B4+%E0%B8%8A%E0%B8%B1%E0%B8%A2%E0%B8%A0%E0%B8%B9%E0%B8%A1%E0%B8%B4&t=&z=15&ie=UTF8&iwloc=B&output=embed";

export const FOUNDER: { name: Bilingual; title: Bilingual; org: Bilingual; bio: Bilingual } = {
  name: { th: "นายธีรวุฒิ ธงภักดิ์", en: "Mr. Terawut Thongpak" },
  title: {
    th: "รองเลขาธิการคณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ",
    en: "Deputy Secretary-General, National Digital Economy and Society Commission",
  },
  org: { th: "สำนักงาน สดช. (BDE)", en: "Office of the NDES Commission (BDE)" },
  bio: {
    th: "นายธีรวุฒิ ธงภักดิ์ มีประสบการณ์ยาวนานในสายงานเทคโนโลยีสารสนเทศและระบบเครือข่ายภาครัฐ ก่อนพัฒนาบทบาทสู่การเป็นผู้บริหารระดับสูงที่วางนโยบายด้านดิจิทัล ครอบคลุมประเด็น AI ข้อมูลขนาดใหญ่ (Big Data) และการผลักดันสังคมดิจิทัลในระดับประเทศ นอกจากบทบาทด้านราชการแล้ว ท่านยังมีความหลงใหลในธรรมชาติและสิ่งมีชีวิตหายาก จึงก่อตั้งฟาร์มอุดมทองขึ้นเพื่อเป็นแหล่งรวบรวม ศึกษา และอนุรักษ์พันธุ์สัตว์และพืชหายาก ณ จังหวัดชัยภูมิ",
    en: "Mr. Terawut Thongpak brings extensive experience in government IT and network systems, rising to senior leadership roles in national digital policy encompassing AI, Big Data, and digital infrastructure. Beyond his public service, his passion for nature and rare species led to the founding of Udomtong Farm, a dedicated space for collecting, studying, and conserving rare animals and plants in Chaiyaphum.",
  },
};

export const addressFor = (settings: SiteSettings, lang: Locale) =>
  (lang === "th" ? settings.address_th : settings.address_en) || settings.address_th;

/** 0811733620 becomes 081-173-3620. Other lengths are shown as entered. */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length === 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
  return phone;
}

/** A link without its protocol, for display: "facebook.com/Udomtongfarm". */
export const displayUrl = (url: string) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/+$/, "");
