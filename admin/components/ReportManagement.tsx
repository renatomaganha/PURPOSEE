

import React, { useState, useMemo } from 'react';
import { Report, ReportStatus, UserProfile } from '../types';

interface ReportManagementProps {
    reports: Report[];
    users: UserProfile[];
    onViewDetails: (report: Report) => void;
}


export const ReportManagement: React.FC<ReportManagementProps> = ({ reports, users, onViewDetails }) => {
    const [filter, setFilter] = useState<ReportStatus | 'all'>('all');

    const getUserById = (id: string) => users.find(u => u.id === id);

    const filteredReports = useMemo(() => {
        if (filter === 'all') return reports;
        return reports.filter(r => r.status === filter);
    }, [reports, filter]);

    const statusStyles: Record<ReportStatus, string> = {
        [ReportStatus.PENDING]: 'bg-amber-100 text-amber-800',
        [ReportStatus.REVIEWED]: 'bg-sky-100 text-sky-800',
        [ReportStatus.RESOLVED]: 'bg-green-100 text-green-800',
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Gerenciamento de Denúncias</h1>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center gap-4">
                <span className="font-semibold text-sm">Filtrar por status:</span>
                 <select 
                    value={filter} 
                    onChange={e => setFilter(e.target.value as ReportStatus | 'all')}
                    className="p-2 border border-slate-300 rounded-md text-sm"
                >
                    <option value="all">Todos</option>
                    <option value={ReportStatus.PENDING}>{ReportStatus.PENDING}</option>
                    <option value={ReportStatus.REVIEWED}>{ReportStatus.REVIEWED}</option>
                    <option value={ReportStatus.RESOLVED}>{ReportStatus.RESOLVED}</option>
                </select>
            </div>
            
             <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th className="px-6 py-3">Data</th>
                            <th className="px-6 py-3">Denunciante</th>
                            <th className="px-6 py-3">Denunciado</th>
                            <th className="px-6 py-3">Motivo</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReports.map(report => {
                            const reporter = getUserById(report.reporter_id);
                            const reported = getUserById(report.reported_id);
                            return (
                                <tr key={report.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4">{new Date(report.created_at).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{reporter?.name || 'Usuário Deletado'}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900">{reported?.name || 'Usuário Deletado'}</td>
                                    <td className="px-6 py-4">{report.reason}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[report.status]}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                         <button onClick={() => onViewDetails(report)} className="font-medium text-sky-600 hover:underline">
                                            Ver Detalhes
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
