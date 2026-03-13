export const FOUNDER_KEY = "uf_founder_profile";

export interface FounderData {
  avatar:  string;
  nameTh:  string;
  nameEn:  string;
  titleTh: string;
  titleEn: string;
  orgTh:   string;
  orgEn:   string;
  bioTh:   string;
  bioEn:   string;
  tagsTh:  string; // comma-separated
  tagsEn:  string; // comma-separated
}

export const FOUNDER_DEFAULTS: FounderData = {
  avatar:  "ธ",
  nameTh:  "นายธีรวุฒิ ธงภักดิ์",
  nameEn:  "Mr. Terawut Thongpak",
  titleTh: "รองเลขาธิการคณะกรรมการดิจิทัลเพื่อเศรษฐกิจและสังคมแห่งชาติ",
  titleEn: "Deputy Secretary-General, National Digital Economy and Society Commission",
  orgTh:   "สำนักงาน สดช. (BDE)",
  orgEn:   "Office of the NDES Commission (BDE)",
  bioTh:   "นายธีรวุฒิ ธงภักดิ์ มีประสบการณ์ยาวนานในสายงานเทคโนโลยีสารสนเทศและระบบเครือข่ายภาครัฐ ก่อนพัฒนาบทบาทสู่การเป็นผู้บริหารระดับสูงที่วางนโยบายด้านดิจิทัล ครอบคลุมประเด็น AI ข้อมูลขนาดใหญ่ (Big Data) และการผลักดันสังคมดิจิทัลในระดับประเทศ นอกจากบทบาทด้านราชการแล้ว ท่านยังมีความหลงใหลในธรรมชาติและสิ่งมีชีวิตหายาก จึงก่อตั้งฟาร์มอุดมทองขึ้นเพื่อเป็นแหล่งรวบรวม ศึกษา และอนุรักษ์พันธุ์สัตว์และพืชหายาก ณ จังหวัดนครราชสีมา",
  bioEn:   "Mr. Terawut Thongpak brings extensive experience in government IT and network systems, rising to senior leadership roles in national digital policy encompassing AI, Big Data, and digital infrastructure. Beyond his public service, his passion for nature and rare species led to the founding of Udomtong Farm — a dedicated space for collecting, studying, and conserving rare animals and plants in Nakhon Ratchasima.",
  tagsTh:  "นโยบาย AI,รัฐบาลดิจิทัล,Big Data,อนุรักษ์ธรรมชาติ",
  tagsEn:  "AI Policy,Digital Government,Big Data,Nature Conservation",
};

export function getFounderData(): FounderData {
  try {
    const saved = JSON.parse(localStorage.getItem(FOUNDER_KEY) || "{}");
    return { ...FOUNDER_DEFAULTS, ...saved };
  } catch {
    return FOUNDER_DEFAULTS;
  }
}
