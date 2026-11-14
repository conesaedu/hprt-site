CREATE TABLE public.banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image_url text,
  cta_label text,
  cta_url text,
  pages text[] NOT NULL DEFAULT ARRAY['/']::text[],
  frequency text NOT NULL DEFAULT 'once_per_session' CHECK (frequency IN ('once_per_session','every_7_days','always')),
  is_active boolean NOT NULL DEFAULT true,
  start_at timestamptz,
  end_at timestamptz,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.banners TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.banners TO authenticated;
GRANT ALL ON public.banners TO service_role;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads live banners" ON public.banners FOR SELECT TO anon, authenticated
  USING (is_active AND (start_at IS NULL OR start_at <= now()) AND (end_at IS NULL OR end_at >= now()));
CREATE POLICY "Admins manage banners" ON public.banners FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL DEFAULT '',
  cover_url text,
  category text,
  seo_title text,
  seo_description text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published posts" ON public.blog_posts FOR SELECT TO anon, authenticated
  USING (status = 'published' AND published_at IS NOT NULL AND published_at <= now());
CREATE POLICY "Admins manage posts" ON public.blog_posts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.site_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event text NOT NULL CHECK (char_length(event) <= 40),
  path text CHECK (char_length(path) <= 300),
  label text CHECK (char_length(label) <= 200),
  session_id text CHECK (char_length(session_id) <= 64),
  referrer text CHECK (char_length(referrer) <= 300),
  device text CHECK (char_length(device) <= 20),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX site_events_created_idx ON public.site_events (created_at DESC);
GRANT INSERT ON public.site_events TO anon, authenticated;
GRANT SELECT ON public.site_events TO authenticated;
GRANT ALL ON public.site_events TO service_role;
ALTER TABLE public.site_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone logs events" ON public.site_events FOR INSERT TO anon, authenticated
  WITH CHECK (event IN ('page_view','whatsapp_click','product_view','cta_click','download','banner_view','banner_click','form_submit'));
CREATE POLICY "Admins read events" ON public.site_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
GRANT INSERT, DELETE ON public.user_roles TO authenticated;

CREATE POLICY "Public reads media" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'media');
CREATE POLICY "Admins upload media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));