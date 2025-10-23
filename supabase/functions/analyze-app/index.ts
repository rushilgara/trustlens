import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { appInput } = await req.json();
    
    if (!appInput) {
      return new Response(
        JSON.stringify({ error: 'App name or link is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    console.log('Analyzing app:', appInput);

    const systemPrompt = `You are TrustLens AI — a system that checks if financial apps are safe or unsafe in India.

Your task is to analyze apps and return accurate safety assessments based on:
- RBI registration status
- User complaints and reviews
- App permissions and data practices
- Company reputation and transparency

For well-known legitimate apps (PhonePe, Paytm, Google Pay, BHIM, Amazon Pay, etc.), give high trust scores (85-100) and mark as Safe.

For unknown or suspicious loan apps, give low scores (0-50) and mark as Unsafe.

Return ONLY valid JSON in this exact format:
{
  "app_name": "Detected App Name",
  "icon_url": "https://play-lh.googleusercontent.com/...",
  "trust_score": 85,
  "status": "Safe",
  "reasons": [
    "RBI registered and regulated financial institution",
    "Transparent data practices with clear privacy policy",
    "Minimal required permissions (no contact/photo access)",
    "Strong positive user reviews (4.5+ rating)"
  ]
}

Rules:
- trust_score must be 0-100 (number)
- status must be exactly "Safe" or "Unsafe" (string)
- reasons must be an array of 3-5 specific, factual strings
- icon_url MUST be a real Play Store icon URL from play-lh.googleusercontent.com domain. Extract the actual app icon from Google Play Store.
- For popular apps, always include their real icon URL from the Play Store
- If you cannot find the app icon or app doesn't exist in Play Store, set icon_url to empty string ""
- If you cannot find the app, set trust_score to 0, status to "Unsafe", app_name to the input, icon_url to "", and reasons to ["App not found or not available in official stores", "Cannot verify legitimacy", "Recommend using only verified financial apps"]`;

    const userPrompt = `Analyze this app: ${appInput}

If it's a Play Store or App Store link, extract the app name and package ID from the URL.
For the icon_url field, you MUST provide the real Google Play Store icon URL in this format:
https://play-lh.googleusercontent.com/[icon-hash]

For popular Indian financial apps, search your knowledge for their actual Play Store icon URLs.
Return accurate trust assessment based on your knowledge of Indian financial apps.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;
    
    console.log('AI Response:', analysisText);
    
    const analysis = JSON.parse(analysisText);

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-app function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to analyze app';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
