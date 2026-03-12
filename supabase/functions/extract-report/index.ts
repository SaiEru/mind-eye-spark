import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { fileContent, fileType, fileName } = await req.json();
    
    if (!fileContent) {
      return new Response(JSON.stringify({ error: "No file content provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a medical report data extraction AI. You will be given the text content of a medical/ophthalmological report. Extract the following clinical values and return them as a JSON object. Use ONLY these exact keys and value formats:

{
  "patientId": "string or empty",
  "fullName": "string or empty",
  "age": "number as string or empty",
  "gender": "male" | "female" | "other" | "",
  "contactNumber": "string or empty",
  "surgeryType": "cataract" | "lasik" | "glaucoma" | "retinal" | "",
  "surgeryDate": "YYYY-MM-DD format or empty",
  "surgeonName": "string or empty",
  "eyeSide": "left" | "right" | "both" | "",
  "anesthesiaType": "topical" | "local" | "general" | "",
  "diabetes": "none" | "controlled" | "poorly_controlled",
  "hypertension": true | false,
  "immunocompromised": true | false,
  "previousEyeSurgery": true | false,
  "allergies": "string or empty",
  "currentMedications": "string or empty",
  "preVisualAcuity": "string like 20/40 or empty",
  "intraocularPressure": "number as string or empty",
  "cornealCondition": "clear" | "mild_opacity" | "significant_opacity" | "scarring" | "",
  "lensStatus": "clear" | "early_cataract" | "mature_cataract" | "pseudophakic" | "aphakic" | "",
  "pupilDilation": "good" | "moderate" | "poor" | "",
  "postVisualAcuity": "string or empty",
  "postIntraocularPressure": "number as string or empty",
  "cornealEdema": "none" | "mild" | "moderate" | "severe" | "",
  "anteriorChamberReaction": "none" | "mild" | "moderate" | "severe" | "",
  "woundIntegrity": "intact" | "seidel_negative" | "compromised" | "",
  "painLevel": "0-10 as string or empty",
  "blurredVision": true | false,
  "eyePain": true | false,
  "redness": true | false,
  "discharge": true | false,
  "photophobia": true | false,
  "floaters": true | false,
  "additionalSymptoms": "string or empty",
  "followUpDate": "YYYY-MM-DD or empty",
  "clinicianNotes": "string or empty"
}

If a value cannot be determined from the report, use empty string for strings and false for booleans. For diabetes default to "none". Only return the JSON object, no other text.`;

    const userMessage = fileType.startsWith("image/")
      ? [
          { type: "text", text: `Extract clinical data from this medical report image (${fileName}):` },
          { type: "image_url", image_url: { url: `data:${fileType};base64,${fileContent}` } }
        ]
      : `Extract clinical data from this medical report text (${fileName}):\n\n${fileContent}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI processing failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResult = await response.json();
    const content = aiResult.choices?.[0]?.message?.content || "";
    
    // Parse JSON from the AI response (may be wrapped in markdown code block)
    let extracted;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      extracted = JSON.parse(jsonMatch[1].trim());
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Could not extract data from the report. Please try manual entry." }), {
        status: 422,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ data: extracted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("extract-report error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
