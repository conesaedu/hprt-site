import { describe, expect, it } from "vitest";
import { channelOf } from "./channel";

describe("channelOf", () => {
  it("gclid conta como Google Ads", () => expect(channelOf({ gclid: "x" }, null)).toBe("Google Ads"));
  it("fbclid conta como Meta Ads", () => expect(channelOf({ fbclid: "x" }, null)).toBe("Meta Ads"));
  it("utm linkedin conta como LinkedIn", () => expect(channelOf({ utm_source: "linkedin" }, null)).toBe("LinkedIn"));
  it("referência do chatgpt.com conta como IA", () => expect(channelOf(null, "https://chatgpt.com/")).toBe("IA (ChatGPT e similares)"));
  it("Google sem parâmetro é busca orgânica", () => expect(channelOf(null, "https://www.google.com/")).toBe("Busca orgânica"));
  it("doubleclick/safeframe contam como Google Ads", () => expect(channelOf(null, "https://abc.safeframe.googlesyndication.com/")).toBe("Google Ads"));
  it("sem origem é direto", () => expect(channelOf(null, null)).toBe("Direto"));
});
