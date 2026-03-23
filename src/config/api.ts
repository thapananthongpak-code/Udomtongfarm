// API base URL — ใช้ "" เพื่อให้ Vite proxy จัดการ (ไม่มี CORS ปัญหา)
// Production: ตั้ง VITE_API_URL=https://your-server.com
export const API_BASE: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.trim().replace(/\/$/, "") ??
  "";
