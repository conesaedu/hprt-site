DROP POLICY IF EXISTS "Anyone can submit a contact request" ON public.contact_leads;
CREATE POLICY "Anyone can submit a contact request" ON public.contact_leads
FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'new'
  AND notes IS NULL
  AND length(btrim(name)) BETWEEN 2 AND 200
  AND length(btrim(company)) BETWEEN 1 AND 200
  AND length(email) <= 255 AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(phone) BETWEEN 6 AND 50
  AND (message IS NULL OR length(message) <= 5000)
  AND (role IS NULL OR length(role) <= 200)
  AND (segment IS NULL OR length(segment) <= 200)
  AND (need IS NULL OR length(need) <= 500)
  AND (volume IS NULL OR length(volume) <= 200)
  AND length(source) <= 100
);