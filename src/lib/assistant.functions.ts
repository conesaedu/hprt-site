import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { productSummaries } from "@/lib/products/summary";

const input = z.object({ messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(2000) })).min(1).max(20) });

const SYSTEM = `Você é o assistente técnico-comercial da HPRT Brasil (distribuição oficial pela Cogra). Responda em português do Brasil, de forma objetiva, B2B e respeitosa, em até 120 palavras.
Ajude a escolher o equipamento certo pela aplicação (volume, ambiente, largura de etiqueta, mobilidade). Recomende só modelos da lista abaixo e sempre inclua o link /produtos/<slug>.
Não invente preços, prazos ou especificações que não estejam na lista; para preço, estoque ou proposta, direcione para /onde-comprar ou WhatsApp (11) 99542-2785. Revendas: /seja-revenda. Drivers: /downloads. Treinamentos: /treinamentos.
Catálogo:
${productSummaries.map((p) => `- ${p.name} (/produtos/${p.slug}) · ${p.categoryLabel} · ${p.tagline} · ${p.spec}`).join("\n")}`;

/** Public product assistant backed by Lovable AI. */
export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => input.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { reply: "O assistente está indisponível agora. Fale com um especialista em /onde-comprar." };
    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { "Lovable-API-Key": key, Authorization: `Bearer ${key}`, "X-Lovable-AIG-SDK": "fetch", "Content-Type": "application/json" },
      body: JSON.stringify({ model: "openai/gpt-6-astra", instructions: SYSTEM, input: data.messages, reasoning: { effort: "low" }, store: false, stream: true }),
    });
    if (res.status === 429) return { reply: "Muitas perguntas em sequência. Tente de novo em alguns segundos." };
    if (!res.ok || !res.body) return { reply: "Não consegui responder agora. Fale com um especialista em /onde-comprar." };
    // Consume the SSE stream and accumulate the answer text.
    const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = ""; let out = "";
    for (;;) {
      const { done, value } = await reader.read(); if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n"); buf = lines.pop() ?? "";
      for (const l of lines) {
        if (!l.startsWith("data:")) continue;
        try { const ev = JSON.parse(l.slice(5).trim()); if (ev.type === "response.output_text.delta") out += ev.delta; } catch { /* ignore non-JSON lines */ }
      }
    }
    return { reply: out.trim() || "Pode reformular a pergunta?" };
  });
    if (res.status === 429) return { reply: "Muitas perguntas em sequência. Tente de novo em alguns segundos." };
    if (!res.ok) return { reply: "Não consegui responder agora. Fale com um especialista em /onde-comprar." };
    const j = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    return { reply: j.choices?.[0]?.message?.content?.trim() || "Pode reformular a pergunta?" };
  });
