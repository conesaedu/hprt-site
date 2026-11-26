// Google Ads conversion IDs (account HPRT Brasil). Lead = contact/quote/reseller form or WhatsApp click.
import { readChoice } from "@/lib/consent";

export const ADS_ACCOUNT = "AW-18565923658";
export const ADS_CONVERSIONS = {
  lead_form: "AW-18565923658/lICDCOvluLodEMqG9pRF",
  whatsapp: "AW-18565923658/n5jbCO7luLodEMqG9pRF",
} as const;

const LEAD_FORM_EVENTS = new Set(["contact_lead", "quote_request", "reseller_application"]);

export function conversionFor(event: string): string | null {
  if (event === "whatsapp_click") return ADS_CONVERSIONS.whatsapp;
  if (LEAD_FORM_EVENTS.has(event)) return ADS_CONVERSIONS.lead_form;
  return null;
}

/** Brazilian phone to E.164 (+55...), or undefined when it doesn't look like a phone. */
export function normalizePhoneBR(raw: string | undefined): string | undefined {
  const digits = (raw ?? "").replace(/\D/g, "");
  if (digits.length >= 12 && digits.startsWith("55")) return `+${digits}`;
  if (digits.length === 10 || digits.length === 11) return `+55${digits}`;
  return undefined;
}

/** Enhanced conversions for leads: gtag hashes these (SHA-256) before sending. Only with advertising consent. */
export function setAdsUserData(email?: string, phone?: string) {
  if (typeof window === "undefined" || readChoice("advertising") !== "granted") return;
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  const data: Record<string, string> = {};
  const e = email?.trim().toLowerCase();
  if (e && e.includes("@")) data.email = e;
  const p = normalizePhoneBR(phone);
  if (p) data.phone_number = p;
  if (gtag && Object.keys(data).length) gtag("set", "user_data", data);
}

export function reportAdsConversion(event: string) {
  if (typeof window === "undefined") return;
  const sendTo = conversionFor(event);
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (sendTo && gtag) gtag("event", "conversion", { send_to: sendTo });
}
