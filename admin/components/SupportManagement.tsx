import React, { useState, useMemo } from 'react';
import { SupportTicket, SupportTicketStatus } from '../types';

interface SupportManagementProps {
    tickets: SupportTicket[];
    onViewDetails: (ticket: SupportTicket) => void;
}

export const SupportManagement: React.FC<SupportManagementProps> = ({ tickets, onViewDetails }) => {
    const [filter, setFilter] = useState<SupportTicketStatus | 'all'>('all');

    const filteredTickets = useMemo(() => {
        if (filter === 'all') {
            // Ordena para que os pendentes apareçam primeiro
            return [...tickets].sort((a, b) => {
                if (a.status === SupportTicketStatus.PENDING && b.status !== SupportTicketStatus.PENDING) return -1;
                if (a.status !== SupportTicketStatus.PENDING && b.status === SupportTicketStatus.PENDING) return 1;
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
        }
        return tickets.filter(t => t.status === filter);
    }, [tickets, filter]);

    const statusStyles: Record<SupportTicketStatus, string> = {
        [SupportTicketStatus.PENDING]: 'bg-amber-100 text-amber-800',
        [SupportTicketStatus.IN_PROGRESS]: 'bg-sky-100 text-sky-800',
        [SupportTicketStatus.RESOLVED]: 'bg-green-100 text-green-800',
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Tickets de Suporte</h1>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center gap-4">
                <span className="font-semibold text-sm">Filtrar por status:</span>
                <select 
                    value={filter} 
                    onChange={e => setFilter(e.target.value as SupportTicketStatus | 'all')}
                    className="p-2 border border-slate-300 rounded-md text-sm"
                >
                    <option value="all">Todos</option>
                    <option value={SupportTicketStatus.PENDING}>{SupportTicketStatus.PENDING}</option>
                    <option value={SupportTicketStatus.IN_PROGRESS}>{SupportTicketStatus.IN_PROGRESS}</option>
                    <option value={SupportTicketStatus.RESOLVED}>{SupportTicketStatus.RESOLVED}</option>
                </select>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th className="px-6 py-3">Data</th>
                            <th className="px-6 py-3">Usuário</th>
                            <th className="px-6 py-3">Categoria</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.map(ticket => (
                            <tr key={ticket.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4">{new Date(ticket.created_at).toLocaleString('pt-BR')}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{ticket.user_name}</td>
                                <td className="px-6 py-4">{ticket.category}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[ticket.status]}`}>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button onClick={() => onViewDetails(ticket)} className="font-medium text-sky-600 hover:underline">
                                        Ver Detalhes
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredTickets.length === 0 && (
                    <div className="text-center p-8 text-slate-500">
                        <p>Nenhum ticket encontrado com este filtro.</p>
                    </div>
                )}
            </div>
        </div>
    );
};