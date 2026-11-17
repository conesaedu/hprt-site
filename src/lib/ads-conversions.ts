// Google Ads conversion IDs (account HPRT Brasil). Lead = contact/quote/reseller form or WhatsApp click.
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

export function reportAdsConversion(event: string) {
  if (typeof window === "undefined") return;
  const sendTo = conversionFor(event);
  const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
  if (sendTo && gtag) gtag("event", "conversion", { send_to: sendTo });
}
