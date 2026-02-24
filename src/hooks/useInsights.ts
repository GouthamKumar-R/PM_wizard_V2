import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  return useQuery({
    queryKey: ["insights"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insights")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Insight[];
    },
    refetchInterval: 5000, // Poll every 5 seconds to catch new insights
  });
}
