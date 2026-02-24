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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!lovableApiKey) throw new Error("LOVABLE_API_KEY is not configured");

    // Verify user
    const userClient = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await userClient.auth.getUser();
    if (userError || !user) throw new Error("Unauthorized");

    const { document_id } = await req.json();
    if (!document_id) throw new Error("document_id is required");

    // Use service role to read document
    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: doc, error: docError } = await adminClient
      .from("documents")
      .select("*")
      .eq("id", document_id)
      .eq("user_id", user.id)
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

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Analyze this document and extract insights:\n\n${content.slice(0, 8000)}` },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "extract_insights",
                description: "Extract structured insights from a document",
                parameters: {
                  type: "object",
                  properties: {
                    insights: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          category: { type: "string", enum: ["feedback", "suggestion", "market", "partner"] },
                          title: { type: "string" },
                          summary: { type: "string" },
                          confidence: { type: "integer" },
                        },
                        required: ["category", "title", "summary", "confidence"],
                        additionalProperties: false,
                      },
                    },
                  },
                  required: ["insights"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "extract_insights" } },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const parsed = JSON.parse(toolCall.function.arguments);
    const generatedInsights = parsed.insights || [];

    // Insert insights
    const insightRows = generatedInsights.map((insight: any) => ({
      user_id: user.id,
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
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
