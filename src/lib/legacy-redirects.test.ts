import { describe, it, expect } from "vitest";
import { legacyCategory, legacyProductSlug } from "./legacy-redirects";

describe("redirecionamentos do site antigo", () => {
  it("categoria de coletores vai para coletores", () => expect(legacyCategory("coletores-de-dados")).toBe("coletores"));
  it("produto m3-h vai para m3h", () => expect(legacyProductSlug("m3-h")).toBe("m3h"));
  it("produto com nome longo acha o modelo", () => expect(legacyProductSlug("impressora-grand-industrial")).toBe("grand"));
  it("produto desconhecido não acha modelo", () => expect(legacyProductSlug("xyz-qualquer")).toBeNull());
});
