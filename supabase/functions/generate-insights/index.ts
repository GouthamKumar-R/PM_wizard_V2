import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const llmApiKey = Deno.env.get("GROQ_API_KEY");
    if (!llmApiKey) throw new Error("GROQ_API_KEY is not configured");

    const DEV_USER_ID = "00000000-0000-0000-0000-000000000001";

    const { document_id } = await req.json();
    if (!document_id) throw new Error("document_id is required");

    // Use service role to read/write
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: doc, error: docError } = await adminClient
      .from("documents")
      .select("*")
      .eq("id", document_id)
      .single();

    if (docError || !doc) throw new Error("Document not found");

    const content = doc.content || `[Document: ${doc.name}]`;

    // Map source_type to insight category
    const categoryMap: Record<string, string> = {
      customer_feedback: "feedback",
      field_reports: "feedback",
      analyst_transcripts: "suggestion",
      market_reports: "market",
      partner_insights: "partner",
    };

    const systemPrompt = `You are a product management AI assistant called PM Wizard. You analyze documents uploaded by product managers and extract actionable insights.

Given a document, generate 1-3 structured insights. Each insight must have:
- category: one of "feedback", "suggestion", "market", "partner"
- title: concise insight title (max 10 words)
- summary: 1-2 sentence actionable summary
- confidence: integer 60-99 representing how confident you are

The document source type is "${doc.source_type}" so prefer category "${categoryMap[doc.source_type] || "feedback"}".

Respond using the extract_insights tool.`;

    const prompt = `${systemPrompt}\n\nAnalyze this document and extract insights:\n\n${content.slice(0, 8000)}\n\nRespond ONLY with a valid JSON object in this exact format:\n{"insights": [{"category": "feedback", "title": "...", "summary": "...", "confidence": 85}]}`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${llmApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Analyze this document and extract insights:\n\n${content.slice(0, 8000)}\n\nRespond ONLY with a valid JSON object in this exact format:\n{"insights": [{"category": "feedback", "title": "...", "summary": "...", "confidence": 85}]}` },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", response.status, errText);
      throw new Error(`Groq API error: ${response.status} - ${errText}`);
    }

    const aiResult = await response.json();
    const rawText = aiResult.choices?.[0]?.message?.content;
    if (!rawText) throw new Error("No response from Groq");

    const parsed = JSON.parse(rawText);
    const generatedInsights = parsed.insights || [];

    // Insert insights
    const insightRows = generatedInsights.map((insight: any) => ({
      user_id: DEV_USER_ID,
      category: insight.category,
      title: insight.title,
      summary: insight.summary,
      confidence: Math.min(99, Math.max(60, insight.confidence)),
      sources: [doc.name],
      document_ids: [document_id],
    }));

    if (insightRows.length > 0) {
      const { error: insertError } = await adminClient.from("insights").insert(insightRows);
      if (insertError) {
        console.error("Insert error:", insertError);
        throw new Error("Failed to save insights");
      }
    }

    // Mark document as processed
    await adminClient.from("documents").update({ status: "processed" }).eq("id", document_id);

    return new Response(
      JSON.stringify({ success: true, insights_count: insightRows.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-insights error:", e);

    // Try to mark the document as errored so it doesn't stay stuck in "processing"
    try {
      const { document_id } = await (async () => {
        try { return await req.clone().json(); } catch { return {}; }
      })();
      if (document_id) {
        const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const adminClient = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey);
        await adminClient.from("documents").update({ status: "error" }).eq("id", document_id);
      }
    } catch (_) { /* best effort */ }

    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
