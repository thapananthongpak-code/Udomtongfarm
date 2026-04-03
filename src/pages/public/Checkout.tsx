import { useState, useEffect, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCartStore } from "../../store/cartStore";
import { useOrderStore } from "../../store/orderStore";
import { useSpeciesStore } from "../../store/speciesStore";
import { useAuth } from "../../store/AuthContext";
import { useSettingsStore } from "../../store/settingsStore";
import { useAppSettingsStore } from "../../store/appSettingsStore";
import { promptPayQRUrl } from "../../utils/promptpay";
import type { Address, PaymentMethod, ShippingCompany } from "../../types/shop";
import { SHIPPING_COMPANIES } from "../../types/shop";

const PAYMENT_METHODS: { id: PaymentMethod; icon: string; labelTh: string; labelEn: string }[] = [
  { id: "promptpay",    icon: "📱", labelTh: "พร้อมเพย์ (PromptPay)",   labelEn: "PromptPay" },
  { id: "bank_transfer",icon: "🏦", labelTh: "โอนเงินผ่านธนาคาร",      labelEn: "Bank Transfer" },
  { id: "cod",          icon: "💵", labelTh: "เก็บเงินปลายทาง (COD)",  labelEn: "Cash on Delivery" },
  { id: "credit_card",  icon: "💳", labelTh: "บัตรเครดิต/เดบิต",       labelEn: "Credit/Debit Card" },
];

const PROVINCES: { th: string; en: string }[] = [
  { th: "กรุงเทพมหานคร", en: "Bangkok" },
  { th: "กระบี่", en: "Krabi" },
  { th: "กาญจนบุรี", en: "Kanchanaburi" },
  { th: "กาฬสินธุ์", en: "Kalasin" },
  { th: "กำแพงเพชร", en: "Kamphaeng Phet" },
  { th: "ขอนแก่น", en: "Khon Kaen" },
  { th: "จันทบุรี", en: "Chanthaburi" },
  { th: "ฉะเชิงเทรา", en: "Chachoengsao" },
  { th: "ชลบุรี", en: "Chonburi" },
  { th: "ชัยนาท", en: "Chai Nat" },
  { th: "ชัยภูมิ", en: "Chaiyaphum" },
  { th: "ชุมพร", en: "Chumphon" },
  { th: "เชียงราย", en: "Chiang Rai" },
  { th: "เชียงใหม่", en: "Chiang Mai" },
  { th: "ตรัง", en: "Trang" },
  { th: "ตราด", en: "Trat" },
  { th: "ตาก", en: "Tak" },
  { th: "นครนายก", en: "Nakhon Nayok" },
  { th: "นครปฐม", en: "Nakhon Pathom" },
  { th: "นครพนม", en: "Nakhon Phanom" },
  { th: "นครราชสีมา", en: "Nakhon Ratchasima" },
  { th: "นครศรีธรรมราช", en: "Nakhon Si Thammarat" },
  { th: "นครสวรรค์", en: "Nakhon Sawan" },
  { th: "นนทบุรี", en: "Nonthaburi" },
  { th: "นราธิวาส", en: "Narathiwat" },
  { th: "น่าน", en: "Nan" },
  { th: "บึงกาฬ", en: "Bueng Kan" },
  { th: "บุรีรัมย์", en: "Buriram" },
  { th: "ปทุมธานี", en: "Pathum Thani" },
  { th: "ประจวบคีรีขันธ์", en: "Prachuap Khiri Khan" },
  { th: "ปราจีนบุรี", en: "Prachinburi" },
  { th: "ปัตตานี", en: "Pattani" },
  { th: "พระนครศรีอยุธยา", en: "Phra Nakhon Si Ayutthaya" },
  { th: "พะเยา", en: "Phayao" },
  { th: "พังงา", en: "Phang Nga" },
  { th: "พัทลุง", en: "Phatthalung" },
  { th: "พิจิตร", en: "Phichit" },
  { th: "พิษณุโลก", en: "Phitsanulok" },
  { th: "เพชรบุรี", en: "Phetchaburi" },
  { th: "เพชรบูรณ์", en: "Phetchabun" },
  { th: "แพร่", en: "Phrae" },
  { th: "ภูเก็ต", en: "Phuket" },
  { th: "มหาสารคาม", en: "Maha Sarakham" },
  { th: "มุกดาหาร", en: "Mukdahan" },
  { th: "แม่ฮ่องสอน", en: "Mae Hong Son" },
  { th: "ยโสธร", en: "Yasothon" },
  { th: "ยะลา", en: "Yala" },
  { th: "ร้อยเอ็ด", en: "Roi Et" },
  { th: "ระนอง", en: "Ranong" },
  { th: "ระยอง", en: "Rayong" },
  { th: "ราชบุรี", en: "Ratchaburi" },
  { th: "ลพบุรี", en: "Lopburi" },
  { th: "ลำปาง", en: "Lampang" },
  { th: "ลำพูน", en: "Lamphun" },
  { th: "เลย", en: "Loei" },
  { th: "ศรีสะเกษ", en: "Si Sa Ket" },
  { th: "สกลนคร", en: "Sakon Nakhon" },
  { th: "สงขลา", en: "Songkhla" },
  { th: "สตูล", en: "Satun" },
  { th: "สมุทรปราการ", en: "Samut Prakan" },
  { th: "สมุทรสงคราม", en: "Samut Songkhram" },
  { th: "สมุทรสาคร", en: "Samut Sakhon" },
  { th: "สระแก้ว", en: "Sa Kaeo" },
  { th: "สระบุรี", en: "Saraburi" },
  { th: "สิงห์บุรี", en: "Sing Buri" },
  { th: "สุโขทัย", en: "Sukhothai" },
  { th: "สุพรรณบุรี", en: "Suphan Buri" },
  { th: "สุราษฎร์ธานี", en: "Surat Thani" },
  { th: "สุรินทร์", en: "Surin" },
  { th: "หนองคาย", en: "Nong Khai" },
  { th: "หนองบัวลำภู", en: "Nong Bua Lam Phu" },
  { th: "อ่างทอง", en: "Ang Thong" },
  { th: "อำนาจเจริญ", en: "Amnat Charoen" },
  { th: "อุดรธานี", en: "Udon Thani" },
  { th: "อุตรดิตถ์", en: "Uttaradit" },
  { th: "อุทัยธานี", en: "Uthai Thani" },
  { th: "อุบลราชธานี", en: "Ubon Ratchathani" },
];

