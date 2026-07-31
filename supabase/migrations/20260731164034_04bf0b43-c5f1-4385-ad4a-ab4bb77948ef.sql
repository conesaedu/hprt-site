DROP POLICY IF EXISTS "Service role can manage trainings" ON public.trainings;
DROP POLICY IF EXISTS "Service role can manage registrations" ON public.training_registrations;

CREATE POLICY "Service role can read trainings" ON public.trainings
  FOR SELECT TO service_role USING (current_user = 'service_role');
CREATE POLICY "Service role can insert trainings" ON public.trainings
  FOR INSERT TO service_role WITH CHECK (current_user = 'service_role');
CREATE POLICY "Service role can update trainings" ON public.trainings
  FOR UPDATE TO service_role USING (current_user = 'service_role') WITH CHECK (current_user = 'service_role');
CREATE POLICY "Service role can delete trainings" ON public.trainings
  FOR DELETE TO service_ROLE USING (current_user = 'service_role');

CREATE POLICY "Service role can read registrations" ON public.training_registrations
  FOR SELECT TO service_role USING (current_user = 'service_role');
CREATE POLICY "Service role can insert registrations" ON public.training_registrations
  FOR INSERT TO service_role WITH CHECK (current_user = 'service_role');
CREATE POLICY "Service role can update registrations" ON public.training_registrations
  FOR UPDATE TO service_role USING (current_user = 'service_role') WITH CHECK (current_user = 'service_role');
CREATE POLICY "Service role can delete registrations" ON public.training_registrations
  FOR DELETE TO service_role USING (current_user = 'service_role');