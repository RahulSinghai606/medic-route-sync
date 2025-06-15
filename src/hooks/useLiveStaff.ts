
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Staff = {
  id: string;
  name: string | null;
  role: string | null;
  department?: string | null;
  status?: string | null;
};

export const useLiveStaff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    // Only showing staff with roles of doctor or nurse
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .in("role", ["doctor", "nurse"]);
    if (error) {
      setError("Error loading staff");
      setStaff([]);
    } else {
      setStaff(
        (data || []).map((s) => ({
          ...s,
          status: "Available",
        }))
      );
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return { staff, loading, error, refetch: fetchStaff };
};
