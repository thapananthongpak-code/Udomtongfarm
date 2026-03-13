export type Role = "admin" | "user";

// import จากแหล่งเดียว ป้องกันการกำหนดซ้ำ 2 ที่
import { ADMIN_EMAILS } from "../config/admin";
export { ADMIN_EMAILS };

export function getRoleByEmail(email?: string | null): Role {
  if (!email) return "user";
  const e = email.toLowerCase().trim();
  // เช็คว่าเป็นอีเมลคุณหรือไม่
  return ADMIN_EMAILS.includes(e) ? "admin" : "user";
}

// 🚀 ฟังก์ชันสำหรับดึงข้อมูลคนที่กำลัง Login อยู่ปัจจุบัน
export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    
    const user = JSON.parse(userStr);
    
    // รีเช็ค Role จากอีเมลเท่านั้น — ห้ามเชื่อค่าที่เก็บใน localStorage
    // เพื่อป้องกันการแก้ localStorage แล้วได้สิทธิ์ admin
    const calculatedRole = getRoleByEmail(user.email);
    user.role = calculatedRole;
    
    return user;
  } catch {
    return null;
  }
}