// Anonymous first-party visitor id + campaign parameters for the journey analytics.
// No personal data: only a random id, the URL campaign params and the referrer.

const VID_KEY = "hprt_vid";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "fbclid", "ttclid", "li_fat_id", "msclkid"] as const;

export function getVisitorId(): string | null {
  try {
    let v = localStorage.getItem(VID_KEY);
    if (!v) { v = crypto.randomUUID(); localStorage.setItem(VID_KEY, v); }
    return v;
  } catch { return null; }
}

/** Campaign params present in the current URL (null when none). */
export function getUtm(): Record<string, string> | null {
  try {
    const p = new URLSearchParams(window.location.search);
    const out: Record<string, string> = {};
    for (const k of PARAMS) { const v = p.get(k); if (v) out[k] = v.slice(0, 150); }
    return Object.keys(out).length ? out : null;
  } catch { return null; }
}
