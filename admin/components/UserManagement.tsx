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
        const matchesSearch = 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 mb-1">Usuários Registrados</h1>
                    <p className="text-slate-500 text-sm">Gerencie o acesso e monitore a atividade dos membros da comunidade.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-xs font-black text-slate-500 bg-white px-4 py-3 rounded-xl shadow-sm border border-slate-200 uppercase tracking-widest">
                        Total: {users.length}
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md mb-8 flex flex-col md:flex-row gap-6 border border-slate-100">
                 <div className="flex-grow">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Busca inteligente</label>
                    <input 
                        type="text"
                        placeholder="Nome, e-mail ou cidade..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none transition-all"
                    />
                 </div>
                 <div className="min-w-[200px]">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Filtrar Status</label>
                    <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                    >
                        <option value="all">Todos os Membros</option>
                        <option value="premium">Apenas Premium 💎</option>
                        <option value="verified">Apenas Verificados ✅</option>
                        <option value="suspended">Apenas Suspensos ⚠️</option>
                    </select>
                 </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th scope="col" className="px-6 py-5">Usuário</th>
                                <th scope="col" className="px-6 py-5">Localização</th>
                                <th scope="col" className="px-6 py-5">Denominação</th>
                                <th scope="col" className="px-6 py-5">Nível</th>
                                <th scope="col" className="px-6 py-5">Status</th>
                                <th scope="col" className="px-6 py-5 text-center">Gestão</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="bg-white hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                {user.photos[0] ? (
                                                    <img src={user.photos[0]} className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm transition-transform group-hover:scale-105" alt="" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-300 font-black">?</div>
                                                )}
                                                {user.isVerified && (
                                                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                                        <div className="w-3 h-3 bg-sky-500 rounded-full border border-white"></div>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 leading-none mb-1">{user.name}, {user.age}</p>
                                                <p className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">{user.email || user.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-xs font-bold text-slate-600">{user.location}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{user.denomination}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border ${user.isPremium ? 'bg-amber-50 text-amber-600 border-amber-100 shadow-sm' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                            {user.isPremium ? 'Premium' : 'Básico'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${user.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                                                {user.status === 'active' ? 'Ativo' : 'Suspenso'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center space-x-2 whitespace-nowrap">
                                        <button onClick={() => onViewDetails(user)} className="bg-sky-50 text-sky-600 px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-sky-600 hover:text-white transition-all shadow-sm">VER</button>
                                        <button onClick={() => onAction(user.id, 'warn')} className="bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all shadow-sm">AVISAR</button>
                                        <button 
                                            onClick={() => onAction(user.id, user.status === 'active' ? 'suspend' : 'reactivate')} 
                                            className={`${user.status === 'active' ? 'bg-orange-50 text-orange-600 hover:bg-orange-600' : 'bg-green-50 text-green-600 hover:bg-green-600'} px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest hover:text-white transition-all shadow-sm`}
                                        >
                                            {user.status === 'active' ? 'SUSPENDER' : 'REATIVAR'}
                                        </button>
                                        <button onClick={() => onAction(user.id, 'delete')} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-sm">EXCLUIR</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-20 text-slate-400 bg-slate-50/30">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </div>
                            <p className="font-black uppercase tracking-widest text-[10px]">Nenhum usuário encontrado</p>
                            <p className="text-xs mt-1">Ajuste os filtros ou a busca acima.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};