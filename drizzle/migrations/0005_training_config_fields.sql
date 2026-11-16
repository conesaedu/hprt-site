ALTER TABLE public.trainings ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.trainings ADD COLUMN IF NOT EXISTS form_fields jsonb NOT NULL DEFAULT '{"company":"required","phone":"optional","cnpj":"off","role":"off","city":"off","is_client":true,"custom":[]}'::jsonb;
ALTER TABLE public.training_registrations ADD COLUMN IF NOT EXISTS answers jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.training_registrations ALTER COLUMN company SET DEFAULT '';
DROP POLICY IF EXISTS "Public can submit registrations" ON public.training_registrations;
CREATE POLICY "Public can submit registrations" ON public.training_registrations FOR INSERT TO anon
WITH CHECK (
  status = 'pending'
  AND length(btrim(name)) BETWEEN 2 AND 100
  AND length(company) <= 150
  AND length(email) <= 255
  AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (phone IS NULL OR length(phone) <= 50)
  AND length(answers::text) <= 5000
  AND EXISTS (SELECT 1 FROM public.trainings t WHERE t.id = training_id AND t.is_active = true AND t.spots > 0)
);