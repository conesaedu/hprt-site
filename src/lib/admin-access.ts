import type { StaffRole } from "@/lib/admin.functions";

/** Which admin sections each role can open. Admin sees everything. */
export const ROLE_SECTIONS: Record<StaffRole, string[] | "all"> = {
  admin: "all",
  editor: ["/admin", "/admin/treinamentos", "/admin/analytics", "/admin/campanhas", "/admin/jornadas", "/admin/banners", "/admin/blog", "/admin/depoimentos", "/admin/midia", "/admin/downloads", "/admin/seguranca"],
  viewer: ["/admin", "/admin/leads", "/admin/cotacoes", "/admin/revendas", "/admin/treinamentos", "/admin/analytics", "/admin/campanhas", "/admin/jornadas", "/admin/seguranca"],
};

export function canOpen(role: StaffRole | null | undefined, path: string) {
  if (!role) return false;
  const allowed = ROLE_SECTIONS[role];
  if (allowed === "all") return true;
  return allowed.some((p) => (p === "/admin" ? path === "/admin" || path === "/admin/" : path === p || path.startsWith(p + "/")));
}

export const ROLE_LABEL: Record<StaffRole, string> = { admin: "Administrador", editor: "Editor", viewer: "Leitor" };
export const ROLE_HINT: Record<StaffRole, string> = {
  admin: "Acesso total: usuários, integrações, leads e todo o conteúdo.",
  editor: "Cuida do conteúdo: blog, pop-ups, depoimentos, treinamentos, mídia e downloads.",
  viewer: "Só visualiza: leads, cotações, revendas, treinamentos e analytics.",
};
