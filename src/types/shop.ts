export type CartItem = {
  cart_key: string;         // species_id + '|' + (gender || '') — unique per gender
  species_id: string;
  species_name: string;     // ชื่อภาษาไทย
  species_name_en: string;  // ชื่อภาษาอังกฤษ
  species_image: string;
  species_type: "animal" | "plant";
  unit_price: number;
  quantity: number;
  unit: string;
  gender?: string;          // เพศที่เลือก
};

export type Address = {
  id?: number;
  user_email: string;
  name: string;
  phone: string;
  address_line: string;
  district: string;
  province: string;
  postal_code: string;
  is_default: number;
};

export type OrderItem = {
  id: number;
  order_id: string;
  species_id: string;
  species_name: string;
  species_image: string;
  species_type: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
};

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "promptpay" | "bank_transfer" | "cod" | "credit_card";

export type ShippingCompany = "flash" | "kerry" | "dhl" | "thailand_post" | "jnt" | "scg";

export const SHIPPING_COMPANIES: {
  id: ShippingCompany;
  nameTh: string;
  nameEn: string;
  icon: string;
  daysMin: number;
  daysMax: number;
  fee: number;
}[] = [
  { id: "flash",        nameTh: "Flash Express",      nameEn: "Flash Express",      icon: "⚡", daysMin: 1, daysMax: 2, fee: 50 },
  { id: "kerry",        nameTh: "Kerry Express",       nameEn: "Kerry Express",       icon: "🔵", daysMin: 1, daysMax: 3, fee: 60 },
  { id: "dhl",          nameTh: "DHL",                 nameEn: "DHL",                 icon: "📦", daysMin: 1, daysMax: 3, fee: 80 },
  { id: "thailand_post",nameTh: "ไปรษณีย์ไทย",         nameEn: "Thailand Post",       icon: "🏣", daysMin: 3, daysMax: 7, fee: 40 },
  { id: "jnt",          nameTh: "J&T Express",         nameEn: "J&T Express",         icon: "🔴", daysMin: 1, daysMax: 2, fee: 55 },
  { id: "scg",          nameTh: "SCG Express",         nameEn: "SCG Express",         icon: "🟢", daysMin: 1, daysMax: 2, fee: 65 },
];

export type Order = {
  id: string;
  user_email: string;
  total_amount: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  shipping_address: Partial<Address>;
  shipping_company?: ShippingCompany;
  tracking_number?: string;
  estimated_delivery?: string;
  note: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
};
