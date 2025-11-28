import React, { useState } from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { SupportTicketCategory, UserProfile } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../auth/AuthContext';

interface HelpAndSupportScreenProps {
    onClose: () => void;
    currentUserProfile: UserProfile | null;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export const HelpAndSupportScreen: React.FC<HelpAndSupportScreenProps> = ({ onClose, currentUserProfile }) => {
    const { user } = useAuth();
    const [category, setCategory] = useState<SupportTicketCategory>('Problema Técnico');
    const [message, setMessage] = useState('');
    const [formStatus, setFormStatus] = useState<FormStatus>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            setErrorMessage('Por favor, descreva seu problema.');
            return;
        }

        if (!user || !currentUserProfile) {
            setErrorMessage('Você precisa estar logado para enviar uma solicitação.');
            return;
        }

        setFormStatus('submitting');
        setErrorMessage('');

        const { error } = await supabase.from('support_tickets').insert({
            user_id: user.id,
            user_name: currentUserProfile.name,
            user_email: user.email,
            category,
            message,
            status: 'Pendente',
        });

        if (error) {
            console.error('Erro ao enviar ticket de suporte:', "Message:", error.message, "Details:", error.details, "Code:", error.code);
            setErrorMessage('Ocorreu um erro ao enviar sua solicitação. Tente novamente.');
            setFormStatus('error');
        } else {
            setFormStatus('success');
            setMessage('');
        }
    };

    return (
        <div className="fixed inset-0 z-40 bg-slate-100 flex flex-col animate-slide-in-right">
            <header className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-20">
                <button onClick={onClose} className="p-2 -ml-2 mr-2">
                    <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-800">Ajuda & Suporte</h1>
            </header>

            <main className="flex-grow overflow-y-auto p-6">
                
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Enviar uma Solicitação</h2>
                    {formStatus === 'success' ? (
                        <div className="text-center p-4 bg-green-50 text-green-800 rounded-lg">
                            <h3 className="font-bold">Solicitação Enviada!</h3>
                            <p className="text-sm">Nossa equipe responderá o mais breve possível no seu e-mail de cadastro.</p>
                            <button onClick={() => setFormStatus('idle')} className="mt-3 text-sm font-semibold underline">Enviar outra solicitação</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="category" className="block text-sm font-medium text-slate-700">Categoria</label>
                                <select 
                                    id="category" 
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value as SupportTicketCategory)}
                                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
                                >
                                    <option>Problema Técnico</option>
                                    <option>Dúvida sobre Pagamento</option>
                                    <option>Denunciar Comportamento</option>
                                    <option>Sugestão</option>
                                    <option>Outro</option>
                                </select>
                            </div>
                            <div>
                                 <label htmlFor="message" className="block text-sm font-medium text-slate-700">Descrição</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-sky-500 focus:border-sky-500"
                                    placeholder="Por favor, descreva seu problema ou dúvida com o máximo de detalhes possível."
                                ></textarea>
                            </div>
                            {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
                            <button 
                                type="submit" 
                                disabled={formStatus === 'submitting'}
                                className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-md hover:bg-sky-700 transition-colors disabled:bg-sky-400"
                            >
                                {formStatus === 'submitting' ? 'Enviando...' : 'Enviar Solicitação'}
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
};