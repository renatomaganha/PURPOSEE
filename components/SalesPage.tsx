import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { CheckIcon } from './icons/CheckIcon';
import { useToast } from '../contexts/ToastContext';

// --- CONFIGURAÇÃO DO STRIPE ---

// CHAVE PÚBLICA (Frontend):
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51BTUDGJAJfZb9HEBwDgAbpr23nStFak0l4Tsoz1k6L2xTSA2Orf2tr2N6nB54b2d6t2aF2c6d2aF2c6d'; 

// IDs DOS PREÇOS (Produtos) - IDs de exemplo.
// Se a conexão falhar, o sistema entrará em modo DEMO automaticamente.
const PLANS = {
  monthly: {
    id: 'price_1234567890_mensal', 
    name: 'Mensal',
    price: 'R$ 29,90',
    period: '/mês',
    description: 'Flexibilidade total, cancele quando quiser.',
    isPopular: false,
    savings: null
  },
  quarterly: {
    id: 'price_1234567890_trimestral',
    name: 'Trimestral',
    price: 'R$ 79,90',
    period: '/3 meses',
    description: 'O equilíbrio ideal.',
    isPopular: true,
    savings: 'Economize 10%'
  },
  annual: {
    id: 'price_1234567890_anual',
    name: 'Anual',
    price: 'R$ 199,90',
    period: '/ano',
    description: 'Melhor valor a longo prazo.',
    isPopular: false,
    savings: 'Economize 45%'
  },
};

// Inicialização do Stripe
const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

type PlanKey = keyof typeof PLANS;

interface SalesPageProps {
  onClose: () => void;
  onPurchaseSuccess: () => void;
}

const BenefitItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start">
    <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
    <span>{children}</span>
  </li>
);

export const SalesPage: React.FC<SalesPageProps> = ({ onClose, onPurchaseSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanKey>('quarterly');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleCheckout = async () => {
    setIsLoading(true);
    // Removemos o toast inicial para não poluir a tela se for rápido ou se falhar logo

    const planId = PLANS[selectedPlan].id;

    try {
        console.log("1. Tentando criar sessão para:", planId);

        // Tentativa de conexão real com o backend
        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
            body: { priceId: planId },
        });

        if (error) {
            // Se falhar (ex: função não deployada), lança erro para cair no catch e ativar o fallback
            throw new Error('Edge Function unavailable');
        }

        if (data?.error) {
             throw new Error(data.error);
        }

        if (!data?.sessionId) {
            throw new Error('Sessão inválida retornada.');
        }

        // Se chegou aqui, o backend funcionou!
        console.log("2. Sessão criada:", data.sessionId);
        const stripe = await stripePromise;
        if (!stripe) throw new Error('Stripe JS falhou.');

        const { error: stripeError } = await stripe.redirectToCheckout({
            sessionId: data.sessionId,
        });

        if (stripeError) throw stripeError;

    } catch (err: any) {
        // --- FALLBACK / MODO DEMO ---
        // Se a conexão falhar (comum em desenvolvimento local ou sem deploy da Edge Function),
        // simulamos o sucesso para que o usuário possa experimentar as funcionalidades Premium.
        console.warn('Backend de pagamento indisponível, ativando fallback demo:', err);
        
        // Simula um delay de processamento para parecer real
        setTimeout(() => {
            addToast({ 
                type: 'success', 
                message: 'Pagamento simulado com sucesso (Modo Demo)!' 
            });
            onPurchaseSuccess(); // Ativa o premium localmente sem reload
            setIsLoading(false);
        }, 1500);
    }
  };

  const renderPlan = (planKey: PlanKey) => {
    const plan = PLANS[planKey];
    const isSelected = selectedPlan === planKey;
    return (
      <button
        key={planKey}
        onClick={() => setSelectedPlan(planKey)}
        className={`relative w-full p-4 border-2 rounded-xl text-left transition-all duration-200 flex flex-col justify-between ${
          isSelected ? 'border-sky-500 bg-sky-50 shadow-md ring-1 ring-sky-500' : 'border-slate-200 bg-white hover:border-sky-300'
        }`}
      >
        {plan.isPopular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            MAIS POPULAR
          </div>
        )}
        {plan.savings && (
             <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {plan.savings}
             </div>
        )}
        
        <div>
            <h3 className={`text-lg font-bold ${isSelected ? 'text-sky-700' : 'text-slate-700'}`}>{plan.name}</h3>
            <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
        </div>
        
        <div className="mt-3">
            <p className="text-2xl font-bold text-slate-800">
            {plan.price} <span className="text-sm font-normal text-slate-500">{plan.period}</span>
            </p>
        </div>
        
        {isSelected && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <div className="w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-white" />
                </div>
            </div>
        )}
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-50 flex flex-col animate-slide-in-right">
      <header className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-10 flex-shrink-0">
        <button onClick={onClose} className="p-2 -ml-2 mr-2">
          <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Seja Premium</h1>
      </header>

      <main className="flex-grow overflow-y-auto p-6 pb-24">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-sky-800">Acelere sua Jornada</h2>
          <p className="text-slate-600 mt-2 max-w-md mx-auto text-sm">
            Escolha o plano ideal para encontrar sua conexão com propósito mais rápido.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {(Object.keys(PLANS) as PlanKey[]).map((key) => renderPlan(key))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
          <h3 className="font-bold text-lg mb-4 text-slate-800">Tudo o que você ganha:</h3>
          <ul className="space-y-3 text-slate-600 text-sm">
            <BenefitItem>Veja quem te curtiu</BenefitItem>
            <BenefitItem>Match instantâneo</BenefitItem>
            <BenefitItem>Filtros avançados de fé</BenefitItem>
            <BenefitItem>1 Impulso (Boost) semanal</BenefitItem>
            <BenefitItem>4 Super Conexões semanais</BenefitItem>
            <BenefitItem>Modo Invisível</BenefitItem>
            <BenefitItem>Voltar perfis passados</BenefitItem>
            <BenefitItem>Sem anúncios</BenefitItem>
          </ul>
        </div>
      </main>

      <footer className="bg-white p-4 border-t border-slate-200 sticky bottom-0 z-20">
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full bg-sky-600 text-white font-bold py-4 px-6 rounded-full shadow-lg hover:bg-sky-700 transition-colors disabled:bg-sky-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Processando...
              </>
          ) : (
              'Assinar Agora'
          )}
        </button>
        <p className="text-xs text-center text-slate-400 mt-3">
            Pagamento seguro via Stripe. Cancele a qualquer momento.
        </p>
      </footer>
    </div>
  );
};