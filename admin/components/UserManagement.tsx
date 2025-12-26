import React, { useState } from 'react';
import { UserProfile } from '../types';

interface UserManagementProps {
    users: UserProfile[];
    onViewDetails: (user: UserProfile) => void;
    onAction: (userId: string, action: 'warn' | 'suspend' | 'reactivate' | 'delete') => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ users, onViewDetails, onAction }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'premium' | 'verified' | 'suspended'>('all');
    
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             user.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (!matchesSearch) return false;
        
        switch (filter) {
            case 'premium': return user.isPremium;
            case 'verified': return user.isVerified;
            case 'suspended': return user.status === 'suspended';
            default: return true;
        }
    });

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Usuários Registrados</h1>
                <div className="text-sm font-semibold text-slate-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                    Total: {users.length} usuários
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col md:flex-row gap-4">
                 <div className="flex-grow">
                    <input 
                        type="text"
                        placeholder="Buscar por nome ou região..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                 </div>
                 <div className="flex gap-2">
                    <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="p-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        <option value="all">Todos os Status</option>
                        <option value="premium">Apenas Premium</option>
                        <option value="verified">Apenas Verificados</option>
                        <option value="suspended">Apenas Suspensos</option>
                    </select>
                 </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b">
                            <tr>
                                <th scope="col" className="px-6 py-4">Usuário</th>
                                <th scope="col" className="px-6 py-4">Localização</th>
                                <th scope="col" className="px-6 py-4">Fé</th>
                                <th scope="col" className="px-6 py-4">Plano</th>
                                <th scope="col" className="px-6 py-4">Verificado</th>
                                <th scope="col" className="px-6 py-4">Status</th>
                                <th scope="col" className="px-6 py-4 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="bg-white hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {user.photos[0] ? (
                                                <img src={user.photos[0]} className="w-10 h-10 rounded-full object-cover border border-slate-200" alt="" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">?</div>
                                            )}
                                            <div>
                                                <p className="font-bold text-slate-900">{user.name}, {user.age}</p>
                                                <p className="text-[10px] text-slate-400 font-mono uppercase">{user.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs">{user.location}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-[10px]">
                                            <p className="font-bold text-slate-700 uppercase">{user.denomination}</p>
                                            <p className="text-slate-400">{user.churchFrequency}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-[10px] font-black uppercase rounded-full ${user.isPremium ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-slate-100 text-slate-500'}`}>
                                            {user.isPremium ? 'Premium' : 'Básico'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.isVerified ? (
                                            <span className="text-sky-500 font-bold flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                                Sim
                                            </span>
                                        ) : (
                                            <span className="text-slate-300 text-xs">Não</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {user.status === 'active' ? 'Ativo' : 'Suspenso'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center space-x-2 whitespace-nowrap">
                                        <button onClick={() => onViewDetails(user)} className="bg-sky-50 text-sky-600 px-3 py-1 rounded font-bold text-[10px] hover:bg-sky-600 hover:text-white transition-all">VER</button>
                                        <button onClick={() => onAction(user.id, 'warn')} className="bg-amber-50 text-amber-600 px-3 py-1 rounded font-bold text-[10px] hover:bg-amber-600 hover:text-white transition-all">AVISAR</button>
                                        <button 
                                            onClick={() => onAction(user.id, user.status === 'active' ? 'suspend' : 'reactivate')} 
                                            className={`${user.status === 'active' ? 'bg-orange-50 text-orange-600 hover:bg-orange-600' : 'bg-green-50 text-green-600 hover:bg-green-600'} px-3 py-1 rounded font-bold text-[10px] hover:text-white transition-all`}
                                        >
                                            {user.status === 'active' ? 'SUSPENDER' : 'REATIVAR'}
                                        </button>
                                        <button onClick={() => onAction(user.id, 'delete')} className="bg-red-50 text-red-600 px-3 py-1 rounded font-bold text-[10px] hover:bg-red-600 hover:text-white transition-all">EXCLUIR</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="p-12 text-center text-slate-400">
                            Nenhum usuário encontrado para os critérios atuais.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};