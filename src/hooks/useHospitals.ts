
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type HospitalProfile = Pick<Tables<'profiles'>, 'id' | 'full_name'>;

const fetchHospitals = async (): Promise<HospitalProfile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name')
    .eq('role', 'hospital');

  if (error) {
    console.error('Error fetching hospitals:', error);
    throw new Error(error.message);
  }

  return data || [];
};

export const useHospitals = () => {
  return useQuery<HospitalProfile[], Error>({
    queryKey: ['hospitals'],
    queryFn: fetchHospitals,
  });
};
