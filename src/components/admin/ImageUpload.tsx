import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function upload(f: File) {
    setBusy(true); setErr("");
    const path = `${Date.now()}-${f.name.replace(/[^a-z0-9.]+/gi, "-").toLowerCase()}`;
    const { error } = await supabase.storage.from("media").upload(path, f, { contentType: f.type });
    if (error) { setErr(error.message); setBusy(false); return; }
    const { data } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    if (data) onChange(data.signedUrl);
    setBusy(false);
  }
  return (
    <div className="space-y-2">
      {value && <img src={value} alt="" className="h-32 w-auto border border-border object-cover" />}
      <div className="flex items-center gap-3">
        <label className="cursor-pointer border border-input bg-background px-3 py-2 text-sm hover:bg-muted">
          {busy ? "Enviando…" : value ? "Trocar imagem" : "Enviar imagem"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
        </label>
        {value && <button type="button" onClick={() => onChange("")} className="text-sm text-muted-foreground underline">Remover</button>}
      </div>
      {err && <p className="text-sm text-destructive">{err}</p>}
    </div>
  );
}

export const field = "w-full border border-input bg-background px-3 py-2 text-sm";
export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}
