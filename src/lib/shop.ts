// The shop's ordering settings, shared by the pages and the chat assistant.
// This file has no dependencies so that the chat function can load it too.

/** The shape of the `shop_settings` table in Supabase. */
export type ShopSettings = {
  /** Whether customers can place orders. It starts closed. */
  ordering_open: boolean;
  /** The PromptPay phone number or ID that customers pay to. Empty when PromptPay is not set up. */
  promptpay_id: string;
  /** How many tables have a QR code. Zero means ordering at the counter only. */
  table_count: number;
};

export const DEFAULT_SHOP: ShopSettings = { ordering_open: false, promptpay_id: "", table_count: 0 };

export const SHOP_FIELDS = Object.keys(DEFAULT_SHOP) as (keyof ShopSettings)[];
