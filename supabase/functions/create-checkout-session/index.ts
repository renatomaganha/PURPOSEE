// FIX: Replaced the unstable remote type reference for Supabase functions with a Deno-native library reference. This correctly loads the Deno namespace and resolves the 'Cannot find name Deno' error.
/// <reference lib="deno.ns" />

// FIX: Updated Deno standard library to a more recent version.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
// FIX: Updated Stripe to a recent version and removed @ts-ignore, as types should be correctly inferred now.
import Stripe from 'https://esm.sh/stripe@15.8.0?target=deno';

// A chave secreta é lida das variáveis de ambiente do Supabase.
// Garanta que 'STRIPE_SECRET_KEY' esteja configurada no seu painel.
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  // Necessário para o ambiente Deno do Supabase
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: '2024-06-20',
});

serve(async (req) => {
  // O cabeçalho 'Origin' é essencial para o CORS.
  const origin = req.headers.get('origin') || '*';

  // Cabeçalhos CORS dinâmicos para permitir chamadas do seu frontend
  const corsHeaders = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Lida com a requisição de preflight (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { priceId } = await req.json();
    
    // Validação do priceId: verifica se é uma string válida e se tem o formato esperado.
    if (!priceId || typeof priceId !== 'string' || !priceId.startsWith('price_')) {
      return new Response(JSON.stringify({ error: 'O ID do preço (priceId) é inválido ou não foi fornecido.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400, // Bad Request
      });
    }

    // Cria a sessão de checkout no Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription', // ou 'payment' para pagamentos únicos
      // URLs para onde o usuário será redirecionado após a tentativa de pagamento
      success_url: `${origin}/?payment_success=true`,
      cancel_url: `${origin}/?payment_canceled=true`,
    });

    // Retorna o ID da sessão para o frontend
    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Erro na função do Supabase:', error.message);
    return new Response(JSON.stringify({ error: 'Ocorreu um erro interno ao processar sua solicitação.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500, // Internal Server Error
    });
  }
});
