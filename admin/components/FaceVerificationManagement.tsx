import React, { useState, useMemo } from 'react';
import { FaceVerification, VerificationStatus } from '../types';

interface FaceVerificationManagementProps {
    verifications: FaceVerification[];
    onViewDetails: (verification: FaceVerification) => void;
}

export const FaceVerificationManagement: React.FC<FaceVerificationManagementProps> = ({ verifications, onViewDetails }) => {
    const [filter, setFilter] = useState<VerificationStatus | 'all'>('all');

    const filteredVerifications = useMemo(() => {
        const sorted = [...verifications].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        if (filter === 'all') {
            return sorted;
        }
        return sorted.filter(v => v.status === filter);
    }, [verifications, filter]);

    const statusStyles: Record<VerificationStatus, string> = {
        [VerificationStatus.PENDING]: 'bg-amber-100 text-amber-800',
        [VerificationStatus.VERIFIED]: 'bg-green-100 text-green-800',
        [VerificationStatus.REJECTED]: 'bg-red-100 text-red-800',
        [VerificationStatus.NOT_VERIFIED]: 'bg-slate-100 text-slate-800',
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Histórico de Verificações Faciais</h1>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center gap-4">
                <span className="font-semibold text-sm">Filtrar por status:</span>
                 <select 
                    value={filter} 
                    onChange={e => setFilter(e.target.value as VerificationStatus | 'all')}
                    className="p-2 border border-slate-300 rounded-md text-sm"
                >
                    <option value="all">Todos</option>
                    <option value={VerificationStatus.PENDING}>{VerificationStatus.PENDING}</option>
                    <option value={VerificationStatus.VERIFIED}>{VerificationStatus.VERIFIED}</option>
                    <option value={VerificationStatus.REJECTED}>{VerificationStatus.REJECTED}</option>
                </select>
            </div>
            
             <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th className="px-6 py-3">Data</th>
                            <th className="px-6 py-3">Usuário</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Revisado Por</th>
                            <th className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVerifications.map(verification => (
                            <tr key={verification.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4">{new Date(verification.created_at).toLocaleString('pt-BR')}</td>
                                <td className="px-6 py-4 font-medium text-slate-900">{verification.user_name}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[verification.status]}`}>
                                        {verification.status}
                                    </span>
                                </td>
                                 <td className="px-6 py-4 text-slate-500">{verification.reviewed_by || 'N/A'}</td>
                                <td className="px-6 py-4 text-center">
                                     <button 
                                        onClick={() => onViewDetails(verification)} 
                                        className="font-medium text-sky-600 hover:underline"
                                    >
                                        {verification.status === VerificationStatus.PENDING ? 'Revisar' : 'Ver Detalhes'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredVerifications.length === 0 && (
                    <div className="text-center p-8 text-slate-500">
                        <p>Nenhuma verificação encontrada com este filtro.</p>
                    </div>
                )}
            </div>
        </div>
    );
};