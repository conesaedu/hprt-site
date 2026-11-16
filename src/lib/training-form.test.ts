import { describe, it, expect } from "vitest";
import { normalizeFormFields, validateAnswers } from "./training-form";
describe("training form rules", () => {
  it("required CNPJ blocks empty answer", () => {
    const ff = normalizeFormFields({ cnpj: "required", company: "off" });
    expect(validateAnswers(ff, { answers: {} })).toContain("CNPJ");
    expect(validateAnswers(ff, { answers: { cnpj: "123" } })).toBeNull();
  });
  it("required custom question must be answered", () => {
    const ff = normalizeFormFields({ company: "off", custom: [{ label: "Quais modelos?", required: true }] });
    expect(validateAnswers(ff, { answers: {} })).not.toBeNull();
  });
  it("company off is not required", () => {
    expect(validateAnswers(normalizeFormFields({ company: "off" }), { answers: {} })).toBeNull();
  });
});
