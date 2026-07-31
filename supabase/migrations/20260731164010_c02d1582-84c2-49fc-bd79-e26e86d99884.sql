CREATE TABLE public.trainings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('técnico', 'comercial')),
  audience text NOT NULL,
  date timestamptz NOT NULL,
  format text NOT NULL CHECK (format IN ('presencial', 'online', 'híbrido')),
  location text NOT NULL,
  seats integer NOT NULL CHECK (seats > 0),
  spots integer NOT NULL CHECK (spots >= 0),
  description text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.trainings TO anon;
GRANT ALL ON public.trainings TO service_role;

ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active trainings" ON public.trainings
  FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Service role can manage trainings" ON public.trainings
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.training_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id uuid NOT NULL REFERENCES public.trainings(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  phone text,
  is_client boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.training_registrations TO anon;
GRANT ALL ON public.training_registrations TO service_role;

ALTER TABLE public.training_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can submit registrations" ON public.training_registrations
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Service role can manage registrations" ON public.training_registrations
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_trainings_updated_at
  BEFORE UPDATE ON public.trainings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_registrations_updated_at
  BEFORE UPDATE ON public.training_registrations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();