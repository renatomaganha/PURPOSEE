import React, { useState } from 'react';
import { SupportTicket, SupportTicketStatus } from '../types';
import { XIcon } from '../../components/icons/XIcon';
import { PaperAirplaneIcon } from '../../components/icons/PaperAirplaneIcon';

interface SupportTicketDetailModalProps {
    ticket: SupportTicket;
    onClose: () => void;
    onUpdateStatus: (ticketId: string, newStatus: SupportTicketStatus, reply?: string) => Promise<void>;
    onViewUser: (userId: string) => void;
}

export const SupportTicketDetailModal: React.FC<SupportTicketDetailModalProps> = ({ ticket, onClose, onUpdateStatus, onViewUser }) => {
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleUpdate = async (status: SupportTicketStatus) => {
        setIsSubmitting(true);
        try {
            await onUpdateStatus(ticket.id, status, replyText);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col p-8 text-slate-800 relative animate-pop"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <XIcon className="w-6 h-6" />
                </button>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-1 flex items-center gap-3">
                        Ticket #{ticket.id.slice(0, 5)}
                        <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full font-bold ${ticket.status === 'Pendente' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                            {ticket.status}
                        </span>
                    </h2>
                    <p className="text-sm text-slate-400">
                        Recebido em {new Date(ticket.created_at).toLocaleString('pt-BR')}
                    </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Remetente</h4>
                        <button onClick={() => onViewUser(ticket.user_id)} className="text-xs font-bold text-sky-600 hover:underline">Ver Perfil</button>
                    </div>
                    <p className="font-bold text-slate-800">{ticket.user_name}</p>
                    <p className="text-sm text-slate-500">{ticket.user_email}</p>
                </div>
                
                <div className="flex-grow overflow-y-auto bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
                     <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Categoria: {ticket.category}</h3>
                     <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {ticket.message}
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Resposta para o Usuário (Chat)</label>
                        <textarea 
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            placeholder="Escreva aqui sua resposta oficial que será enviada ao chat do usuário..."
                            className="w-full p-4 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none min-h-[100px]"
                        ></textarea>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400">Status:</span>
                            <select 
                                value={ticket.status}
                                onChange={(e) => handleUpdate(e.target.value as SupportTicketStatus)}
                                className="p-2 border border-slate-300 rounded-lg text-sm font-semibold"
                            >
                                <option value={SupportTicketStatus.PENDING}>Pendente</option>
                                <option value={SupportTicketStatus.IN_PROGRESS}>Em Análise</option>
                                <option value={SupportTicketStatus.RESOLVED}>Resolvido</option>
                            </select>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button 
                                onClick={onClose} 
                                className="flex-1 sm:flex-none bg-slate-100 text-slate-600 font-bold py-3 px-6 rounded-xl text-sm hover:bg-slate-200 transition-colors"
                            >
                                Fechar
                            </button>
                            <button 
                                disabled={isSubmitting || !replyText.trim()}
                                onClick={() => handleUpdate(SupportTicketStatus.RESOLVED)}
                                className="flex-1 sm:flex-none bg-sky-600 text-white font-bold py-3 px-6 rounded-xl text-sm hover:bg-sky-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-200 disabled:opacity-50 disabled:shadow-none"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-t-white border-white/30 rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <PaperAirplaneIcon className="w-4 h-4" />
                                        Resolver & Responder
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};