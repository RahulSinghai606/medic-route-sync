
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Department } from '@/components/HospitalPlatform/types';

export const useDepartments = (initial: Department[] = []) => {
  const { toast } = useToast();
  const [departmentList, setDepartmentList] = useState<Department[]>(initial);

  const addDepartment = (dept: Omit<Department, "beds" | "total" | "alert"> & { beds?: number; total?: number; alert?: "Critical" | "Medium" | "Low"}) => {
    setDepartmentList(prev => [
      ...prev,
      { ...dept, beds: dept.beds ?? 0, total: dept.total ?? 0, alert: dept.alert ?? "Low" }
    ]);
    toast({ title: "Department Added", description: `Department "${dept.name}" added.` });
  };

  const updateDepartment = (name: string, updates: Partial<Department>) => {
    setDepartmentList(prev =>
      prev.map(dept => dept.name === name ? { ...dept, ...updates } : dept)
    );
    toast({ title: "Department Updated", description: `Department "${name}" updated.` });
  };

  const removeDepartment = (name: string) => {
    setDepartmentList(prev => prev.filter(dept => dept.name !== name));
    toast({ title: "Department Removed", description: `Department "${name}" removed.` });
  };

  // Bed Operations
  const updateBeds = (deptName: string, beds: number) => {
    setDepartmentList(prev =>
      prev.map(dept => dept.name === deptName ? { ...dept, beds } : dept)
    );
  };

  return { departmentList, setDepartmentList, addDepartment, updateDepartment, removeDepartment, updateBeds };
};
