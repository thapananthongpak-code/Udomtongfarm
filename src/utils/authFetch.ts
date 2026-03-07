/**
 * authFetch — fetch wrapper ที่แนบ Authorization header อัตโนมัติ
 * อ่าน JWT token จาก localStorage user.token (ถ้ามี)
 * ใช้แทน fetch() ทุกครั้งที่ต้องการ authenticated request
 */
export function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined ?? {}),
  };

  try {
    const raw = localStorage.getItem("user");
    if (raw) {
      const user = JSON.parse(raw) as { token?: string };
      if (user?.token) {
        headers["Authorization"] = `Bearer ${user.token}`;
      }
    }
  } catch {
    // localStorage parse error — ดำเนินการต่อโดยไม่มี token
  }

  return fetch(url, { ...options, headers });
}
