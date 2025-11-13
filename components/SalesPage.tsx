import React, { useState } from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { HeartSparkleIcon } from './icons/HeartSparkleIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';
import { FilterIcon } from './icons/FilterIcon';
import { BoltIcon } from './icons/BoltIcon';
import { HeartIcon } from './icons/HeartIcon';
import { supabase } from '../lib/supabaseClient';

declare global {
    interface Window {
        Stripe: any;
    }
}

interface SalesPageProps {
    onClose: () => void;
}

const benefits = [
    { icon: <PaperAirplaneIcon className="w-5 h-5 text-sky-600" />, text: "Inicie uma conversa sem uma curtida mútua" },
    { icon: <HeartIcon className="w-5 h-5 text-sky-600" />, text: "Veja quem te curtiu e curta de volta" },
    { icon: <SparklesIcon className="w-5 h-5 text-sky-600" />, text: "Navegue pelo feed sem limitações" },
    { icon: <FilterIcon className="w-5 h-5 text-sky-600" />, text: "Filtros de Pesquisa avançados" },
    { icon: <EyeSlashIcon className="w-5 h-5 text-sky-600" />, text: "Modo Invisível" },
];

// IDs de Preço (Price ID) dos seus produtos no Stripe.
const plans = [
    {
        id: 'prod_TOcwMPh8A68Pmj',
        name: '1 Semana',
        price: '24,99',
        priceId: 'price_1PifVWF2c4vteATAsrO82b4L', // 24,99
        superLikes: 7,
        tag: null,
    },
    {
        id: 'prod_TOcxyo71Mk4cFs',
        name: '1 Mês',
        price: '39,99',
        priceId: 'price_1PifWCF2c4vteATAY4x0rQh1', // 39,99
        superLikes: 30,
        tag: 'Popular',
    },
    {
        id: 'prod_TOcznRtyPF2Nr8',
        name: '3 Mês Ouro',
        price: '79,99',
        priceId: 'price_1PifX3F2c4vteATAI2tC451g', // 79,99
        superLikes: 100,
        tag: 'Melhor Valor',
        extraBenefit: "1 Impulso (Boost) grátis"
    }
];

type PlanId = 'prod_TOcwMPh8A68Pmj' | 'prod_TOcxyo71Mk4cFs' | 'prod_TOcznRtyPF2Nr8';


export const SalesPage: React.FC<SalesPageProps> = ({ onClose }) => {
    const [selectedPlan, setSelectedPlan] = useState<PlanId>('prod_TOcxyo71Mk4cFs');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Usuário não autenticado.");

            const selectedPriceId = plans.find(p => p.id === selectedPlan)?.priceId;
            if (!selectedPriceId || selectedPriceId.includes('YOUR_')) {
                throw new Error("ID de preço do plano não configurado.");
            }

            // Chame sua Edge Function para criar a sessão de checkout
            const { data, error: functionError } = await supabase.functions.invoke('create-checkout-session', {
                body: { priceId: selectedPriceId },
            });

            if (functionError) {
                // Adiciona tratamento específico para erro de conexão com a Edge Function
                if (functionError.message.toLowerCase().includes('failed to send a request')) {
                    throw new Error("Falha de conexão com o serviço de pagamento. Verifique sua internet e tente novamente.");
                }
                throw functionError;
            }
            if (!data.sessionId) throw new Error("Não foi possível obter a sessão de checkout.");

            // IMPORTANTE: Substitua pela sua Chave Publicável (Publishable Key) do Stripe.
            const stripe = await window.Stripe('pk_live_51SK7MqF2c4vteATAFCrRvC4enGags9U6oGz7l5qqWbBD9u1ZQXAuktZLEkcs8u1ACkfdbpcojQG1vRulKZRZuRjO00dZQVgj44');
            if (!stripe) throw new Error("Stripe.js não foi carregado.");

            const { error: redirectError } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
            if (redirectError) throw redirectError;

        } catch (err: any) {
            console.error("Erro no checkout:", err);
            setError(err.message || "Ocorreu um erro ao iniciar o pagamento. Tente novamente.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-40 bg-slate-100 flex flex-col animate-slide-in-right">
            <header className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-20 flex-shrink-0">
                <button onClick={onClose} className="p-2 -ml-2 mr-2">
                    <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-800">PURPOSE MATCH Premium</h1>
            </header>

            <main className="flex-grow overflow-y-auto p-6 text-slate-800">
                <div className="text-center mb-8">
                    <SparklesIcon className="w-16 h-16 text-amber-500 mx-auto mb-3" />
                    <h2 className="text-3xl font-extrabold text-sky-800">Acelere sua Conexão</h2>
                    <p className="text-slate-600 mt-2 max-w-md mx-auto">Escolha o plano que mais combina com seu propósito e encontre sua conexão mais rápido.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
                    {plans.map((plan) => (
                        <div 
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id as PlanId)} 
                            className={`relative p-5 border-2 rounded-lg cursor-pointer transition-all ${selectedPlan === plan.id ? 'border-sky-500 bg-sky-50 shadow-lg' : 'border-slate-300 bg-white hover:border-sky-400'}`}
                        >
                            {plan.tag && (
                                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 ${plan.tag === 'Popular' ? 'bg-sky-600' : 'bg-amber-500'} text-white text-xs font-bold px-3 py-1 rounded-full`}>{plan.tag}</div>
                            )}
                            <h3 className="text-xl font-bold text-center">{plan.name}</h3>
                            <p className="text-3xl font-extrabold text-center my-3">R$ <span className="text-4xl">{plan.price}</span></p>
                            <ul className="space-y-2 text-sm text-slate-600 mt-4">
                                <li className="flex items-center gap-3">
                                    <HeartSparkleIcon className="w-5 h-5 text-sky-600 flex-shrink-0" />
                                    <span><strong>{plan.superLikes} Supercurtidas</strong> para usar</span>
                                </li>
                                {plan.extraBenefit && (
                                    <li className="flex items-center gap-3">
                                        <BoltIcon className="w-5 h-5 text-sky-600 flex-shrink-0" />
                                        <span>{plan.extraBenefit}</span>
                                    </li>
                                )}
                                {benefits.map(benefit => (
                                     <li key={benefit.text} className="flex items-center gap-3">
                                        {benefit.icon}
                                        <span>{benefit.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-10 max-w-sm mx-auto">
                     <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-4">
                        <LockClosedIcon className="w-4 h-4"/>
                        <span>Pagamento Seguro via Stripe</span>
                    </div>

                    {error && <p className="text-center text-red-600 text-sm mb-4">{error}</p>}
                    
                    <button 
                        onClick={handleCheckout} 
                        disabled={isProcessing}
                        className="w-full bg-sky-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-sky-700 transition-colors disabled:bg-sky-400 disabled:cursor-wait"
                    >
                        {isProcessing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-t-white border-white/50 rounded-full animate-spin"></div>
                                <span>Processando...</span>
                            </>
                        ) : (
                            'Assinar Agora'
                        )}
                    </button>
                </div>
                 <p className="text-xs text-slate-400 mt-6 text-center">
                   Ao assinar, você concorda com nossos <button className="underline">Termos de Uso</button>. A assinatura será renovada automaticamente. Você pode cancelar a qualquer momento.
                 </p>

            </main>
        </div>
    );
};