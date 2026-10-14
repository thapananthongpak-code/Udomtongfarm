// The text inside a PromptPay QR code, as banks' apps read it (the EMVCo "merchant presented"
// format that Thai QR Payment uses). A code made here carries the receiving PromptPay number or ID and
// the amount, so the customer only has to scan and confirm. The text is drawn as a QR code by
// src/lib/qr.ts. This file has no dependencies.

/** Each part of the payload is: a two digit tag, a two digit length, then the value. */
const field = (tag: string, value: string) => `${tag}${String(value.length).padStart(2, "0")}${value}`;

/** CRC-16/CCITT-FALSE, which the format asks for over the whole text up to and including "6304". */
export function crc16(text: string): string {
  let crc = 0xffff;
  for (let i = 0; i < text.length; i++) {
    crc ^= text.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * The PromptPay number or ID, as the payload wants it. A ten digit phone number becomes 0066 and the
 * nine digits after its leading zero; a thirteen digit national or tax ID is used as it is.
 * Returns null for anything else, so that a mistyped number never becomes a code.
 */
export function promptPayTarget(id: string): { type: "01" | "02"; value: string } | null {
  const digits = id.replace(/\D/g, "");
  if (/^0\d{9}$/.test(digits)) return { type: "01", value: `0066${digits.slice(1)}` };
  if (/^\d{13}$/.test(digits)) return { type: "02", value: digits };
  return null;
}

/** The QR text for paying `amount` baht to `id`, or null when `id` is not a usable PromptPay number or ID. */
export function promptPayPayload(id: string, amount: number): string | null {
  const target = promptPayTarget(id);
  if (!target || !Number.isFinite(amount) || amount <= 0) return null;

  const body =
    field("00", "01") +
    // "12" says the code is for one payment with a fixed amount.
    field("01", "12") +
    field("29", field("00", "A000000677010111") + field(target.type, target.value)) +
    field("53", "764") +
    field("54", amount.toFixed(2)) +
    field("58", "TH") +
    "6304";

  return body + crc16(body);
}
