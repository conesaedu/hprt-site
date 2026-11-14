GRANT SELECT, INSERT, UPDATE, DELETE ON public.trainings TO authenticated;
GRANT SELECT, UPDATE, DELETE ON public.training_registrations TO authenticated;
CREATE POLICY "Admins manage trainings" ON public.trainings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Authenticated view active trainings" ON public.trainings FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admins manage registrations" ON public.training_registrations FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.reseller_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL, cnpj text, contact_name text NOT NULL, email text NOT NULL, phone text NOT NULL,
  city text, state text, segment text, monthly_volume text, message text,
  status text NOT NULL DEFAULT 'novo', notes text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.reseller_applications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reseller_applications TO authenticated;
GRANT ALL ON public.reseller_applications TO service_role;
ALTER TABLE public.reseller_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone applies" ON public.reseller_applications FOR INSERT TO anon, authenticated WITH CHECK (status = 'novo' AND length(company) < 200 AND length(email) < 200);
CREATE POLICY "Admins manage resellers" ON public.reseller_applications FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.quote_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_slug text, product_name text, quantity integer, name text NOT NULL, company text NOT NULL,
  email text NOT NULL, phone text NOT NULL, message text,
  status text NOT NULL DEFAULT 'novo', notes text,
  created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.quote_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quote_requests TO authenticated;
GRANT ALL ON public.quote_requests TO service_role;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone requests quote" ON public.quote_requests FOR INSERT TO anon, authenticated WITH CHECK (status = 'novo' AND length(name) < 200 AND length(email) < 200);
CREATE POLICY "Admins manage quotes" ON public.quote_requests FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL, role text, company text NOT NULL, quote text NOT NULL, logo_url text,
  is_active boolean NOT NULL DEFAULT true, sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid, table_name text NOT NULL, action text NOT NULL, record_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_log TO authenticated;
GRANT ALL ON public.audit_log TO service_role;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit" ON public.audit_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.log_admin_change() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.audit_log(user_id, table_name, action, record_id)
  VALUES (auth.uid(), TG_TABLE_NAME, TG_OP, COALESCE((CASE WHEN TG_OP='DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END)->>'id',''));
  RETURN NULL;
END $$;
REVOKE EXECUTE ON FUNCTION public.log_admin_change() FROM anon, authenticated;

CREATE TRIGGER audit_banners AFTER INSERT OR UPDATE OR DELETE ON public.banners FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();
CREATE TRIGGER audit_blog AFTER INSERT OR UPDATE OR DELETE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();
CREATE TRIGGER audit_settings AFTER INSERT OR UPDATE OR DELETE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();
CREATE TRIGGER audit_roles AFTER INSERT OR UPDATE OR DELETE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();
CREATE TRIGGER audit_testimonials AFTER INSERT OR UPDATE OR DELETE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();
CREATE TRIGGER audit_trainings AFTER INSERT OR UPDATE OR DELETE ON public.trainings FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();