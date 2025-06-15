
-- Delete in the correct order to respect foreign key constraints
-- Delete vitals first (references patients)
DELETE FROM public.vitals;

-- Delete medical_history (references patients)
DELETE FROM public.medical_history;

-- Delete incidents (references patients)
DELETE FROM public.incidents;

-- Now delete patients
DELETE FROM public.patients;

-- Finally delete profiles
DELETE FROM public.profiles;
