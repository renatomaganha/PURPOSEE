
import React from 'react';
import { Affiliate, ReferredUser } from '../types';
import { XIcon } from '../../components/icons/XIcon';

interface AffiliateDetailModalProps {
  affiliate: Affiliate;
  referredUsers: ReferredUser[];
  stats: { referredCount: number; totalCommission: number };
  onClose: () => void;
}

const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
    <div className="bg-slate-100 p-3 rounded-lg text-center">
        <h3 className="text-xs font-semibold text-slate-500 uppercase">{title}</h3>
        <p className="text-xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
);

export const AffiliateDetailModal: React.FC<AffiliateDetailModalProps> = ({ affiliate, referredUsers, stats, onClose }) => {
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
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{affiliate.name}</h2>
                <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
                    <span>Código: <span className="font-mono bg-slate-100 px-1 rounded">{affiliate.referralCode}</span></span>
                    <span>Comissão: <span className="font-semibold text-sky-700">{(affiliate.commissionRate * 100).toFixed(0)}%</span></span>
                    <span>Status: <span className={`font-semibold ${affiliate.status === 'Ativo' ? 'text-green-600' : 'text-red-600'}`}>{affiliate.status}</span></span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <StatCard title="Total de Indicados" value={stats.referredCount} />
                    <StatCard title="Comissão Total" value={`R$ ${stats.totalCommission.toFixed(2).replace('.', ',')}`} />
                </div>
                
                <h3 className="text-lg font-bold text-slate-700 mb-3">Usuários Indicados</h3>
                <div className="flex-grow overflow-y-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 sticky top-0">
                            <tr>
                                <th scope="col" className="px-4 py-3">Nome do Usuário</th>
                                <th scope="col" className="px-4 py-3">Data de Cadastro</th>
                                <th scope="col" className="px-4 py-3">Comissão Gerada</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {referredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-900">{user.userName}</td>
                                    <td className="px-4 py-3">{new Date(user.joinDate).toLocaleDateString('pt-BR')}</td>
                                    <td className="px-4 py-3">R$ {user.commissionEarned.toFixed(2).replace('.', ',')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {referredUsers.length === 0 && (
                        <div className="text-center p-8 text-slate-500">
                            <p>Este afiliado ainda não indicou nenhum usuário.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
