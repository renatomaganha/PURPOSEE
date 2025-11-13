
import React, { useState, useMemo } from 'react';
import { Affiliate, AffiliateStatus, ReferredUser } from '../types';
import { AddAffiliateModal } from './AddAffiliateModal';
import { AffiliateDetailModal } from './AffiliateDetailModal';

const mockAffiliates: Affiliate[] = [
    { id: 'aff_001', name: 'Portal Cristão', referralCode: 'PORTAL10', commissionRate: 0.20, status: AffiliateStatus.ACTIVE, created_at: '2024-05-10T10:00:00Z' },
    { id: 'aff_002', name: 'Blog da Fé', referralCode: 'FEBLOG24', commissionRate: 0.15, status: AffiliateStatus.ACTIVE, created_at: '2024-06-01T14:30:00Z' },
    { id: 'aff_003', name: 'Influencer Graça Divina', referralCode: 'GRACA', commissionRate: 0.25, status: AffiliateStatus.INACTIVE, created_at: '2024-06-20T09:00:00Z' },
];

const mockReferredUsers: ReferredUser[] = [
    { id: 'ref_1', affiliateId: 'aff_001', userId: '1', userName: 'Ana Clara', joinDate: '2024-07-01T10:00:00Z', commissionEarned: 15.00 },
    { id: 'ref_2', affiliateId: 'aff_002', userId: '2', userName: 'Daniel Souza', joinDate: '2024-06-25T15:30:00Z', commissionEarned: 15.00 },
    { id: 'ref_3', affiliateId: 'aff_001', userId: '4', userName: 'Lucas Ferreira', joinDate: '2024-07-05T20:00:00Z', commissionEarned: 0 },
    { id: 'ref_4', affiliateId: 'aff_001', userId: 'user_x', userName: 'Mariana Costa', joinDate: '2024-07-10T11:00:00Z', commissionEarned: 15.00 },
];

export const AffiliateManagement: React.FC = () => {
    const [affiliates, setAffiliates] = useState<Affiliate[]>(mockAffiliates);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);

    const affiliateStats = useMemo(() => {
        const stats = new Map<string, { referredCount: number; totalCommission: number }>();
        mockReferredUsers.forEach(ref => {
            const current = stats.get(ref.affiliateId) || { referredCount: 0, totalCommission: 0 };
            current.referredCount += 1;
            current.totalCommission += ref.commissionEarned;
            stats.set(ref.affiliateId, current);
        });
        return stats;
    }, []);

    const handleAddAffiliate = (newAffiliate: Omit<Affiliate, 'id' | 'created_at'>) => {
        const affiliateToAdd: Affiliate = {
            ...newAffiliate,
            id: `aff_${Date.now()}`,
            created_at: new Date().toISOString(),
        };
        setAffiliates(prev => [affiliateToAdd, ...prev]);
    };
    
    const handleStatusToggle = (affiliateId: string) => {
        setAffiliates(prev => prev.map(aff => {
            if (aff.id === affiliateId) {
                return { ...aff, status: aff.status === AffiliateStatus.ACTIVE ? AffiliateStatus.INACTIVE : AffiliateStatus.ACTIVE };
            }
            return aff;
        }));
    };

    const filteredAffiliates = affiliates.filter(aff =>
        aff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aff.referralCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Gerenciamento de Afiliados</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-sky-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors"
                >
                    Adicionar Afiliado
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nome ou código de afiliado..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nome do Afiliado</th>
                            <th scope="col" className="px-6 py-3">Código</th>
                            <th scope="col" className="px-6 py-3">Indicados</th>
                            <th scope="col" className="px-6 py-3">Comissão Gerada</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAffiliates.map((aff) => {
                            const stats = affiliateStats.get(aff.id) || { referredCount: 0, totalCommission: 0 };
                            return (
                                <tr key={aff.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{aff.name}</td>
                                    <td className="px-6 py-4 font-mono text-sky-700">{aff.referralCode}</td>
                                    <td className="px-6 py-4">{stats.referredCount}</td>
                                    <td className="px-6 py-4">R$ {stats.totalCommission.toFixed(2).replace('.', ',')}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${aff.status === AffiliateStatus.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {aff.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center space-x-2">
                                        <button onClick={() => setSelectedAffiliate(aff)} className="font-medium text-sky-600 hover:underline text-xs">Ver Detalhes</button>
                                        <button onClick={() => handleStatusToggle(aff.id)} className="font-medium text-amber-600 hover:underline text-xs">
                                            {aff.status === AffiliateStatus.ACTIVE ? 'Desativar' : 'Ativar'}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            {isAddModalOpen && (
                <AddAffiliateModal
                    onClose={() => setIsAddModalOpen(false)}
                    onAddAffiliate={handleAddAffiliate}
                />
            )}
            
            {selectedAffiliate && (
                <AffiliateDetailModal
                    affiliate={selectedAffiliate}
                    referredUsers={mockReferredUsers.filter(u => u.affiliateId === selectedAffiliate.id)}
                    stats={affiliateStats.get(selectedAffiliate.id) || { referredCount: 0, totalCommission: 0 }}
                    onClose={() => setSelectedAffiliate(null)}
                />
            )}
        </div>
    );
};
