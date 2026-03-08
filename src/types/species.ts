export type SpeciesType = "animal" | "plant";

export type Reference = {
  title: string;
  url: string;
};

export type Species = {
  id: string;
  type: SpeciesType;

  name_th: string;
  name_en: string;
  scientific_name?: string;

  short_description: string;
  short_description_en?: string; // 🟢 เพิ่มฟิลด์คำอธิบายสั้น (EN)

  description: string;
  description_en?: string;       // 🟢 เพิ่มฟิลด์คำอธิบายเต็ม (EN)

  image: string;
  tags?: string[];

  available?: boolean;  // พร้อมจำหน่าย (default = true)
  quantity?: number;    // จำนวนที่มีพร้อมขาย

  references: Reference[];
};