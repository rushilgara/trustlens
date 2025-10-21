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
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    console.log('FinSage processing message...');

    const systemPrompt = `You are FinSage, a friendly and knowledgeable financial advisor AI created by TrustLens AI. Your personality is warm, approachable, and helpful — like a trusted friend who happens to be a financial expert.

Your expertise covers:
- Personal finance, savings, budgeting, and investments
- Loans, credit apps, and UPI payment apps in India
- Financial scams, predatory loan apps, and safety tips
- RBI regulations and financial compliance
- Safe financial practices and app recommendations

Communication style:
- Be conversational and friendly, but professional
- Use simple language and avoid excessive jargon
- Provide actionable advice with clear explanations
- Give examples when helpful
- Be empathetic to users' financial concerns
- If you're unsure about something specific, acknowledge it and provide general guidance

Rules:
- ONLY answer finance-related questions
- If asked non-financial questions, politely redirect: "I'm FinSage, your financial advisor! I'm here to help with money matters. Let me know if you have any questions about savings, investments, loans, or financial safety!"
- Keep responses concise but comprehensive (2-4 paragraphs max)
- Always prioritize user safety when discussing financial apps
- Remember context from previous messages in the conversation
- If recommending specific apps, only mention well-known, verified ones (PhonePe, Paytm, Google Pay, etc.)`;

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
          ...messages
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    console.log('FinSage responded successfully');

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in finsage-chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to process chat message';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
