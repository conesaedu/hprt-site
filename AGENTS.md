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
- Password recovery stays in the auth page using the browser auth client and PASSWORD_RECOVERY events; email links return to the official site's auth page so passwords are set only through a verified recovery session.
- Admin panel roles are admin/editor/viewer; section access lives in `src/lib/admin-access.ts` (menu + page gate) and DB writes are gated by `can_edit_content()` / `is_staff()` RLS helpers. Why: one map for UI, RLS stays the real gate.

- Cookie consent: `src/lib/consent.ts` (skill module, BR added to consent regions for LGPD) is the only reader/writer of consent; first-party visitor id and persistent session id are stored only after analytics consent. Why: one gate for Google Consent Mode and own tracking.
