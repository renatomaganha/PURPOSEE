import React, { useState } from 'react';
import { DeletionReason, DeletionFeedback } from '../types';
import { XIcon } from './icons/XIcon';
import { StarIcon } from './icons/StarIcon';
import { StarOutlineIcon } from './icons/StarOutlineIcon';
import { HeartIcon } from './icons/HeartIcon';
import { useToast } from '../contexts/ToastContext';


interface DeleteAccountModalProps {
  onClose: () => void;
  onSubmit: (feedback: Omit<DeletionFeedback, 'userId'>) => Promise<void>;
}

const reasons: { key: DeletionReason; label: string }[] = [
    { key: 'found_someone_on_app', label: 'Encontrei alguém especial no Cristão Connect! ❤️' },
    { key: 'found_someone_elsewhere', label: 'Encontrei alguém especial fora do aplicativo.' },
    { key: 'not_satisfied', label: 'Não estou satisfeito(a) com as conexões que encontrei.' },
    { key: 'taking_a_break', label: 'Estou apenas dando um tempo de aplicativos de namoro.' },
    { key: 'technical_issues', label: 'Questões técnicas ou usabilidade do aplicativo.' },
    { key: 'other', label: 'Outro motivo.' },
];

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ onClose, onSubmit }) => {
    const [reason, setReason] = useState<DeletionReason | null>(null);
    const [testimonial, setTestimonial] = useState('');
    const [otherReasonDetails, setOtherReasonDetails] = useState('');
    const [rating, setRating] = useState(0);
    const [generalFeedback, setGeneralFeedback] = useState('');
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason) {
            addToast({ type: 'error', message: 'Por favor, selecione um motivo para a exclusão.' });
            return;
        }
        if (!isConfirmed) {
            addToast({ type: 'error', message: 'Por favor, confirme que você entende as consequências da exclusão.' });
            return;
        }
        setIsSubmitting(true);
        await onSubmit({
            reason,
            testimonial: reason === 'found_someone_on_app' ? testimonial : undefined,
            otherReasonDetails: reason === 'other' ? otherReasonDetails : undefined,
            rating,
            generalFeedback,
        });
        // O isSubmitting não precisa ser resetado, pois o modal será fechado pelo componente pai
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-xl font-bold text-slate-800">Que pena que você está indo...</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XIcon className="w-6 h-6" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
                    <div>
                        <h3 className="font-bold text-slate-700 mb-2">Qual o principal motivo da sua saída?</h3>
                        <div className="space-y-2">
                            {reasons.map(({ key, label }) => (
                                <button
                                    type="button"
                                    key={key}
                                    onClick={() => setReason(key)}
                                    className={`w-full text-left p-3 rounded-lg border-2 text-sm transition-colors ${reason === key ? 'bg-sky-50 border-sky-500 font-semibold' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {reason === 'found_someone_on_app' && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <label htmlFor="testimonial" className="flex items-center gap-2 font-bold text-green-800 mb-2">
                               <HeartIcon className="w-5 h-5"/> Ficamos muito felizes por você!
                            </label>
                            <p className="text-xs text-green-700 mb-2">Se sentir à vontade, compartilhe sua história. Seu testemunho pode inspirar outras pessoas!</p>
                            <textarea
                                id="testimonial"
                                value={testimonial}
                                onChange={(e) => setTestimonial(e.target.value)}
                                rows={4}
                                className="w-full p-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:outline-none"
                                placeholder="Como vocês se conheceram? O que mais gostaram no app?..."
                            />
                        </div>
                    )}

                    {reason === 'other' && (
                        <div>
                            <label htmlFor="otherReasonDetails" className="font-semibold text-slate-700 mb-1 block">Por favor, conte-nos um pouco mais:</label>
                            <textarea
                                id="otherReasonDetails"
                                value={otherReasonDetails}
                                onChange={(e) => setOtherReasonDetails(e.target.value)}
                                rows={3}
                                className="w-full p-2 border border-slate-300 rounded-md"
                                placeholder="Sua opinião é muito importante."
                            />
                        </div>
                    )}

                    <div>
                        <h3 className="font-bold text-slate-700 mb-2 text-center">Como você avalia sua experiência geral?</h3>
                        <div className="flex justify-center items-center gap-2">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button type="button" key={star} onClick={() => setRating(star)}>
                                    {star <= rating ? (
                                        <StarIcon className="w-8 h-8 text-amber-400" />
                                    ) : (
                                        <StarOutlineIcon className="w-8 h-8 text-slate-300" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="generalFeedback" className="font-semibold text-slate-700 mb-1 block">
                           Tem alguma sugestão para melhorarmos?
                        </label>
                        <textarea
                            id="generalFeedback"
                            value={generalFeedback}
                            onChange={(e) => setGeneralFeedback(e.target.value)}
                            rows={3}
                            className="w-full p-2 border border-slate-300 rounded-md"
                            placeholder="Críticas, elogios ou ideias são bem-vindos!"
                        />
                    </div>
                    
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-800">
                         <label className="flex items-start">
                            <input
                                type="checkbox"
                                checked={isConfirmed}
                                onChange={(e) => setIsConfirmed(e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <div className="ml-3 text-sm">
                                <span className="font-bold">Atenção: Ação Irreversível!</span>
                                <p>Eu entendo que ao deletar minha conta, todos os meus dados, matches e conversas serão permanentemente excluídos.</p>
                            </div>
                        </label>
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-4 pt-2">
                        <button type="button" onClick={onClose} className="mt-2 sm:mt-0 bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 transition-colors">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={!isConfirmed || isSubmitting}
                            className="bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Excluindo...' : 'Deletar Minha Conta Permanentemente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};