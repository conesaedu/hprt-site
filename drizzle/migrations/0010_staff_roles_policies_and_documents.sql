CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','editor','viewer'))
$$;
CREATE OR REPLACE FUNCTION public.can_edit_content(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','editor'))
$$;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_edit_content(uuid) TO authenticated;

-- Conteúdo: editor gerencia, leitor lê
CREATE POLICY "Editors manage banners" ON public.banners FOR ALL TO authenticated USING (public.can_edit_content(auth.uid())) WITH CHECK (public.can_edit_content(auth.uid()));
CREATE POLICY "Staff read banners" ON public.banners FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Editors manage posts" ON public.blog_posts FOR ALL TO authenticated USING (public.can_edit_content(auth.uid())) WITH CHECK (public.can_edit_content(auth.uid()));
CREATE POLICY "Staff read posts" ON public.blog_posts FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Editors manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.can_edit_content(auth.uid())) WITH CHECK (public.can_edit_content(auth.uid()));
CREATE POLICY "Staff read testimonials" ON public.testimonials FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Editors manage trainings" ON public.trainings FOR ALL TO authenticated USING (public.can_edit_content(auth.uid())) WITH CHECK (public.can_edit_content(auth.uid()));
CREATE POLICY "Staff read trainings" ON public.trainings FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Editors manage registrations" ON public.training_registrations FOR ALL TO authenticated USING (public.can_edit_content(auth.uid())) WITH CHECK (public.can_edit_content(auth.uid()));
CREATE POLICY "Staff read registrations" ON public.training_registrations FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
-- Analytics e caixas de entrada: toda a equipe lê
CREATE POLICY "Staff read events" ON public.site_events FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff read leads" ON public.contact_leads FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff read quotes" ON public.quote_requests FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff read resellers" ON public.reseller_applications FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff read own-scope roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
-- Mídia
CREATE POLICY "Editors read media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'media' AND public.can_edit_content(auth.uid()));
CREATE POLICY "Editors upload media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.can_edit_content(auth.uid()));
CREATE POLICY "Editors delete media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.can_edit_content(auth.uid()));

-- Central de downloads
CREATE TABLE public.downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Etiquetas e pulseiras',
  kind text NOT NULL DEFAULT 'Driver',
  os text NOT NULL DEFAULT 'Windows',
  models text[] NOT NULL DEFAULT '{}',
  file_url text NOT NULL DEFAULT '',
  format text NOT NULL DEFAULT '',
  version text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.downloads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.downloads TO authenticated;
GRANT ALL ON public.downloads TO service_role;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active downloads" ON public.downloads FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Staff read downloads" ON public.downloads FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Editors manage downloads" ON public.downloads FOR ALL TO authenticated USING (public.can_edit_content(auth.uid())) WITH CHECK (public.can_edit_content(auth.uid()));
CREATE TRIGGER downloads_updated_at BEFORE UPDATE ON public.downloads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER downloads_audit AFTER INSERT OR UPDATE OR DELETE ON public.downloads FOR EACH ROW EXECUTE FUNCTION public.log_admin_change();

CREATE POLICY "Downloads files are public" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'downloads');
CREATE POLICY "Editors upload downloads" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'downloads' AND public.can_edit_content(auth.uid()));
CREATE POLICY "Editors delete downloads" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'downloads' AND public.can_edit_content(auth.uid()));