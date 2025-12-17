import React from 'react';
import { DashboardStats } from '../types';

const mockStats: DashboardStats = {
    totalUsers: 10520,
    newUsersLastMonth: 1250,
    premiumSubscribers: 432,
    totalRevenue: 15780.50
};

const StatCard: React.FC<{ title: string; value: string | number; description: string; isCurrency?: boolean }> = ({ title, value, description, isCurrency }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-sky-500">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-bold text-slate-800 mt-2">
            {isCurrency ? `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : value}
        </p>
        <p className="text-sm text-slate-400 mt-1">{description}</p>
    </div>
);

export const Dashboard: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total de Usuários" 
                    value={mockStats.totalUsers.toLocaleString('pt-BR')} 
                    description="Usuários cadastrados" 
                />
                <StatCard 
                    title="Assinantes Premium" 
                    value={mockStats.premiumSubscribers.toLocaleString('pt-BR')}
                    description="Contas com assinatura ativa" 
                />
                <StatCard 
                    title="Receita Total (Mês)" 
                    value={mockStats.totalRevenue}
                    description="Faturamento bruto mensal" 
                    isCurrency
                />
                <StatCard 
                    title="Novos Usuários (30d)" 
                    value={mockStats.newUsersLastMonth.toLocaleString('pt-BR')}
                    description="Cadastros nos últimos 30 dias" 
                />
            </div>

             <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Atividade Recente</h2>
                    <div className="space-y-4">
                        {[
                            { user: "Ricardo M.", action: "assinou o Plano Anual", time: "Há 5 min" },
                            { user: "Mariana S.", action: "verificou o perfil", time: "Há 12 min" },
                            { user: "Lucas K.", action: "denunciou um perfil", time: "Há 45 min" },
                            { user: "Júlia F.", action: "assinou o Plano Mensal", time: "Há 1 hora" },
                        ].map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                                <div>
                                    <span className="font-bold text-slate-700">{item.user}</span>
                                    <span className="text-slate-500 ml-2">{item.action}</span>
                                </div>
                                <span className="text-slate-400 text-xs">{item.time}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                    </div>
                    <h3 className="font-bold text-lg text-slate-800">Crescimento de Receita</h3>
                    <p className="text-slate-500 text-sm mt-1">Sua receita cresceu 15% em relação ao mês anterior. Bom trabalho!</p>
                </div>
            </div>
        </div>
    );
};