import { createServerFn } from "@tanstack/react-start";
import { leadSchema } from "./leads-schema";
import { insertLead } from "./leads.server";

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((input) => leadSchema.parse(input))
  .handler(async ({ data }) => insertLead(data));
