import React from 'react';

const FunnelStep: React.FC<{ step: string; value: number; percentage: number; color?: string; isTop?: boolean; isBottom?: boolean }> = ({ step, value, percentage, color = "bg-sky-500", isTop, isBottom }) => (
    <div className="flex items-center justify-center">
        <div 
            className={`
                ${color} text-white text-center font-bold py-4
                ${isTop ? 'rounded-t-lg' : ''}
                ${isBottom ? 'rounded-b-lg' : ''}
            `}
            style={{ width: `${percentage}%` }}
        >
            <p className="text-[10px] uppercase opacity-80">{step}</p>
            <p className="text-xl">{value.toLocaleString('pt-BR')}</p>
        </div>
    </div>
);

const RevenueBar: React.FC<{ label: string; amount: number; percentage: number; color: string }> = ({ label, amount, percentage, color }) => (
    <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
            <span className="font-bold text-slate-700">{label}</span>
            <span className="text-slate-500 font-mono">R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4">
            <div 
                className={`${color} h-4 rounded-full transition-all duration-1000`} 
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    </div>
);


export const Analytics: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Analytics & Finanças</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Distribuição de Receita */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-sky-500" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path></svg>
                        Receita por Plano
                    </h2>
                    <RevenueBar label="Anual (Melhor Valor)" amount={8450.00} percentage={54} color="bg-emerald-500" />
                    <RevenueBar label="Trimestral (Popular)" amount={5200.50} percentage={33} color="bg-sky-500" />
                    <RevenueBar label="Mensal" amount={2130.00} percentage={13} color="bg-amber-500" />
                    
                    <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <p className="text-xs text-slate-500 text-center italic">
                            Dica: O plano <strong>Anual</strong> representa a maior parte do faturamento. Considere criar uma promoção específica para converter usuários Mensais em Anuais.
                        </p>
                    </div>
                </div>

                {/* Funil de Conversão */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-sky-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"></path></svg>
                        Funil de Vendas (Mensal)
                    </h2>
                    <div className="space-y-1">
                        <FunnelStep step="Visitantes Loja" value={2800} percentage={100} color="bg-slate-400" isTop />
                        <FunnelStep step="Iniciaram Checkout" value={950} percentage={70} color="bg-sky-400" />
                        <FunnelStep step="Pagamento Concluído" value={145} percentage={40} color="bg-emerald-500" isBottom />
                    </div>
                    <div className="mt-6 flex justify-around text-center">
                        <div>
                            <p className="text-2xl font-bold text-slate-800">5.2%</p>
                            <p className="text-[10px] text-slate-500 uppercase">Taxa de Conversão</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800">R$ 108,83</p>
                            <p className="text-[10px] text-slate-500 uppercase">Ticket Médio</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Metas de Faturamento</h2>
                <div className="flex items-center gap-4">
                    <div className="flex-grow bg-slate-100 rounded-full h-8 overflow-hidden flex">
                        <div className="bg-sky-500 h-full flex items-center justify-center text-white text-xs font-bold" style={{ width: '78%' }}>78% da Meta</div>
                    </div>
                    <span className="font-bold text-slate-700">R$ 20.000,00</span>
                </div>
            </div>
        </div>
    );
};