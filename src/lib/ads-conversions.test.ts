import { describe, it, expect } from "vitest";
import { conversionFor, ADS_CONVERSIONS } from "./ads-conversions";
describe("conversões de lead", () => {
  it("clique no WhatsApp conta como lead WhatsApp", () => expect(conversionFor("whatsapp_click")).toBe(ADS_CONVERSIONS.whatsapp));
  it("formulário de contato conta como lead", () => expect(conversionFor("contact_lead")).toBe(ADS_CONVERSIONS.lead_form));
  it("cotação conta como lead", () => expect(conversionFor("quote_request")).toBe(ADS_CONVERSIONS.lead_form));
  it("candidatura de revenda conta como lead", () => expect(conversionFor("reseller_application")).toBe(ADS_CONVERSIONS.lead_form));
  it("visita de página não conta como lead", () => expect(conversionFor("page_view")).toBeNull());
});

import { normalizePhoneBR } from "./ads-conversions";
describe("normalizePhoneBR", () => {
  it("adds +55 to DDD + number", () => expect(normalizePhoneBR("(11) 93429-4095")).toBe("+5511934294095"));
  it("keeps numbers already with 55", () => expect(normalizePhoneBR("+55 11 93429-4095")).toBe("+5511934294095"));
  it("rejects too-short input", () => expect(normalizePhoneBR("1234")).toBeUndefined());
});
