import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export interface Insight {
  id: string;
  user_id: string;
  category: string;
  title: string;
  summary: string;
  sources: string[];
  confidence: number;
  document_ids: string[] | null;
  created_at: string;
}

export function useInsights() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["insights", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insights")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Insight[];
    },
    enabled: !!user,
  });
}
