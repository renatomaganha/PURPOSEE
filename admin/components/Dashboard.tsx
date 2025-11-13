import React from 'react';
import { DashboardStats } from '../types';

const mockStats: DashboardStats = {
    totalUsers: 10520,
    newUsersLastMonth: 1250,
    premiumSubscribers: 830,
    totalRevenue: 24750,
};

const StatCard: React.FC<{ title: string; value: string | number; description: string }> = ({ title, value, description }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-bold text-slate-800 mt-2">{value}</p>
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
                    description="Usuários cadastrados na plataforma" 
                />
                <StatCard 
                    title="Novos Usuários (30d)" 
                    value={mockStats.newUsersLastMonth.toLocaleString('pt-BR')}
                    description="Novos cadastros no último mês" 
                />
                 <StatCard 
                    title="Assinantes Premium" 
                    value={mockStats.premiumSubscribers.toLocaleString('pt-BR')}
                    description="Usuários com assinatura ativa" 
                />
                <StatCard 
                    title="Receita Total (Simulado)" 
                    value={`R$ ${mockStats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    description="Receita acumulada da plataforma" 
                />
            </div>

             <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Atividade Recente</h2>
                <p className="text-slate-600">Um feed de atividades recentes, como novas inscrições, denúncias ou assinaturas, seria exibido aqui.</p>
            </div>
        </div>
    );
};
