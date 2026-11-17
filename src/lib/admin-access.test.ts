import { describe, expect, it } from "vitest";
import { canOpen } from "./admin-access";

describe("permissões do painel", () => {
  it("admin abre usuários", () => expect(canOpen("admin", "/admin/usuarios")).toBe(true));
  it("editor não abre usuários", () => expect(canOpen("editor", "/admin/usuarios")).toBe(false));
  it("editor não abre leads", () => expect(canOpen("editor", "/admin/leads")).toBe(false));
  it("editor abre editor do blog", () => expect(canOpen("editor", "/admin/blog/abc")).toBe(true));
  it("leitor abre leads", () => expect(canOpen("viewer", "/admin/leads")).toBe(true));
  it("leitor não abre blog", () => expect(canOpen("viewer", "/admin/blog")).toBe(false));
  it("sem papel não abre nada", () => expect(canOpen(null, "/admin")).toBe(false));
});
