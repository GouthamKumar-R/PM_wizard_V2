import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "./use-toast";

// Fixed user ID for local dev (no auth)
const DEV_USER_ID = "00000000-0000-0000-0000-000000000001";

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
  return useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Document[];
    },
    refetchInterval: (query) => {
      // Poll every 3 seconds if any document is still processing
      const docs = query.state.data as Document[] | undefined;
      return docs?.some((d) => d.status === "processing") ? 3000 : false;
    },
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      sourceType,
    }: {
      file: File;
      sourceType: string;
    }) => {
      // Read text content for supported types
      let content: string | null = null;
      const textTypes = [".txt", ".md", ".csv", ".json", ".xml"];
      if (textTypes.some((ext) => file.name.toLowerCase().endsWith(ext))) {
        content = await file.text();
      } else {
        // For binary files, store filename and type as context for AI
        content = `Document name: ${file.name}\nFile type: ${file.type || "unknown"}\nSource type: ${sourceType}\n\nThis is a binary document. Please generate plausible product management insights based on the document name and source type alone.`;
      }

      // Upload file to storage
      const filePath = `${DEV_USER_ID}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      // Insert document record
      const { data: doc, error: insertError } = await supabase
        .from("documents")
        .insert({
          user_id: DEV_USER_ID,
          name: file.name,
          source_type: sourceType,
          file_url: filePath,
          content: content,
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
