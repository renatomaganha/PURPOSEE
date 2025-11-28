import React from 'react';

const FunnelStep: React.FC<{ step: string; value: number; percentage: number; isTop?: boolean; isBottom?: boolean }> = ({ step, value, percentage, isTop, isBottom }) => (
    <div className="flex items-center justify-center">
        <div 
            className={`
                bg-sky-500 text-white text-center font-bold py-4
                ${isTop ? 'rounded-t-lg' : ''}
                ${isBottom ? 'rounded-b-lg' : ''}
            `}
            style={{ width: `${percentage}%` }}
        >
            <p className="text-sm">{step}</p>
            <p className="text-xl">{value.toLocaleString('pt-BR')}</p>
        </div>
    </div>
);


export const Analytics: React.FC = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Analytics</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Funil de Vendas */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Funil de Engajamento</h2>
                    <div className="space-y-1">
                        <FunnelStep step="Usuários Cadastrados" value={10520} percentage={100} isTop />
                        <FunnelStep step="Enviaram 1ª Curtida" value={7890} percentage={75} />
                        <FunnelStep step="Obtiveram um Match" value={4150} percentage={40} />
                        <FunnelStep step="Enviaram 1ª Mensagem" value={3100} percentage={30} isBottom />
                    </div>
                </div>

            </div>
        </div>
    );
};