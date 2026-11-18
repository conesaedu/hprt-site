import { describe, expect, it } from "vitest";
import { buildJourneys, type JEvent } from "./journeys";

const ev = (o: Partial<JEvent>): JEvent => ({ event: "page_view", path: "/", label: null, session_id: "s1", visitor_id: "v1", referrer: null, device: "desktop", utm: null, created_at: "2026-11-01T10:00:00Z", ...o });

describe("buildJourneys", () => {
  it("veio do Google Ads, não converteu, voltou depois e converteu", () => {
    const [j] = buildJourneys([
      ev({ utm: { gclid: "abc", utm_campaign: "pmax" } }),
      ev({ session_id: "s2", created_at: "2026-11-04T10:00:00Z" }),
      ev({ session_id: "s2", event: "whatsapp_click", created_at: "2026-11-04T10:05:00Z" }),
    ]);
    expect(j.channel).toBe("Google Ads");
    expect(j.campaign).toBe("pmax");
    expect(j.sessions).toBe(2);
    expect(j.returnedConverted).toBe(true);
  });
  it("converteu na primeira visita não conta como retorno", () => {
    const [j] = buildJourneys([ev({}), ev({ event: "contact_lead", created_at: "2026-11-01T10:02:00Z" })]);
    expect(j.converted).toBe(true);
    expect(j.returnedConverted).toBe(false);
  });
});
