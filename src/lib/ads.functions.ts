import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

// HPRT Brasil's Ads account is reached through the Cogra manager account.
const LOGIN_CUSTOMER_ID = "9195722560";
const API = "https://connector-gateway.lovable.dev/google_ads/v25";

export const ADS_RANGES = ["TODAY", "YESTERDAY", "LAST_7_DAYS", "LAST_14_DAYS", "LAST_30_DAYS", "THIS_MONTH", "LAST_MONTH"] as const;

async function ads(path: string, body: unknown) {
  const key = process.env["LOVABLE_API_KEY"];
  const conn = process.env["GOOGLE_ADS_API_KEY"];
  const customer = process.env["GOOGLE_ADS_CUSTOMER_ID"];
  if (!key || !conn || !customer) throw new Error("Google Ads não está conectado ao projeto.");
  const res = await fetch(`${API}/customers/${customer}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}`, "X-Connection-Api-Key": conn, "login-customer-id": LOGIN_CUSTOMER_ID },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error(`Google Ads [${res.status}]: ${t}`);
    throw new Error(`Google Ads respondeu ${res.status}: ${t.slice(0, 300)}`);
  }
  return { customer, json: (await res.json()) as any };
}
const q = async (query: string) => ((await ads("googleAds:search", { query })).json.results ?? []) as any[];
const n = (v: unknown) => Number(v ?? 0);

export const getAdsOverview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { range: string }) => z.object({ range: z.enum(ADS_RANGES) }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: staff } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
    if (!staff) throw new Error("Acesso restrito à equipe.");
    const r = data.range;
    const [list, perf, daily, convs, cust] = await Promise.all([
      q(`SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type, campaign.primary_status, campaign_budget.amount_micros FROM campaign WHERE campaign.status != 'REMOVED'`),
      q(`SELECT campaign.id, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.all_conversions FROM campaign WHERE segments.date DURING ${r}`),
      q(`SELECT segments.date, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM customer WHERE segments.date DURING ${r}`),
      q(`SELECT segments.conversion_action_name, metrics.conversions FROM campaign WHERE segments.date DURING ${r}`),
      q(`SELECT customer.currency_code, customer.descriptive_name FROM customer`),
    ]);
    const pm = new Map(perf.map((p) => [p.campaign.id, p.metrics]));
    const campaigns = list.map((c) => {
      const m = pm.get(c.campaign.id) ?? {};
      const cost = n(m.costMicros) / 1e6, clicks = n(m.clicks), impressions = n(m.impressions), conversions = n(m.conversions);
      return {
        id: String(c.campaign.id), name: c.campaign.name as string, status: c.campaign.status as string,
        primaryStatus: (c.campaign.primaryStatus ?? null) as string | null, type: c.campaign.advertisingChannelType as string,
        budget: n(c.campaignBudget?.amountMicros) / 1e6, cost, clicks, impressions, conversions,
        ctr: impressions ? clicks / impressions : 0, cpc: clicks ? cost / clicks : 0, cpa: conversions ? cost / conversions : 0,
      };
    });
    const byAction = new Map<string, number>();
    for (const c of convs) { const k = c.segments?.conversionActionName ?? "—"; byAction.set(k, (byAction.get(k) ?? 0) + n(c.metrics?.conversions)); }
    return {
      account: (cust[0]?.customer?.descriptiveName ?? "") as string,
      currency: (cust[0]?.customer?.currencyCode ?? "BRL") as string,
      campaigns,
      daily: daily.map((d) => ({ date: d.segments.date as string, impressions: n(d.metrics.impressions), clicks: n(d.metrics.clicks), cost: n(d.metrics.costMicros) / 1e6, conversions: n(d.metrics.conversions) }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      conversionsByAction: [...byAction.entries()].filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]),
    };
  });

export const setCampaignStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((i: { id: string; status: string }) => z.object({ id: z.string().regex(/^\d+$/), status: z.enum(["ENABLED", "PAUSED"]) }).parse(i))
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    if (!isAdmin) throw new Error("Somente administradores podem pausar ou ativar campanhas.");
    const customer = process.env["GOOGLE_ADS_CUSTOMER_ID"];
    await ads("campaigns:mutate", { operations: [{ update: { resourceName: `customers/${customer}/campaigns/${data.id}`, status: data.status }, updateMask: "status" }] });
    return { ok: true };
  });
