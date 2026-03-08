import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ⚠️ กรอกค่าเหล่านี้จาก Firebase Console → Project Settings → Your apps
// แล้วสร้างไฟล์ .env ใน root ของโปรเจกต์ด้วยค่าเหล่านี้
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            ?? "",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        ?? "",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         ?? "",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             ?? "",
};

// ป้องกัน initialize ซ้ำใน HMR (Vite dev mode)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth           = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// เพิ่ม scope เพื่อดึง email และ profile
googleProvider.addScope("email");
googleProvider.addScope("profile");
