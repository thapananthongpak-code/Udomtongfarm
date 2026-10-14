// The farm's activities and rates as first published, without photographs.
// The site shows this until Supabase is connected, and scripts/build-seed-sql.mjs turns it
// into supabase/seed.sql. Once Supabase is connected, they are edited in the admin dashboard.
// A price stays empty until the farm has set one, and zero means free.

import type { FarmService, ServiceKind } from "../lib/services.js";

type Sample = {
  name_th: string;
  name_en: string;
  description_th: string;
  description_en: string;
  price?: number;
};

const SAMPLES: Record<ServiceKind, Sample[]> = {
  activity: [
    {
      name_th: "ขับรถ ATV",
      name_en: "ATV rides",
      description_th: "ขับรถ ATV ชมบรรยากาศรอบฟาร์ม",
      description_en: "Drive an ATV on a circuit around the farm.",
    },
    {
      name_th: "ให้อาหารสัตว์",
      name_en: "Feeding the animals",
      description_th: "ให้อาหารสัตว์ต่าง ๆ ในฟาร์ม เช่น นกยูง และหงส์",
      description_en: "Feed the animals around the farm, such as the peacocks and the swans.",
    },
    {
      name_th: "เก็บไข่ไก่",
      name_en: "Collecting eggs",
      description_th: "ลงมือเก็บไข่ไก่ด้วยตัวเอง",
      description_en: "Collect hens' eggs yourself.",
    },
    {
      name_th: "ตกปลา",
      name_en: "Fishing",
      description_th: "ฟรีสำหรับผู้ที่เข้าพักโฮมสเตย์",
      description_en: "Free for guests staying at the homestay.",
    },
  ],
  rate: [
    {
      name_th: "เข้าชมฟาร์ม",
      name_en: "Farm admission",
      description_th: "เข้าพื้นที่ฟาร์มได้โดยไม่มีค่าใช้จ่าย",
      description_en: "Entering the farm is free of charge.",
      price: 0,
    },
    {
      name_th: "ที่พักโฮมสเตย์",
      name_en: "Homestay",
      description_th: "4 ห้อง พักได้ห้องละไม่เกิน 4 คน รวมน้ำดื่ม อาหารเช้า และกิจกรรมตกปลา",
      description_en: "Four rooms, each for up to four guests. Drinking water, breakfast and fishing are included.",
    },
    {
      name_th: "ขับรถ ATV",
      name_en: "ATV rides",
      description_th: "ขับรถ ATV ชมบรรยากาศรอบฟาร์ม",
      description_en: "Drive an ATV on a circuit around the farm.",
    },
    {
      name_th: "ตกปลา",
      name_en: "Fishing",
      description_th: "ฟรีสำหรับผู้เข้าพักโฮมสเตย์ ผู้ที่ไม่ได้เข้าพักกรุณาสอบถามฟาร์ม",
      description_en: "Free for homestay guests. Other customers, please ask the farm.",
    },
  ],
};

export const seedServices: FarmService[] = Object.entries(SAMPLES).flatMap(([kind, samples]) =>
  samples.map((sample, index) => ({
    id: `${kind}-${index + 1}`,
    kind: kind as ServiceKind,
    name_th: sample.name_th,
    name_en: sample.name_en,
    description_th: sample.description_th,
    description_en: sample.description_en,
    unit_th: "",
    unit_en: "",
    price: sample.price ?? null,
    image: "",
    sort_order: index + 1,
    published: true,
  })),
);
