import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing product image...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `أنت خبير في تحليل المنتجات الغذائية والتجميلية. قم بتحليل صورة المنتج وأعطِ معلومات شاملة باللغة العربية:
1. نوع المنتج (غذائي/تجميلي)
2. المكونات الرئيسية
3. المكونات الضارة أو المثيرة للقلق
4. التقييم الصحي (ممتاز، جيد، متوسط، سيء) مع السبب
5. الفوائد المحتملة
6. المخاطر والتحذيرات
7. نصائح للاستخدام
8. بدائل صحية مقترحة (إذا كان التقييم متوسط أو سيء)

اجعل الرد مفصلاً ودقيقاً ومفيداً للمستخدم.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "حلل هذا المنتج وأعطني معلومات شاملة عنه"
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "تم تجاوز الحد الأقصى للطلبات. يرجى المحاولة لاحقاً." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "يرجى إضافة رصيد إلى حساب Lovable AI الخاص بك." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("فشل تحليل الصورة");
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;

    console.log("Analysis completed successfully");

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-product function:", error);
    const errorMessage = error instanceof Error ? error.message : "حدث خطأ أثناء تحليل المنتج";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
