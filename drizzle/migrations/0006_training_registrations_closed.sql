ALTER TABLE public.trainings ADD COLUMN IF NOT EXISTS registrations_closed boolean NOT NULL DEFAULT false;
DROP POLICY IF EXISTS "Public can submit registrations" ON public.training_registrations;
CREATE POLICY "Public can submit registrations" ON public.training_registrations FOR INSERT TO anon
WITH CHECK ((status = 'pending') AND (length(btrim(name)) BETWEEN 2 AND 100) AND (length(company) <= 150) AND (length(email) <= 255) AND (email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$') AND ((phone IS NULL) OR (length(phone) <= 50)) AND (length(answers::text) <= 5000)
 AND EXISTS (SELECT 1 FROM public.trainings t WHERE t.id = training_registrations.training_id AND t.is_active = true AND t.spots > 0 AND t.registrations_closed = false));