import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { CheckIcon } from './icons/CheckIcon';
import { useToast } from '../contexts/ToastContext';

// Chave publicável de TESTE do Stripe. Esta chave é segura para ser exposta no frontend.
const STRIPE_PK = 'pk_test_51BTUDGJAJfZb9HEBwDgAbpr23nStFak0l4Tsoz1k6L2xTSA2Orf2tr2N6nB54b2d6t2aF2c6d2aF2c6d'; 
const stripePromise = loadStripe(STRIPE_PK);

// IDs dos preços criados no painel do Stripe (substituir pelos IDs reais).
const PLANS = {
  annual: {
    id: 'price_1PgK2gRvy4V2kL4yZ1kexV9P', // Placeholder - substitua pelo seu ID de preço anual
    name: 'Plano Anual',
    price: 'R$ 119,90',
    period: '/ano',
    description: 'A melhor opção para economizar!',
    isPopular: true,
  },
  monthly: {
    id: 'price_1PgK2gRvy4V2kL4yX3sL4k8X', // Placeholder - substitua pelo seu ID de preço mensal
    name: 'Plano Mensal',
    price: 'R$ 19,90',
    period: '/mês',
    description: 'Flexibilidade total.',
    isPopular: false,
  },
};

interface SalesPageProps {
  onClose: () => void;
}

const BenefitItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start">
    <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
    <span>{children}</span>
  </li>
);

export const SalesPage: React.FC<SalesPageProps> = ({ onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleCheckout = async () => {
    setIsLoading(true);
    addToast({ type: 'info', message: 'Preparando seu checkout seguro...' });

    let sessionId;
    // Etapa 1: Obter a sessão de checkout do nosso backend (Supabase Function)
    try {
        const { data, error: invokeError } = await supabase.functions.invoke('create-checkout-session', {
            body: { priceId: PLANS[selectedPlan].id },
        });

        if (invokeError) {
            // Este erro geralmente é de rede ou CORS
            throw new Error(`Falha ao se comunicar com a função de checkout.`);
        }
        
        if (data.error) {
             // Este erro vem da lógica da nossa função no servidor
             throw new Error(data.error);
        }

        if (!data.sessionId) {
            throw new Error('Resposta inválida do servidor.');
        }
        
        sessionId = data.sessionId;

    } catch (error: any) {
        console.error('Erro ao obter a sessão de checkout:', error);
        addToast({ type: 'error', message: `Erro: ${error.message}` });
        setIsLoading(false);
        return; // Interrompe a execução se não conseguirmos a sessão
    }

    // Etapa 2: Redirecionar para o checkout do Stripe
    try {
        const stripe = await stripePromise;
        if (!stripe) {
            throw new Error('A biblioteca de pagamento (Stripe.js) não carregou.');
        }

        // redirectToCheckout navega para a página do Stripe. Se falhar, retorna um erro.
        const { error: stripeError } = await stripe.redirectToCheckout({
            sessionId,
        });

        // Este código só será executado se houver um erro no redirecionamento
        if (stripeError) {
            // Lança o erro para ser capturado pelo bloco catch abaixo
            throw stripeError;
        }
    } catch (error: any) {
        // Este catch é específico para erros do Stripe durante o redirecionamento
        console.error('Erro de redirecionamento do Stripe:', error);
        addToast({ type: 'error', message: `Falha ao iniciar o pagamento: ${error.message}` });
        setIsLoading(false);
    }
    // Não precisamos de setIsLoading(false) no caminho de sucesso,
    // pois a página será redirecionada.
  };

  const renderPlan = (planKey: 'annual' | 'monthly') => {
    const plan = PLANS[planKey];
    const isSelected = selectedPlan === planKey;
    return (
      <button
        onClick={() => setSelectedPlan(planKey)}
        className={`relative w-full p-4 border-2 rounded-lg text-left transition-all duration-200 ${
          isSelected ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-white hover:border-sky-400'
        }`}
      >
        {plan.isPopular && (
          <div className="absolute -top-3 right-4 bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            MAIS POPULAR
          </div>
        )}
        <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>
        <p className="text-2xl font-bold text-sky-700 mt-1">
          {plan.price} <span className="text-base font-normal text-slate-500">{plan.period}</span>
        </p>
        <p className="text-sm text-slate-500 mt-1">{plan.description}</p>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-100 flex flex-col animate-slide-in-right">
      <header className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-10 flex-shrink-0">
        <button onClick={onClose} className="p-2 -ml-2 mr-2">
          <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Seja Premium</h1>
      </header>

      <main className="flex-grow overflow-y-auto p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-sky-800">Acelere sua Jornada</h2>
          <p className="text-slate-600 mt-2 max-w-md mx-auto">
            Com o Premium, você tem acesso a recursos exclusivos para encontrar sua conexão com propósito mais rápido.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="font-bold text-lg mb-4">Benefícios Exclusivos do Premium:</h3>
          <ul className="space-y-3 text-slate-700">
            <BenefitItem>Veja todos que curtiram seu perfil e dê match instantaneamente.</BenefitItem>
            <BenefitItem>Filtros avançados para encontrar exatamente quem você procura.</BenefitItem>
            <BenefitItem>Receba 1 Impulso (Boost) e 4 Super Conexões toda semana.</BenefitItem>
            <BenefitItem>Navegue anonimamente com o Modo Invisível.</BenefitItem>
            <BenefitItem>Volte e desfaça sua última ação com o recurso Voltar.</BenefitItem>
            <BenefitItem>Experiência sem anúncios.</BenefitItem>
          </ul>
        </div>

        <div className="space-y-4 mb-6">
          {renderPlan('annual')}
          {renderPlan('monthly')}
        </div>
      </main>

      <footer className="bg-white p-4 border-t border-slate-200 sticky bottom-0">
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full bg-sky-600 text-white font-bold py-4 px-6 rounded-full shadow-lg hover:bg-sky-700 transition-colors disabled:bg-sky-300 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Aguarde...' : 'Assinar Agora'}
        </button>
      </footer>
    </div>
  );
};
