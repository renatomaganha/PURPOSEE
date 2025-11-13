import React, { useState } from 'react';
import { Campaign, CampaignType } from '../types';
import { PaperClipIcon } from '../icons/PaperClipIcon';
import { XIcon } from '../../components/icons/XIcon';
import { InformationCircleIcon } from '../icons/InformationCircleIcon';


interface MarketingToolsProps {
    isPremiumSaleActive: boolean;
    onPremiumSaleToggle: (isActive: boolean) => void;
}

const mockCampaigns: Campaign[] = [
    { id: '1', name: 'Promoção de Verão Premium', type: CampaignType.POPUP, target: 'all', sentDate: '2024-07-20', reach: 8500, ctr: 12.5, imageUrl: 'https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=2070&auto=format&fit=crop', message: 'Assine o Premium com 30% de desconto!' },
    { id: '2', name: 'Lançamento Filtros Avançados', type: CampaignType.TEXT, target: 'premium', sentDate: '2024-07-15', reach: 830, ctr: 8.2, message: 'Novidade! Agora você pode filtrar por ainda mais opções de fé.' },
    { id: '3', name: 'Convite para Verificação de Perfil', type: CampaignType.POPUP, target: 'non_verified', sentDate: '2024-07-10', reach: 9690, ctr: 18.1, imageUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?q=80&w=1974&auto=format&fit=crop', message: 'Verifique seu perfil e ganhe mais visibilidade!' },
];

const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }> = ({ checked, onChange, disabled }) => (
    <button
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-sky-500' : 'bg-slate-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-6' : ''}`}></div>
    </button>
);


export const MarketingTools: React.FC<MarketingToolsProps> = ({ isPremiumSaleActive, onPremiumSaleToggle }) => {
    const [campaignName, setCampaignName] = useState('');
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState('all');
    const [campaignType, setCampaignType] = useState<CampaignType>(CampaignType.TEXT);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [campaigns] = useState<Campaign[]>(mockCampaigns);
    const [searchTerm, setSearchTerm] = useState('');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!campaignName || !message || (campaignType === CampaignType.POPUP && !imagePreview)) {
            alert('Por favor, preencha todos os campos obrigatórios, incluindo a imagem para pop-ups.');
            return;
        }
        alert(`Campanha "${campaignName}" enviada!\n- Tipo: ${campaignType}\n- Público: ${target}\n- Mensagem: ${message}`);
        // Reset form
        setCampaignName('');
        setMessage('');
        setTarget('all');
        setCampaignType(CampaignType.TEXT);
        setImagePreview(null);
    };
    
    const filteredCampaigns = campaigns.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Ferramentas de Marketing</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Criador de Campanha */}
                <div className="lg:col-span-2">
                     <div className="bg-white p-6 rounded-lg shadow-md sticky top-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Criar Nova Campanha</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="campaignName" className="block text-sm font-medium text-slate-700">Nome da Campanha</label>
                                <input type="text" id="campaignName" value={campaignName} onChange={e => setCampaignName(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md" placeholder="Ex: Lançamento Novo Recurso"/>
                            </div>
                            
                             <div>
                                <label className="block text-sm font-medium text-slate-700">Tipo de Campanha</label>
                                <div className="mt-2 flex gap-4">
                                    <label className="flex items-center">
                                        <input type="radio" value={CampaignType.TEXT} checked={campaignType === CampaignType.TEXT} onChange={() => setCampaignType(CampaignType.TEXT)} className="form-radio text-sky-600"/>
                                        <span className="ml-2 text-sm">Mensagem de Texto</span>
                                    </label>
                                     <label className="flex items-center">
                                        <input type="radio" value={CampaignType.POPUP} checked={campaignType === CampaignType.POPUP} onChange={() => setCampaignType(CampaignType.POPUP)} className="form-radio text-sky-600"/>
                                        <span className="ml-2 text-sm">Pop-up com Imagem</span>
                                    </label>
                                </div>
                            </div>

                            {campaignType === CampaignType.POPUP && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Imagem do Pop-up</label>
                                    <div className="mt-1 flex items-center justify-center w-full">
                                        <label className="flex flex-col w-full h-32 border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-lg cursor-pointer">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg"/>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <PaperClipIcon className="w-8 h-8 text-slate-400 mb-2" />
                                                    <p className="text-sm text-slate-500">Clique para enviar</p>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700">Mensagem</label>
                                <textarea id="message" rows={3} value={message} onChange={e => setMessage(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md" placeholder="Escreva sua notificação aqui..."></textarea>
                            </div>
                            
                            <div>
                                <label htmlFor="target" className="block text-sm font-medium text-slate-700">Público-Alvo</label>
                                <select id="target" value={target} onChange={e => setTarget(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md">
                                    <option value="all">Todos os Usuários</option>
                                    <option value="premium">Apenas Premium</option>
                                    <option value="non_verified">Não Verificados</option>
                                    <option value="region_sp">Região: São Paulo</option>
                                </select>
                            </div>
                            
                            <button type="submit" className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-md hover:bg-sky-700 transition-colors">Enviar Campanha</button>
                        </form>
                    </div>
                </div>

                {/* Análise de Campanhas e Promoções */}
                <div className="lg:col-span-3">
                     <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Promoções Dinâmicas</h2>
                         <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                                <h3 className="font-bold text-slate-800">Ativar Botão de Venda Premium</h3>
                                <p className="text-sm text-slate-500">Exibe um botão na tela Premium redirecionando para a página de vendas.</p>
                            </div>
                            <Toggle checked={isPremiumSaleActive} onChange={onPremiumSaleToggle} />
                        </div>
                        <div className="mt-2 flex items-center text-xs text-slate-400">
                             <InformationCircleIcon className="w-4 h-4 mr-1.5" />
                             <span>Status atual: <span className="font-semibold">{isPremiumSaleActive ? 'Ativado' : 'Desativado'}</span></span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Campanhas Anteriores</h2>
                         <input 
                            type="text"
                            placeholder="Pesquisar campanhas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full mb-4 p-2 border border-slate-300 rounded-md"
                        />
                         <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3">Nome</th>
                                        <th className="px-4 py-3">Tipo</th>
                                        <th className="px-4 py-3">Alcance</th>
                                        <th className="px-4 py-3">CTR</th>
                                        <th className="px-4 py-3">Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCampaigns.map(c => (
                                        <tr key={c.id} className="bg-white border-b hover:bg-slate-50">
                                            <td className="px-4 py-4 font-medium text-slate-900">{c.name}</td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${c.type === CampaignType.POPUP ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-800'}`}>
                                                    {c.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">{c.reach.toLocaleString('pt-BR')}</td>
                                            <td className="px-4 py-4">{c.ctr.toFixed(1)}%</td>
                                            <td className="px-4 py-4">{new Date(c.sentDate).toLocaleDateString('pt-BR')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};