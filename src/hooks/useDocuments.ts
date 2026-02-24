import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "./use-toast";

export interface Document {
  id: string;
  user_id: string;
  name: string;
  source_type: string;
  file_url: string | null;
  content: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useDocuments() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["documents", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Document[];
    },
    enabled: !!user,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({
      file,
      sourceType,
    }: {
      file: File;
      sourceType: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      // Read text content for supported types
      let content: string | null = null;
      const textTypes = [".txt", ".md", ".csv", ".json", ".xml"];
      if (textTypes.some((ext) => file.name.toLowerCase().endsWith(ext))) {
        content = await file.text();
      }

      // Upload file to storage
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      // Insert document record
      const { data: doc, error: insertError } = await supabase
        .from("documents")
        .insert({
          user_id: user.id,
          name: file.name,
          source_type: sourceType,
          file_url: filePath,
          content: content || `[Binary file: ${file.name}]`,
          status: "processing",
        })
        .select()
        .single();
      if (insertError) throw insertError;

      // Trigger insight generation
      const { error: fnError } = await supabase.functions.invoke(
        "generate-insights",
        { body: { document_id: doc.id } }
      );
      if (fnError) {
        console.error("Insight generation error:", fnError);
        toast({ title: "Warning", description: "Document uploaded but insight generation failed. You can retry later." });
      }

      return doc;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
      toast({ title: "Document uploaded", description: "AI is processing your document for insights." });
    },
    onError: (err: Error) => {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    },
  });
}
