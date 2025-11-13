

import React, { useState } from 'react';
import { UserProfile } from '../types';

interface UserManagementProps {
    users: UserProfile[];
    onViewDetails: (user: UserProfile) => void;
    onAction: (userId: string, action: 'warn' | 'suspend' | 'reactivate' | 'delete') => void;
}

// Em um app real, isso também viria do estado central ou de um hook/context
const mockAffiliates = [
    { id: 'aff_001', name: 'Portal Cristão' },
    { id: 'aff_002', name: 'Blog da Fé' },
];

const getAffiliateName = (affiliateId: string | undefined): string => {
    if (!affiliateId) return 'N/A';
    const affiliate = mockAffiliates.find(a => a.id === affiliateId);
    return affiliate ? affiliate.name : 'Desconhecido';
};

export const UserManagement: React.FC<UserManagementProps> = ({ users, onViewDetails, onAction }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Gerenciamento de Usuários</h1>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                 <input 
                    type="text"
                    placeholder="Buscar por nome, e-mail ou região..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nome</th>
                            <th scope="col" className="px-6 py-3">E-mail</th>
                            <th scope="col" className="px-6 py-3">Plano</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Indicado por</th>
                            <th scope="col" className="px-6 py-3">Data de Cadastro</th>
                            <th scope="col" className="px-6 py-3 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                             <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.isPremium ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'}`}>
                                        {user.isPremium ? 'Premium' : 'Básico'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.status === 'active' ? 'Ativo' : 'Suspenso'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{getAffiliateName(user.referred_by)}</td>
                                <td className="px-6 py-4">{new Date(user.created_at || Date.now()).toLocaleDateString('pt-BR')}</td>
                                <td className="px-6 py-4 text-center space-x-2">
                                    <button onClick={() => onViewDetails(user)} className="font-medium text-sky-600 hover:underline text-xs">Ver</button>
                                    <button onClick={() => onAction(user.id, 'warn')} className="font-medium text-amber-600 hover:underline text-xs">Avisar</button>
                                    <button onClick={() => onAction(user.id, user.status === 'active' ? 'suspend' : 'reactivate')} className="font-medium text-orange-600 hover:underline text-xs">
                                        {user.status === 'active' ? 'Suspender' : 'Reativar'}
                                    </button>
                                    <button onClick={() => onAction(user.id, 'delete')} className="font-medium text-red-600 hover:underline text-xs">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
