// API base URL — ตั้งค่าผ่าน env variable VITE_API_URL
// ตัวอย่าง .env:  VITE_API_URL=https://your-server.com
// Development fallback: http://localhost:3000
export const API_BASE: string =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") ??
  "http://localhost:3000";
