ALTER TABLE public.site_events ADD COLUMN IF NOT EXISTS visitor_id text, ADD COLUMN IF NOT EXISTS utm jsonb;
ALTER TABLE public.contact_leads ADD COLUMN IF NOT EXISTS visitor_id text;
ALTER TABLE public.quote_requests ADD COLUMN IF NOT EXISTS visitor_id text;
ALTER TABLE public.reseller_applications ADD COLUMN IF NOT EXISTS visitor_id text;
CREATE INDEX IF NOT EXISTS site_events_visitor_idx ON public.site_events (visitor_id, created_at);
CREATE INDEX IF NOT EXISTS site_events_created_idx ON public.site_events (created_at);
DROP POLICY IF EXISTS "Anyone logs events" ON public.site_events;
CREATE POLICY "Anyone logs events" ON public.site_events FOR INSERT TO anon, authenticated
WITH CHECK (
  event = ANY (ARRAY['page_view','whatsapp_click','product_view','cta_click','download','banner_view','banner_click','form_submit','contact_lead','quote_request','reseller_application','assistant_open'])
  AND (visitor_id IS NULL OR length(visitor_id) <= 64)
  AND (utm IS NULL OR length(utm::text) <= 2000)
);