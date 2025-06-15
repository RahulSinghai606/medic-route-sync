
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Department } from '@/components/HospitalPlatform/types';
import { supabase } from '@/integrations/supabase/client';

// Guarantee only allowed alert types
const ALERT_VALUES = ["Critical", "Medium", "Low"] as const;
type AllowedAlert = (typeof ALERT_VALUES)[number];
function mapToDepartment(raw: any): Department {
  return {
    name: raw.name,
    beds: raw.beds,
    total: raw.total,
    alert: ALERT_VALUES.includes(raw.alert) ? raw.alert as AllowedAlert : "Low",
  };
}

export const useDepartments = (initial: Department[] = []) => {
  const { toast } = useToast();
  const [departmentList, setDepartmentList] = useState<Department[]>(initial);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('departments')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) {
        setError('Failed to load departments');
        setDepartmentList([]);
      } else {
        // Fix: map every row to Department type
        setDepartmentList((data || []).map(mapToDepartment));
        setError(null);
      }
      setLoading(false);
    };

    fetchDepartments();
    // Optionally: set up real-time updates here in the future!
  }, []);

  const addDepartment = useCallback(async (dept: Omit<Department, "id" | "created_at" | "updated_at">) => {
    const { data, error: insertError } = await supabase
      .from('departments')
      .insert([dept])
      .select();

    if (insertError) {
      setError('Failed to add department');
      toast({ title: "Add Error", description: `Failed to add department "${dept.name}"` });
    } else if (data && data[0]) {
      setDepartmentList(prev => [...prev, mapToDepartment(data[0])]);
      setError(null);
      toast({ title: "Department Added", description: `Department "${dept.name}" added.` });
    }
  }, [toast]);

  const updateDepartment = useCallback(async (name: string, updates: Partial<Department>) => {
    const { data, error: updateError } = await supabase
      .from('departments')
      .update(updates)
      .eq('name', name)
      .select();

    if (updateError) {
      setError('Failed to update department');
      toast({ title: "Update Error", description: `Failed to update "${name}"` });
    } else if (data && data[0]) {
      setDepartmentList(prev =>
        prev.map(dept => dept.name === name ? mapToDepartment({ ...dept, ...updates, ...data[0] }) : dept)
      );
      setError(null);
      toast({ title: "Department Updated", description: `Department "${name}" updated.` });
    }
  }, [toast]);

  const removeDepartment = useCallback(async (name: string) => {
    const { error: deleteError } = await supabase
      .from('departments')
      .delete()
      .eq('name', name);

    if (deleteError) {
      setError('Failed to remove department');
      toast({ title: "Remove Error", description: `Failed to remove "${name}"` });
    } else {
      setDepartmentList(prev => prev.filter(dept => dept.name !== name));
      setError(null);
      toast({ title: "Department Removed", description: `Department "${name}" removed.` });
    }
  }, [toast]);

  const updateBeds = useCallback(async (deptName: string, beds: number) => {
    const { data, error: updateError } = await supabase
      .from('departments')
      .update({ beds })
      .eq('name', deptName)
      .select();

    if (updateError) {
      setError('Failed to update beds');
      toast({ title: "Bed Update Error", description: `Failed to update beds for "${deptName}"` });
    } else if (data && data[0]) {
      setDepartmentList(prev =>
        prev.map(dept => dept.name === deptName ? mapToDepartment({ ...dept, beds, ...data[0] }) : dept)
      );
    }
  }, [toast]);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('departments')
      .select('*')
      .order('name', { ascending: true });

    if (fetchError) {
      setError('Failed to load departments');
      setDepartmentList([]);
    } else {
      setDepartmentList((data || []).map(mapToDepartment));
      setError(null);
    }
    setLoading(false);
  }, []);

  return { departmentList, setDepartmentList, addDepartment, updateDepartment, removeDepartment, updateBeds, loading, error, reload };
};
