import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createSupabasePublic } from "./supabase-public.server";

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(async () => {
  const sb = createSupabasePublic();
  const { data, error } = await sb.from("blog_posts")
    .select("id, slug, title, excerpt, cover_url, category, published_at")
    .order("published_at", { ascending: false }).limit(100);
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getPublishedPost = createServerFn({ method: "GET" })
  .inputValidator((i: unknown) => z.object({ slug: z.string().min(1).max(200) }).parse(i))
  .handler(async ({ data }) => {
    const sb = createSupabasePublic();
    const { data: post, error } = await sb.from("blog_posts").select("*").eq("slug", data.slug).maybeSingle();
    if (error) throw new Error(error.message);
    return post;
  });
