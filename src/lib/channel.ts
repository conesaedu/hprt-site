// Classifies a visit into a marketing channel from campaign params / referrer.
export type Utm = Record<string, string> | null | undefined;

export function refHost(r: string | null | undefined) {
  if (!r) return null;
  try { return new URL(r).hostname.replace(/^www\./, ""); } catch { return null; }
}

export function channelOf(utm: Utm, referrer: string | null | undefined): string {
  const src = (utm?.utm_source ?? "").toLowerCase();
  const med = (utm?.utm_medium ?? "").toLowerCase();
  if (utm?.gclid || utm?.gbraid || utm?.wbraid || (src.includes("google") && /cpc|paid|ads|pmax/.test(med))) return "Google Ads";
  if (utm?.fbclid || /facebook|instagram|meta|^fb$|^ig$/.test(src)) return /cpc|paid|ads/.test(med) || utm?.fbclid ? "Meta Ads" : "Meta (orgânico)";
  if (utm?.li_fat_id || src.includes("linkedin")) return "LinkedIn";
  if (utm?.ttclid || src.includes("tiktok")) return "TikTok";
  if (utm?.msclkid || src.includes("bing")) return "Microsoft Ads";
  if (src.includes("chatgpt") || src.includes("openai")) return "ChatGPT";
  if (src) return `Campanha: ${src}`;
  const h = refHost(referrer);
  if (!h || h.endsWith("hprtbrasil.com.br") || h.includes("lovable")) return "Direto";
  if (/doubleclick\.net|googlesyndication\.com|googleadservices\.com/.test(h)) return "Google Ads";
  if (/chatgpt\.com|openai\.com|perplexity|gemini\.google|copilot/.test(h)) return "IA (ChatGPT e similares)";
  if (/google\.|bing\.|yahoo\.|duckduckgo/.test(h)) return "Busca orgânica";
  if (/facebook|instagram|linkedin|youtube|tiktok|t\.co|twitter|x\.com/.test(h)) return "Redes sociais";
  return `Site: ${h}`;
}

export const CONVERSION_EVENTS = ["contact_lead", "quote_request", "reseller_application", "whatsapp_click"] as const;
export const isConversion = (e: string) => (CONVERSION_EVENTS as readonly string[]).includes(e);
