
-- Create a departments table for hospital departments.
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  beds INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  alert TEXT NOT NULL DEFAULT 'Low',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Audit triggers for created_at & updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_departments_updated_at ON public.departments;
CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON public.departments
  FOR EACH ROW
  EXECUTE PROCEDURE public.set_updated_at();

-- Enable Row Level Security
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

-- Allow all hospital users to read
CREATE POLICY "Everyone can view departments" ON public.departments
  FOR SELECT
  USING (true);

-- Allow insert only for users with role = 'hospital' in the profiles table
CREATE POLICY "Hospitals can insert departments" ON public.departments
  FOR INSERT TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'hospital'
    )
  );

-- Allow hospital users to update
CREATE POLICY "Hospitals can update departments" ON public.departments
  FOR UPDATE TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'hospital'
    )
  );

-- Allow hospital users to delete
CREATE POLICY "Hospitals can delete departments" ON public.departments
  FOR DELETE TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'hospital'
    )
  );