type Step = "address" | "payment" | "review";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isMobile;
}

function calcEstimatedDelivery(company: ShippingCompany, lang: string): string {
  const cfg = SHIPPING_COMPANIES.find(c => c.id === company);
  if (!cfg) return "";
  const today = new Date();
  const minDate = new Date(today);
  const maxDate = new Date(today);
  minDate.setDate(today.getDate() + cfg.daysMin);
  maxDate.setDate(today.getDate() + cfg.daysMax);
  const locale = lang === "th" ? "th-TH" : "en-US";
  const fmt = (d: Date) => d.toLocaleDateString(locale, { month: "short", day: "numeric" });
  return `${fmt(minDate)} – ${fmt(maxDate)}`;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { lang } = useSettingsStore();
  const { items, totalPrice, clearCart } = useCartStore();
  const { createOrder, fetchAddresses, addAddress, deleteAddress, addresses } = useOrderStore();
  const { markAsSold } = useSpeciesStore();
  const { user } = useAuth();
  const appSettings = useAppSettingsStore();
  const isMobile = useIsMobile();

  const [step, setStep]                     = useState<Step>("address");
  const [payMethod, setPayMethod]           = useState<PaymentMethod>("promptpay");
  const [shippingCo, setShippingCo]         = useState<ShippingCompany>("flash");
  const [selectedAddr, setSelectedAddr]     = useState<Partial<Address> | null>(null);
  const [showNewAddr, setShowNewAddr]       = useState(false);
  const [note, setNote]                     = useState("");
  const [submitting, setSubmitting]         = useState(false);
  const [error, setError]                   = useState("");

  const [addrForm, setAddrForm] = useState<Omit<Address, "id" | "is_default">>({
    user_email: user?.email ?? "",
    name: "",
    phone: "",
    address_line: "",
    district: "",
    province: "",
    postal_code: "",
  });

  const shippingCfg = SHIPPING_COMPANIES.find(c => c.id === shippingCo)!;
  const fmt = (n: number) =>
    n.toLocaleString("th-TH", { style: "currency", currency: "THB", minimumFractionDigits: 0 });

  const FREE_SHIP  = 1000;
  const subtotal   = totalPrice();
  const shippingFee = subtotal >= FREE_SHIP ? 0 : shippingCfg.fee;
  const grandTotal = subtotal + shippingFee;

  useEffect(() => {
    if (user?.email) {
      fetchAddresses(user.email);
      setAddrForm(f => ({ ...f, user_email: user.email! }));
    }
  }, [user?.email]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddr) {
      const def = addresses.find(a => a.is_default === 1) ?? addresses[0];
      setSelectedAddr(def);
    }
  }, [addresses]);

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: "3rem", marginBottom: 12 }}>🛒</div>
        <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
          {lang === "th" ? "ตะกร้าว่างเปล่า" : "Your cart is empty"}
        </p>
        <Link to="/encyclopedia" style={{ background: "var(--primary)", color: "white", padding: "10px 24px", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>
          {lang === "th" ? "เลือกสินค้า" : "Browse"}
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: "3rem", marginBottom: 12 }}>🔒</div>
        <p style={{ color: "var(--text-muted)", marginBottom: 20 }}>
          {lang === "th" ? "กรุณาเข้าสู่ระบบก่อนสั่งซื้อ" : "Please login to checkout"}
        </p>
        <Link to="/login" style={{ background: "var(--primary)", color: "white", padding: "10px 24px", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>
          {lang === "th" ? "เข้าสู่ระบบ" : "Login"}
        </Link>
      </div>
    );
  }

  async function handleSaveAddress() {
    if (!addrForm.name || !addrForm.address_line || !addrForm.province) {
      setError(lang === "th" ? "กรุณากรอกข้อมูลที่อยู่ให้ครบ" : "Please fill in all required address fields");
      return;
    }
    const ok = await addAddress({ ...addrForm, is_default: addresses.length === 0 ? 1 : 0 });
    if (ok) {
      setShowNewAddr(false);
      setError("");
      setTimeout(() => {
        fetchAddresses(user!.email!).then(() => {
          setSelectedAddr(addresses[0] ?? null);
        });
      }, 300);
    } else {
      setError(lang === "th" ? "บันทึกที่อยู่ล้มเหลว" : "Failed to save address");
    }
  }

  async function handlePlaceOrder() {
    if (!selectedAddr?.address_line || !selectedAddr?.province) {
      setStep("address");
      setError(lang === "th" ? "กรุณาเลือกหรือเพิ่มที่อยู่จัดส่ง" : "Please select a shipping address");
      return;
    }
    setSubmitting(true);
    setError("");
    const result = await createOrder({
      user_email:       user!.email!,
      items: items.map(i => ({
        species_id:     i.species_id,
        species_name:   i.species_name,
        species_name_en: i.species_name_en,
        species_image:  i.species_image,
        species_type:   i.species_type,
        quantity:       i.quantity,
        unit_price:     i.unit_price,
        subtotal:       i.unit_price * i.quantity,
      })),
      total_amount:     grandTotal,
      payment_method:   payMethod,
      shipping_address: selectedAddr,
      shipping_company: shippingCo,
      note,
    });
    setSubmitting(false);
    if (result.ok && result.orderId) {
      markAsSold(items.map(i => i.species_id));
      clearCart();
      navigate(`/orders/${result.orderId}`, { state: { justOrdered: true } });
    } else {
      setError(result.error ?? (lang === "th" ? "เกิดข้อผิดพลาด" : "Something went wrong"));
    }
  }

  const steps: { id: Step; label: string }[] = [
    { id: "address", label: lang === "th" ? "1. ที่อยู่"  : "1. Address" },
    { id: "payment", label: lang === "th" ? "2. จัดส่ง/ชำระ" : "2. Ship/Pay" },
    { id: "review",  label: lang === "th" ? "3. ยืนยัน"  : "3. Review" },
  ];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: isMobile ? "20px 12px" : "32px 20px" }}>
      <h1 style={{ margin: "0 0 20px 0", fontWeight: 900, color: "var(--text-main)", fontSize: isMobile ? "1.3rem" : "1.8rem" }}>
        {lang === "th" ? "ชำระเงิน" : "Checkout"}
      </h1>

      {/* Step progress bar */}
      <div style={{ marginBottom: 32 }}>
        {/* Row 1: circles + lines */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {steps.map((s, idx) => {
            const stepOrder = { address: 0, payment: 1, review: 2 };
            const currentIdx = stepOrder[step];
            const isDone    = stepOrder[s.id] < currentIdx;
            const isActive  = s.id === step;
            return (
              <Fragment key={s.id}>
                <div
                  onClick={() => { if (isDone) setStep(s.id); }}
                  style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    background: isActive || isDone ? "var(--primary)" : "var(--bg-color)",
                    border: isActive || isDone ? "none" : "2px solid var(--border-color)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: isActive || isDone ? "white" : "var(--text-muted)",
                    fontWeight: 900, fontSize: "0.9rem",
                    boxShadow: isActive ? "0 4px 16px rgba(43,87,64,0.35)" : "none",
                    transition: "all 0.3s ease",
                    cursor: isDone ? "pointer" : "default",
                  }}
                >
                  {isDone ? "✓" : idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div style={{ flex: 1, height: 3, margin: "0 8px", borderRadius: 4, background: isDone || isActive ? "var(--primary)" : "var(--border-color)", transition: "background 0.3s ease" }} />
                )}
              </Fragment>
            );
          })}
        </div>
        {/* Row 2: labels */}
        <div style={{ display: "flex", alignItems: "flex-start", marginTop: 6 }}>
          {steps.map((s, idx) => {
            const stepOrder = { address: 0, payment: 1, review: 2 };
            const currentIdx = stepOrder[step];
            const isDone    = stepOrder[s.id] < currentIdx;
            const isActive  = s.id === step;
            return (
              <Fragment key={s.id}>
                <div style={{
                  width: 36, flexShrink: 0, textAlign: "center", overflow: "visible",
                  fontSize: isMobile ? "0.7rem" : "0.82rem",
                  fontWeight: isActive ? 800 : 600,
                  color: isActive || isDone ? "var(--primary-hover)" : "var(--text-muted)",
                  whiteSpace: "nowrap",
                }}>
                  {lang === "th" ? ["ที่อยู่","จัดส่ง/ชำระ","ยืนยัน"][idx] : ["Address","Ship/Pay","Review"][idx]}
                </div>
                {idx < steps.length - 1 && <div style={{ flex: 1 }} />}
              </Fragment>
            );
          })}
        </div>
      </div>

      {error && (
        <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#991b1b", fontWeight: 600, fontSize: "0.9rem" }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr min(340px,100%)",
        gap: 20,
        alignItems: "start",
      }}>
        {/* Left: step content */}
        <div>
          {/* STEP 1: Address */}
          {step === "address" && (
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 16, padding: isMobile ? 16 : 24 }}>
              <h3 style={{ margin: "0 0 18px 0", color: "var(--text-main)" }}>
                📍 {lang === "th" ? "ที่อยู่จัดส่ง" : "Shipping Address"}
              </h3>

              {addresses.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                  {addresses.map((addr) => (
                    <div key={addr.id} style={{ position: "relative" }}>
                      <label style={{
                        display: "flex", gap: 12, padding: "14px", paddingRight: 44, borderRadius: 12, cursor: "pointer",
                        border: `2px solid ${selectedAddr?.id === addr.id ? "var(--primary)" : "var(--border-color)"}`,
                        background: selectedAddr?.id === addr.id ? "var(--primary-light)" : "var(--bg-color)",
                        transition: "all 0.15s",
                      }}>
                        <input type="radio" name="addr" checked={selectedAddr?.id === addr.id} onChange={() => setSelectedAddr(addr)} style={{ marginTop: 2 }} />
                        <div>
                          <div style={{ fontWeight: 700, color: "var(--text-main)" }}>{addr.name} {addr.phone && `· ${addr.phone}`}</div>
                          <div style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                            {[addr.address_line, addr.district, addr.province, addr.postal_code].filter(Boolean).join(", ")}
                          </div>
                          {addr.is_default === 1 && (
                            <span style={{ background: "var(--primary)", color: "white", fontSize: "0.7rem", padding: "2px 8px", borderRadius: 6, fontWeight: 700 }}>
                              {lang === "th" ? "ที่อยู่หลัก" : "Default"}
                            </span>
                          )}
                        </div>
                      </label>
                      <button
                        onClick={async () => {
                          if (!window.confirm(lang === "th" ? "ลบที่อยู่นี้?" : "Delete this address?")) return;
                          await deleteAddress(addr.id!, user!.email!);
                          if (selectedAddr?.id === addr.id) setSelectedAddr(null);
                        }}
                        title="Delete address"
                        style={{ position: "absolute", top: 10, right: 10, width: 28, height: 28, borderRadius: "50%", border: "none", background: "#fee2e2", color: "#991b1b", cursor: "pointer", fontWeight: 900, fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}

              {!showNewAddr ? (
                <button
                  onClick={() => setShowNewAddr(true)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, border: "1px dashed var(--primary)", background: "transparent", color: "var(--primary-hover)", fontWeight: 700, cursor: "pointer", width: "100%" }}
                >
                  + {lang === "th" ? "เพิ่มที่อยู่ใหม่" : "Add New Address"}
                </button>
              ) : (
                <div style={{ border: "1px solid var(--border-color)", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                  <h4 style={{ margin: 0, color: "var(--text-main)" }}>{lang === "th" ? "ที่อยู่ใหม่" : "New Address"}</h4>
                  {[
                    { key: "name",         label: lang === "th" ? "ชื่อ-นามสกุล *" : "Full Name *",  placeholder: lang === "th" ? "ชื่อ-นามสกุล" : "Your full name" },
                    { key: "phone",        label: lang === "th" ? "เบอร์โทรศัพท์"  : "Phone",         placeholder: "0xx-xxx-xxxx" },
                    { key: "address_line", label: lang === "th" ? "ที่อยู่ *"       : "Address *",     placeholder: lang === "th" ? "บ้านเลขที่ ถนน ซอย" : "Street address, lane, road" },
                    { key: "district",     label: lang === "th" ? "ตำบล/แขวง"      : "Sub-district",  placeholder: lang === "th" ? "ตำบล/แขวง" : "Sub-district" },
                    { key: "postal_code",  label: lang === "th" ? "รหัสไปรษณีย์"   : "Postal Code",   placeholder: lang === "th" ? "รหัสไปรษณีย์" : "Postal code" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={{ display: "block", fontWeight: 600, marginBottom: 4, fontSize: "0.88rem", color: "var(--text-muted)" }}>{f.label}</label>
                      <input
                        value={(addrForm as any)[f.key]}
                        onChange={e => setAddrForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", boxSizing: "border-box" }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: "block", fontWeight: 600, marginBottom: 4, fontSize: "0.88rem", color: "var(--text-muted)" }}>
                      {lang === "th" ? "จังหวัด *" : "Province *"}
                    </label>
                    <select
                      value={addrForm.province}
                      onChange={e => setAddrForm(p => ({ ...p, province: e.target.value }))}
                      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)" }}
                    >
                      <option value="">{lang === "th" ? "-- เลือกจังหวัด --" : "-- Select Province --"}</option>
                      {PROVINCES.map(p => <option key={p.th} value={lang === "th" ? p.th : p.en}>{lang === "th" ? p.th : p.en}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={() => { setShowNewAddr(false); setError(""); }} style={{ flex: 1, padding: "10px", borderRadius: 9, border: "1px solid var(--border-color)", background: "var(--bg-color)", cursor: "pointer", fontWeight: 700 }}>
                      {lang === "th" ? "ยกเลิก" : "Cancel"}
                    </button>
                    <button onClick={handleSaveAddress} style={{ flex: 1, padding: "10px", borderRadius: 9, background: "var(--primary)", color: "white", border: "none", cursor: "pointer", fontWeight: 700 }}>
                      {lang === "th" ? "บันทึก" : "Save"}
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => { if (!selectedAddr?.address_line) { setError(lang === "th" ? "กรุณาเลือกที่อยู่" : "Please select an address"); return; } setError(""); setStep("payment"); }}
                style={{ marginTop: 20, width: "100%", padding: "13px", borderRadius: 12, background: "var(--primary)", color: "white", border: "none", fontWeight: 800, fontSize: "1rem", cursor: "pointer" }}
              >
                {lang === "th" ? "ถัดไป: เลือกขนส่ง/ชำระ →" : "Next: Shipping & Payment →"}
              </button>
            </div>
          )}

          {/* STEP 2: Shipping carrier + Payment */}
          {step === "payment" && (
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 16, padding: isMobile ? 16 : 24 }}>
              {/* Shipping carrier */}
              <h3 style={{ margin: "0 0 14px 0", color: "var(--text-main)" }}>
                🚚 {lang === "th" ? "เลือกบริษัทขนส่ง" : "Shipping Carrier"}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
                {SHIPPING_COMPANIES.map(co => (
                  <label key={co.id} style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    padding: "12px 8px", borderRadius: 12, cursor: "pointer",
                    border: `2px solid ${shippingCo === co.id ? "var(--primary)" : "var(--border-color)"}`,
                    background: shippingCo === co.id ? "var(--primary-light)" : "var(--bg-color)",
                    transition: "all 0.15s", textAlign: "center",
                  }}>
                    <input type="radio" name="shipco" checked={shippingCo === co.id} onChange={() => setShippingCo(co.id)} style={{ display: "none" }} />
                    <span style={{ fontSize: "1.6rem" }}>{co.icon}</span>
                    <span style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.82rem" }}>{lang === "th" ? co.nameTh : co.nameEn}</span>
                    <span style={{ fontSize: "0.72rem", color: shippingCo === co.id ? "var(--primary-hover)" : "var(--text-muted)" }}>
                      {lang === "th" ? `${co.daysMin}–${co.daysMax} วัน` : `${co.daysMin}–${co.daysMax} days`}
                    </span>
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, color: subtotal >= FREE_SHIP ? "#16a34a" : "var(--text-muted)" }}>
                      {subtotal >= FREE_SHIP ? (lang === "th" ? "ฟรี" : "Free") : `฿${co.fee}`}
                    </span>
                  </label>
                ))}
              </div>

              {/* Estimated delivery info */}
              <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: "0.88rem", color: "#15803d" }}>
                📅 {lang === "th" ? "คาดว่าจะได้รับสินค้า:" : "Estimated delivery:"} <strong>{calcEstimatedDelivery(shippingCo, lang)}</strong>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid var(--border-color)", margin: "0 0 18px 0" }} />

              {/* Payment method */}
              <h3 style={{ margin: "0 0 14px 0", color: "var(--text-main)" }}>
                💳 {lang === "th" ? "วิธีการชำระเงิน" : "Payment Method"}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                {PAYMENT_METHODS.map(m => (
                  <label key={m.id} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 12, cursor: "pointer",
                    border: `2px solid ${payMethod === m.id ? "var(--primary)" : "var(--border-color)"}`,
                    background: payMethod === m.id ? "var(--primary-light)" : "var(--bg-color)",
                    transition: "all 0.15s",
                  }}>
                    <input type="radio" name="pay" checked={payMethod === m.id} onChange={() => setPayMethod(m.id)} />
                    <span style={{ fontSize: "1.3rem" }}>{m.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text-main)", fontSize: "0.9rem" }}>{lang === "th" ? m.labelTh : m.labelEn}</div>
                      {m.id === "cod" && <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{lang === "th" ? "มีค่าบริการเพิ่มเติม ฿30" : "+฿30 service fee"}</div>}
                      {m.id === "credit_card" && <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{lang === "th" ? "เร็วๆ นี้" : "Coming soon"}</div>}
                    </div>
                  </label>
                ))}
              </div>

              {payMethod === "promptpay" && (
                <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 10, padding: 14, marginBottom: 14, fontSize: "0.88rem" }}>
                  <div style={{ fontWeight: 700, color: "#15803d", marginBottom: 8 }}>📱 {lang === "th" ? "พร้อมเพย์" : "PromptPay"}</div>
                  {appSettings.promptpayPhone ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                      <img
                        src={promptPayQRUrl(appSettings.promptpayPhone, grandTotal)}
                        alt="PromptPay QR"
                        style={{ width: 200, height: 200, borderRadius: 8, border: "1px solid #86efac" }}
                      />
                      <div style={{ color: "#166534" }}>{lang === "th" ? "หมายเลขพร้อมเพย์:" : "PromptPay number:"} <strong>{appSettings.promptpayPhone}</strong></div>
                      <div style={{ color: "#166534", fontWeight: 700 }}>{lang === "th" ? "ยอดชำระ:" : "Amount:"} <strong>฿{grandTotal.toLocaleString()}</strong></div>
                    </div>
                  ) : (
                    <div style={{ color: "#166534" }}>{lang === "th" ? "แอดมินจะส่งรายละเอียดหลังสั่งซื้อ" : "Admin will send details after order"}</div>
                  )}
                </div>
              )}
              {payMethod === "bank_transfer" && (
                <div style={{ background: "#eff6ff", border: "1px solid #93c5fd", borderRadius: 10, padding: 14, marginBottom: 14, fontSize: "0.88rem" }}>
                  <div style={{ fontWeight: 700, color: "#1d4ed8", marginBottom: 4 }}>🏦 {lang === "th" ? "โอนเงินธนาคาร" : "Bank Transfer"}</div>
                  {appSettings.bankName && (
                    <div style={{ color: "#1e40af" }}>{lang === "th" ? "ธนาคาร:" : "Bank:"} <strong>{appSettings.bankName}</strong></div>
                  )}
                  {appSettings.bankAccountNo && (
                    <div style={{ color: "#1e40af", marginTop: 2 }}>{lang === "th" ? "เลขบัญชี:" : "Account No:"} <strong>{appSettings.bankAccountNo}</strong></div>
                  )}
                  {appSettings.bankAccountName && (
                    <div style={{ color: "#1e40af", marginTop: 2 }}>{lang === "th" ? "ชื่อบัญชี:" : "Account Name:"} <strong>{appSettings.bankAccountName}</strong></div>
                  )}
                  {!appSettings.bankName && !appSettings.bankAccountNo && (
                    <div style={{ color: "#1e40af" }}>{lang === "th" ? "แอดมินจะส่งรายละเอียดหลังสั่งซื้อ" : "Admin will send details after order"}</div>
                  )}
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontWeight: 600, marginBottom: 6, color: "var(--text-muted)", fontSize: "0.88rem" }}>
                  {lang === "th" ? "หมายเหตุ (ไม่บังคับ)" : "Note (optional)"}
                </label>
                <textarea
                  value={note} onChange={e => setNote(e.target.value)} rows={3}
                  placeholder={lang === "th" ? "ข้อความถึงผู้ขาย..." : "Message to seller..."}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", color: "var(--text-main)", resize: "vertical", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep("address")} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", cursor: "pointer", fontWeight: 700 }}>
                  ← {lang === "th" ? "กลับ" : "Back"}
                </button>
                <button onClick={() => setStep("review")} style={{ flex: 2, padding: "12px", borderRadius: 10, background: "var(--primary)", color: "white", border: "none", fontWeight: 800, cursor: "pointer" }}>
                  {lang === "th" ? "ถัดไป: ตรวจสอบ →" : "Next: Review →"}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === "review" && (
            <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 16, padding: isMobile ? 16 : 24 }}>
              <h3 style={{ margin: "0 0 18px 0", color: "var(--text-main)" }}>
                ✅ {lang === "th" ? "ตรวจสอบคำสั่งซื้อ" : "Review Order"}
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div style={{ background: "var(--bg-color)", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--text-main)", fontSize: "0.88rem" }}>📍 {lang === "th" ? "ที่อยู่จัดส่ง" : "Shipping"}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {selectedAddr?.name} {selectedAddr?.phone && `· ${selectedAddr.phone}`}<br />
                    {[selectedAddr?.address_line, selectedAddr?.district, selectedAddr?.province, selectedAddr?.postal_code].filter(Boolean).join(", ")}
                  </div>
                </div>
                <div style={{ background: "var(--bg-color)", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--text-main)", fontSize: "0.88rem" }}>🚚 {lang === "th" ? "ขนส่ง" : "Carrier"}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {shippingCfg.icon} {lang === "th" ? shippingCfg.nameTh : shippingCfg.nameEn}
                    <br />
                    📅 {calcEstimatedDelivery(shippingCo, lang)}
                  </div>
                </div>
              </div>

              <div style={{ background: "var(--bg-color)", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--text-main)", fontSize: "0.88rem" }}>💳 {lang === "th" ? "การชำระเงิน" : "Payment"}</div>
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  {PAYMENT_METHODS.find(m => m.id === payMethod)?.[lang === "th" ? "labelTh" : "labelEn"]}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div style={{ fontWeight: 700, marginBottom: 10, color: "var(--text-main)", fontSize: "0.88rem" }}>🛒 {lang === "th" ? "รายการสินค้า" : "Items"}</div>
                {items.map(item => (
                  <div key={item.cart_key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border-color)", fontSize: "0.88rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <img src={item.species_image} style={{ width: 34, height: 34, borderRadius: 6, objectFit: "cover" }} />
                      <div>
                        <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{lang === "th" ? item.species_name : item.species_name_en}</div>
                        <div style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>×{item.quantity} {item.unit}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: "var(--primary-hover)" }}>{fmt(item.unit_price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep("payment")} style={{ flex: 1, padding: "12px", borderRadius: 10, border: "1px solid var(--border-color)", background: "var(--bg-color)", cursor: "pointer", fontWeight: 700 }}>
                  ← {lang === "th" ? "กลับ" : "Back"}
                </button>
                <button
                  onClick={handlePlaceOrder} disabled={submitting}
                  style={{ flex: 2, padding: "13px", borderRadius: 10, background: submitting ? "var(--border-color)" : "var(--primary)", color: submitting ? "var(--text-muted)" : "white", border: "none", fontWeight: 800, fontSize: "1rem", cursor: submitting ? "not-allowed" : "pointer" }}
                >
                  {submitting ? (lang === "th" ? "กำลังสั่งซื้อ..." : "Placing...") : (lang === "th" ? "✓ ยืนยันคำสั่งซื้อ" : "✓ Place Order")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Order summary */}
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border-color)", borderRadius: 16, padding: 18, position: isMobile ? "static" : "sticky", top: 90 }}>
          <h4 style={{ margin: "0 0 14px 0", color: "var(--text-main)" }}>
            {lang === "th" ? "สรุปคำสั่งซื้อ" : "Order Summary"}
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 12 }}>
            {items.map(item => (
              <div key={item.cart_key} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-muted)" }}>{lang === "th" ? item.species_name : item.species_name_en} ×{item.quantity}</span>
                <span style={{ fontWeight: 700, color: "var(--text-main)" }}>{fmt(item.unit_price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: 10, display: "flex", flexDirection: "column", gap: 7 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.87rem", color: "var(--text-muted)" }}>
              <span>{lang === "th" ? "ยอดรวม" : "Subtotal"}</span>
              <span style={{ fontWeight: 700 }}>{fmt(subtotal)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.87rem", color: "var(--text-muted)" }}>
              <span>{lang === "th" ? `ค่าขนส่ง (${shippingCfg.nameTh})` : `Shipping (${shippingCfg.nameEn})`}</span>
              <span style={{ fontWeight: 700, color: shippingFee === 0 ? "#16a34a" : undefined }}>
                {shippingFee === 0 ? (lang === "th" ? "ฟรี" : "Free") : fmt(shippingFee)}
              </span>
            </div>
            {subtotal < FREE_SHIP && (
              <div style={{ fontSize: "0.75rem", color: "#16a34a" }}>
                {lang === "th" ? `ซื้อเพิ่ม ${fmt(FREE_SHIP - subtotal)} รับส่งฟรี!` : `Add ${fmt(FREE_SHIP - subtotal)} for free shipping!`}
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: "1.1rem", color: "var(--primary-hover)", paddingTop: 8, borderTop: "1px solid var(--border-color)" }}>
              <span>{lang === "th" ? "ยอดชำระ" : "Total"}</span>
              <span>{fmt(grandTotal)}</span>
            </div>
          </div>
          {/* Delivery estimate in summary */}
          <div style={{ marginTop: 10, background: "var(--bg-color)", borderRadius: 8, padding: "8px 10px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
            📅 {lang === "th" ? "คาดส่ง:" : "Est. delivery:"} <strong style={{ color: "var(--text-main)" }}>{calcEstimatedDelivery(shippingCo, lang)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
