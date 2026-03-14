import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { assessmentData, riskScore, riskLevel, factors } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a clinical ophthalmology AI assistant. Given patient assessment data, risk score, and risk factors, generate a concise clinical risk explanation as a bullet-point list. Each bullet should be a clear, clinical observation explaining why the risk score is what it is. Focus on:
- Demographics risks (age, gender, diabetes, hypertension)
- Surgery-related risks (type, eye, anesthesia)
- Medical history concerns (previous surgery, immunocompromised)
- Pre-operative values (IOP, visual acuity)
- Post-operative findings (post-op IOP, VA, corneal edema, wound integrity)
- Symptoms (pain, redness, blurred vision, photophobia, floaters)

Return ONLY a JSON array of strings, each being one bullet point observation. Return 3-8 bullet points. No markdown, no extra text, just the JSON array.`;

    const userPrompt = `Patient Assessment Data:
${JSON.stringify(assessmentData, null, 2)}

Calculated Risk Score: ${riskScore}/100
Risk Level: ${riskLevel}
Contributing Factors: ${JSON.stringify(factors)}

Generate clinical risk explanation bullet points.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_explanation",
              description: "Return the clinical risk explanation as bullet points",
              parameters: {
                type: "object",
                properties: {
                  bullets: {
                    type: "array",
                    items: { type: "string" },
                    description: "Array of clinical observation bullet points"
                  }
                },
                required: ["bullets"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "return_explanation" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    let bullets: string[] = [];

    if (toolCall?.function?.arguments) {
      try {
        const parsed = JSON.parse(toolCall.function.arguments);
        bullets = parsed.bullets || [];
      } catch {
        // fallback: try content
        const content = result.choices?.[0]?.message?.content || "[]";
        bullets = JSON.parse(content);
      }
    } else {
      // fallback
      const content = result.choices?.[0]?.message?.content || "[]";
      try {
        bullets = JSON.parse(content);
      } catch {
        bullets = [content];
      }
    }

    return new Response(JSON.stringify({ explanation: bullets }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
