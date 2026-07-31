DROP POLICY IF EXISTS "Public can submit registrations" ON public.training_registrations;

CREATE POLICY "Public can submit registrations"
ON public.training_registrations
FOR INSERT
TO anon
WITH CHECK (
  status = 'pending'
  AND length(btrim(name)) BETWEEN 2 AND 100
  AND length(btrim(company)) BETWEEN 2 AND 150
  AND length(email) <= 255
  AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (phone IS NULL OR length(phone) <= 50)
  AND EXISTS (
    SELECT 1 FROM public.trainings t
    WHERE t.id = training_id AND t.is_active = true AND t.spots > 0
  )
);

REVOKE SELECT, UPDATE, DELETE ON public.training_registrations FROM anon;
REVOKE ALL ON public.training_registrations FROM authenticated;
GRANT INSERT ON public.training_registrations TO anon;
GRANT ALL ON public.training_registrations TO service_role;