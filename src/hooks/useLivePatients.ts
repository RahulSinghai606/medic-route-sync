
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Patient = {
  id: string;
  name: string | null;
  age: number | null;
  gender?: string | null;
  // "room" property REMOVED since it's not in the DB.
  created_at: string;
  // Add vital stats fields as needed
};

export const useLivePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      setError("Error loading patients");
      setPatients([]);
    } else {
      setPatients(
        (data || []).map((p) => ({
          ...p,
        }))
      );
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return { patients, loading, error, refetch: fetchPatients };
};
