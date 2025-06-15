
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { Tables } from '@/integrations/supabase/types';

// Define the type for a case with related data from joined tables
export type CaseWithRelations = Omit<Tables<'cases'>, 'patient_id' | 'paramedic_id'> & {
  patients: { name: string | null } | null;
  paramedic: { full_name: string | null } | null;
};

const fetchCases = async (status: Tables<'cases'>['status']) => {
  const { data, error } = await supabase
    .from('cases')
    .select(`
      *,
      patients ( name ),
      paramedic:paramedic_id ( full_name )
    `)
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching ${status} cases:`, error);
    throw new Error(error.message);
  }

  // Supabase v2 returns single-item relations as an object, not array. This mapping is for safety.
  return (data || []).map(c => ({
    ...c,
    patients: Array.isArray(c.patients) ? c.patients[0] : c.patients,
    paramedic: Array.isArray(c.paramedic) ? c.paramedic[0] : c.paramedic,
  })) as CaseWithRelations[];
};

export const useCases = (status: Tables<'cases'>['status'] = 'pending_approval') => {
  const queryClient = useQueryClient();
  const queryKey = ['cases', status];

  useEffect(() => {
    const channel = supabase
      .channel('realtime-cases')
      .on<Tables<'cases'>>(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cases' },
        (payload: RealtimePostgresChangesPayload<Tables<'cases'>>) => {
          console.log('Realtime case change received!', payload);
          // Invalidate all case queries to refresh all tabs
          queryClient.invalidateQueries({ queryKey: ['cases'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery<CaseWithRelations[], Error>({
    queryKey,
    queryFn: () => fetchCases(status),
  });
};

export const updateCaseStatus = async (caseId: string, status: 'accepted' | 'declined') => {
  const { data, error } = await supabase
    .from('cases')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', caseId)
    .select();

  if (error) {
    console.error('Error updating case status:', error);
    throw new Error(error.message);
  }

  return data;
};
