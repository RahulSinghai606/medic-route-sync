
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Patient = {
  id: string;
  name: string | null;
  age: number | null;
  gender?: string | null;
  room?: string | null;
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
          room: p.room ?? "—",
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
