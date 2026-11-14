<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Admin CMS pages (banners, blog, settings, analytics) talk to the DB via the browser Supabase client and rely on RLS `has_role(admin)`; user management uses server fns with supabaseAdmin. Why: RLS is the single gate, privileged auth work stays server-side.
- Public analytics/pop-ups/announcement bar live in `SiteRuntime` mounted once in __root; Supabase query builders are lazy, so fire-and-forget inserts must call `.then()`.
