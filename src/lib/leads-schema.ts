import { z } from "zod";

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(100),
  company: z.string().trim().min(2, "Informe a empresa").max(150),
  email: z.string().trim().email("E-mail inválido").max(255),
  phone: z.string().trim().min(8, "Informe um telefone válido").max(30),
  role: z.string().trim().max(100).optional().or(z.literal("")),
  segment: z.string().trim().max(60).optional().or(z.literal("")),
  need: z.string().trim().max(60).optional().or(z.literal("")),
  volume: z.string().trim().max(60).optional().or(z.literal("")),
  message: z.string().trim().max(1200).optional().or(z.literal("")),
  visitor_id: z.string().max(64).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
