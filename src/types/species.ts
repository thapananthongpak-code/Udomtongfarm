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
  quantity?: number;    // จำนวนที่มีพร้อมขาย (legacy)
  price?: number;       // ราคาขาย (บาท)
  stock?: number;       // จำนวนสต็อก
  unit?: string;        // หน่วย เช่น "ตัว", "ต้น", "คู่"
  age?: string;         // อายุ เช่น "6 เดือน - 1 ปี"
  gender?: string;      // เพศที่มีจำหน่าย เช่น "ผสม", "เพศผู้", "เพศเมีย"

  references: Reference[];
};