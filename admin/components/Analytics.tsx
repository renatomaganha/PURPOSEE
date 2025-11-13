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
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Funil de Conversão (Premium)</h2>
                    <div className="space-y-1">
                        <FunnelStep step="Usuários Cadastrados" value={10520} percentage={100} isTop />
                        <FunnelStep step="Visualizaram Tela Premium" value={4150} percentage={70} />
                        <FunnelStep step="Iniciaram Checkout" value={1280} percentage={40} />
                        <FunnelStep step="Assinantes Premium" value={830} percentage={25} isBottom />
                    </div>
                </div>

                {/* Métricas de Receita */}
                 <div className="bg-white p-6 rounded-lg shadow-md">
                     <h2 className="text-xl font-bold text-slate-800 mb-4">Métricas de Pagamento</h2>
                     <div className="space-y-4">
                         <div>
                             <p className="text-sm text-slate-500">Receita Mensal Recorrente (MRR)</p>
                             <p className="text-2xl font-bold text-sky-700">R$ 4.950,00</p>
                         </div>
                         <div>
                             <p className="text-sm text-slate-500">Taxa de Churn (Cancelamentos)</p>
                             <p className="text-2xl font-bold text-red-600">5.2%</p>
                         </div>
                         <div>
                             <p className="text-sm text-slate-500">Valor do Tempo de Vida do Cliente (LTV)</p>
                             <p className="text-2xl font-bold text-green-600">R$ 95,20</p>
                         </div>
                         <p className="text-xs text-slate-400">Gráficos de crescimento de receita e assinaturas seriam exibidos aqui.</p>
                     </div>
                </div>
            </div>
        </div>
    );
};
