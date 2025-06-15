
-- Create custom types for case status and severity to ensure data consistency.
CREATE TYPE public.case_status AS ENUM ('pending_approval', 'accepted', 'declined', 'en_route', 'arrived', 'handoff_complete');
CREATE TYPE public.case_severity AS ENUM ('Critical', 'Urgent', 'Stable');

-- Create the central 'cases' table to track all emergency incidents.
CREATE TABLE public.cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  paramedic_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  hospital_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status public.case_status NOT NULL DEFAULT 'pending_approval',
  severity public.case_severity NOT NULL,
  eta_minutes INT,
  paramedic_notes TEXT,
  vitals JSONB, -- Storing vitals snapshot for quick access
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.cases IS 'Stores emergency case information linking paramedics, patients, and hospitals.';
COMMENT ON COLUMN public.cases.vitals IS 'A JSONB snapshot of the key vitals at the time of case creation.';

-- Enable Row-Level Security to protect patient data.
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- POLICIES
-- Paramedics can view and update cases they created.
CREATE POLICY "Paramedics can manage their own cases"
  ON public.cases FOR ALL
  USING (auth.uid() = paramedic_id)
  WITH CHECK (auth.uid() = paramedic_id);

-- Hospitals can view and update cases assigned to them.
CREATE POLICY "Hospitals can manage their assigned cases"
  ON public.cases FOR ALL
  USING (auth.uid() = hospital_id)
  WITH CHECK (auth.uid() = hospital_id);

-- Configure the table for real-time updates.
ALTER TABLE public.cases REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cases;

