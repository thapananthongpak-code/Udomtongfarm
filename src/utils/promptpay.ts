/** Generate a PromptPay EMVCo QR payload (Bank of Thailand standard) */
export function generatePromptPayPayload(phone: string, amount?: number): string {
  const digits = phone.replace(/\D/g, "");
  const id = digits.length === 10 && digits.startsWith("0")
    ? "0066" + digits.slice(1)
    : digits;

  function f(tag: string, val: string): string {
    return tag + val.length.toString().padStart(2, "0") + val;
  }

  const merchantInfo = f("00", "A000000677010111") + f("01", id);

  let payload =
    f("00", "01") +
    f("01", "12") +
    f("29", merchantInfo) +
    f("52", "0000") +
    f("53", "764") +
    (amount && amount > 0 ? f("54", amount.toFixed(2)) : "") +
    f("58", "TH") +
    f("59", "UDOMTONG FARM") +
    f("60", "NAKHON RATCHASIMA") +
    "6304";

  // CRC-16/CCITT
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) : crc << 1;
      crc &= 0xffff;
    }
  }

  return payload + crc.toString(16).toUpperCase().padStart(4, "0");
}

export function promptPayQRUrl(phone: string, amount?: number, size = 220): string {
  const payload = generatePromptPayPayload(phone, amount);
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&color=1b4332&bgcolor=ffffff&data=${encodeURIComponent(payload)}`;
}
