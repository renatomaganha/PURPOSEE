import React from 'react';
import { SupportTicket, SupportTicketStatus } from '../types';
import { XIcon } from '../../components/icons/XIcon';

interface SupportTicketDetailModalProps {
    ticket: SupportTicket;
    onClose: () => void;
    onUpdateStatus: (ticketId: string, newStatus: SupportTicketStatus) => void;
    onViewUser: (userId: string) => void;
}

export const SupportTicketDetailModal: React.FC<SupportTicketDetailModalProps> = ({ ticket, onClose, onUpdateStatus, onViewUser }) => {

    const handleStatusChange = (newStatus: SupportTicketStatus) => {
        onUpdateStatus(ticket.id, newStatus);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col p-8 text-slate-800 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Detalhes do Ticket de Suporte</h2>
                <p className="text-sm text-slate-500 mb-6">
                    Recebido em: {new Date(ticket.created_at).toLocaleString('pt-BR')}
                </p>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
                    <h4 className="text-sm font-bold text-slate-600 mb-2">Informações do Usuário</h4>
                    <p className="font-semibold text-slate-800">{ticket.user_name}</p>
                    <p className="text-xs text-slate-500">{ticket.user_email}</p>
                    <button onClick={() => onViewUser(ticket.user_id)} className="text-xs font-bold text-sky-600 hover:underline mt-1">
                        Ver Perfil Completo do Usuário
                    </button>
                </div>
                
                <div className="flex-grow overflow-y-auto bg-slate-50 border border-slate-200 rounded-lg p-4">
                     <h3 className="text-lg font-bold text-slate-700">Categoria da Solicitação</h3>
                     <p className="text-md font-semibold text-sky-700 mb-3">{ticket.category}</p>
                     <h3 className="text-lg font-bold text-slate-700">Mensagem do Usuário</h3>
                     <p className="text-sm text-slate-600 whitespace-pre-wrap">
                        {ticket.message}
                    </p>
                </div>
                
                <div className="mt-6 flex items-center justify-between gap-4">
                    <div>
                        <span className="text-sm font-semibold mr-3">Mudar Status do Ticket:</span>
                        <select 
                            value={ticket.status}
                            onChange={(e) => handleStatusChange(e.target.value as SupportTicketStatus)}
                            className="p-2 border border-slate-300 rounded-md text-sm"
                        >
                            <option value={SupportTicketStatus.PENDING}>{SupportTicketStatus.PENDING}</option>
                            <option value={SupportTicketStatus.IN_PROGRESS}>{SupportTicketStatus.IN_PROGRESS}</option>
                            <option value={SupportTicketStatus.RESOLVED}>{SupportTicketStatus.RESOLVED}</option>
                        </select>
                    </div>
                    <button onClick={onClose} className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300 transition-colors">
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};