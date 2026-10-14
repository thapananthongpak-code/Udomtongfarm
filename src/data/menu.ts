// A sample café menu, without prices or photographs. The site shows this until Supabase
// is connected, and scripts/build-seed-sql.mjs turns it into supabase/seed.sql.
// Once Supabase is connected, the menu is edited in the admin dashboard instead.

import type { MenuCategory, MenuItem } from "../lib/menu.js";

type Sample = [id: string, name_th: string, name_en: string, description_th: string, description_en: string];

const SAMPLES: Record<MenuCategory, Sample[]> = {
  coffee: [
    ["americano", "อเมริกาโน่", "Americano", "กาแฟดำ ร้อนหรือเย็น", "Black coffee, hot or iced"],
    ["latte", "ลาเต้", "Latte", "เอสเปรสโซกับนมสด", "Espresso with fresh milk"],
    ["cappuccino", "คาปูชิโน่", "Cappuccino", "เอสเปรสโซ นมสด และฟองนม", "Espresso, milk and milk foam"],
    ["mocha", "มอคค่า", "Mocha", "กาแฟผสมโกโก้และนมสด", "Coffee with cocoa and milk"],
  ],
  cocoa: [
    ["hot-cocoa", "โกโก้ร้อน", "Hot cocoa", "โกโก้เข้มข้นกับนมสด", "Rich cocoa with fresh milk"],
    ["iced-cocoa", "โกโก้เย็น", "Iced cocoa", "โกโก้เข้มข้นใส่น้ำแข็ง", "Rich cocoa over ice"],
    ["cocoa-frappe", "โกโก้ปั่น", "Cocoa frappé", "โกโก้ปั่นกับน้ำแข็ง", "Cocoa blended with ice"],
  ],
  tea: [
    ["thai-tea", "ชาไทย", "Thai tea", "ชาไทยใส่นม", "Thai tea with milk"],
    ["green-tea-latte", "ชาเขียวนม", "Green tea latte", "ชาเขียวกับนมสด", "Green tea with fresh milk"],
    ["lemon-tea", "ชามะนาว", "Lemon tea", "ชาดำกับน้ำมะนาว", "Black tea with lime juice"],
  ],
  other: [
    ["fresh-milk", "นมสด", "Fresh milk", "ร้อน เย็น หรือปั่น", "Hot, iced or blended"],
    ["honey-lemon-soda", "น้ำผึ้งมะนาวโซดา", "Honey lemon soda", "น้ำผึ้ง มะนาว และโซดา", "Honey, lime and soda"],
  ],
  // The café adds its own food and snacks in the admin dashboard.
  food: [],
  snack: [],
};

export const seedMenu: MenuItem[] = Object.entries(SAMPLES).flatMap(([category, samples]) =>
  samples.map(([id, name_th, name_en, description_th, description_en], index) => ({
    id,
    category: category as MenuCategory,
    name_th,
    name_en,
    description_th,
    description_en,
    price: null,
    image: "",
    sort_order: index + 1,
    published: true,
    available: true,
  })),
);
