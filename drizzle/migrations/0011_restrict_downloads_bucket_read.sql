DROP POLICY IF EXISTS "Downloads files are public" ON storage.objects;
CREATE POLICY "Editors read downloads" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'downloads' AND public.can_edit_content(auth.uid()));