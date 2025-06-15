
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Department } from '@/components/HospitalPlatform/types';
import { supabase } from '@/integrations/supabase/client';

export const useDepartments = (initial: Department[] = []) => {
  const { toast } = useToast();
  const [departmentList, setDepartmentList] = useState<Department[]>(initial);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch departments from Supabase on mount
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
        setDepartmentList(data || []);
        setError(null);
      }
      setLoading(false);
    };

    fetchDepartments();
    // Optionally: set up real-time updates here in the future!
  }, []);

  // Add a department
  const addDepartment = useCallback(async (dept: Omit<Department, "id" | "created_at" | "updated_at">) => {
    const { data, error: insertError } = await supabase
      .from('departments')
      .insert([dept])
      .select();

    if (insertError) {
      setError('Failed to add department');
      toast({ title: "Add Error", description: `Failed to add department "${dept.name}"` });
    } else if (data && data[0]) {
      setDepartmentList(prev => [...prev, data[0]]);
      setError(null);
      toast({ title: "Department Added", description: `Department "${dept.name}" added.` });
    }
  }, [toast]);

  // Update department
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
        prev.map(dept => dept.name === name ? { ...dept, ...updates } : dept)
      );
      setError(null);
      toast({ title: "Department Updated", description: `Department "${name}" updated.` });
    }
  }, [toast]);

  // Remove department
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

  // Bed Operations
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
        prev.map(dept => dept.name === deptName ? { ...dept, beds } : dept)
      );
    }
  }, [toast]);

  // Optionally: add a reload function
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
      setDepartmentList(data || []);
      setError(null);
    }
    setLoading(false);
  }, []);

  return { departmentList, setDepartmentList, addDepartment, updateDepartment, removeDepartment, updateBeds, loading, error, reload };
};
