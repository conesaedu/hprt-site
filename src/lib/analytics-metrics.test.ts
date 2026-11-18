import { describe, expect, it } from "vitest";
import { deltaPercent, funnel, kpis, heatmap, flow, type Ev } from "./analytics-metrics";

const ev = (event: string, session_id: string, extra: Partial<Ev> = {}): Ev => ({ event, session_id, path: "/", label: null, visitor_id: null, device: "desktop", referrer: null, utm: null, created_at: "2026-11-17T15:00:00Z", ...extra });

describe("analytics metrics", () => {
  it("delta compares with previous period", () => {
    expect(deltaPercent(150, 100)).toBe(50);
    expect(deltaPercent(5, 0)).toBeNull();
  });
  it("conversion rate is converting sessions over sessions", () => {
    const k = kpis([ev("page_view", "a"), ev("page_view", "b"), ev("whatsapp_click", "a"), ev("quote_request", "a")]);
    expect(k.sessions).toBe(2); expect(k.conversion).toBe(50); expect(k.leads).toBe(1); expect(k.wa).toBe(1);
  });
  it("funnel counts product views and conversions per session", () => {
    const f = funnel([ev("page_view", "a", { path: "/produtos/grand" }), ev("whatsapp_click", "a"), ev("page_view", "b")]);
    expect(f.map((s) => s.n)).toEqual([2, 1, 1, 1]);
  });
  it("heatmap uses São Paulo time", () => {
    expect(heatmap([ev("page_view", "a")])[2][12]).toBe(1); // Tue 15:00 UTC = 12:00 BRT
  });
  it("flow links Google Ads visitors to their outcome", () => {
    const f = flow([ev("page_view", "a", { utm: { gclid: "x" } }), ev("whatsapp_click", "a")], "Google Ads");
    expect(f.nodes.map((n) => n.name)).toEqual(["Google Ads", "Home", "WhatsApp"]);
  });
});
