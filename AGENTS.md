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
- Public site assistant calls Lovable AI via a server fn (`src/lib/assistant.functions.ts`) with the product summary as context. Why: keeps the API key server-side and answers grounded in the real catalog.
- Lead-like inboxes (reseller applications, quote requests) share `InboxPage`; admin-table changes are audited by the `log_admin_change` trigger into `audit_log`. Why: one pattern for status/notes/WhatsApp, and a change history without app code.
