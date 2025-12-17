import React, { useState, useEffect } from 'react';
import { Campaign, CampaignType } from '../types';
import { PaperClipIcon } from '../icons/PaperClipIcon';
import { InformationCircleIcon } from '../icons/InformationCircleIcon';
import { supabase } from '../../lib/supabaseClient';

interface MarketingToolsProps {
    isPremiumSaleActive: boolean;
    onPremiumSaleToggle: (isActive: boolean) => void;
}

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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCampaigns = async () => {
            const { data } = await supabase
                .from('campaigns')
                .select('*')
                .order('created_at', { ascending: false });
            if (data) setCampaigns(data);
        };
        fetchCampaigns();
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!campaignName || !message || (campaignType === CampaignType.POPUP && !selectedFile)) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        setIsSubmitting(true);
        let imageUrl = '';

        try {
            // 1. Upload da imagem se for POPUP
            if (campaignType === CampaignType.POPUP && selectedFile) {
                const fileName = `campaigns/${Date.now()}_${selectedFile.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('marketing-assets')
                    .upload(fileName, selectedFile);
                
                if (uploadError) throw uploadError;
                
                const { data: publicUrl } = supabase.storage
                    .from('marketing-assets')
                    .getPublicUrl(fileName);
                
                imageUrl = publicUrl.publicUrl;
            }

            // 2. Inserção no banco
            const { data: newCampaign, error: insertError } = await supabase
                .from('campaigns')
                .insert({
                    name: campaignName,
                    type: campaignType,
                    target,
                    message,
                    image_url: imageUrl,
                    created_at: new Date().toISOString(),
                    reach: 0,
                    ctr: 0
                })
                .select()
                .single();

            if (insertError) throw insertError;

            // Sucesso!
            alert('Campanha enviada com sucesso para o banco de dados!');
            setCampaigns([newCampaign, ...campaigns]);
            
            // Reset form
            setCampaignName('');
            setMessage('');
            setTarget('all');
            setCampaignType(CampaignType.TEXT);
            setImagePreview(null);
            setSelectedFile(null);

        } catch (error: any) {
            console.error("Erro ao enviar campanha:", error);
            alert(`Erro ao enviar campanha: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
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
                                <input type="text" id="campaignName" value={campaignName} onChange={e => setCampaignName(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md" placeholder="Ex: Promoção de Verão"/>
                            </div>
                            
                             <div>
                                <label className="block text-sm font-medium text-slate-700">Tipo de Campanha</label>
                                <div className="mt-2 flex gap-4">
                                    <label className="flex items-center">
                                        <input type="radio" value={CampaignType.TEXT} checked={campaignType === CampaignType.TEXT} onChange={() => setCampaignType(CampaignType.TEXT)} className="form-radio text-sky-600"/>
                                        <span className="ml-2 text-sm">Apenas Texto</span>
                                    </label>
                                     <label className="flex items-center">
                                        <input type="radio" value={CampaignType.POPUP} checked={campaignType === CampaignType.POPUP} onChange={() => setCampaignType(CampaignType.POPUP)} className="form-radio text-sky-600"/>
                                        <span className="ml-2 text-sm">Pop-up com Imagem</span>
                                    </label>
                                </div>
                            </div>

                            {campaignType === CampaignType.POPUP && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Imagem do Banner</label>
                                    <div className="mt-1 flex items-center justify-center w-full">
                                        <label className="flex flex-col w-full h-32 border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-lg cursor-pointer">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg"/>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <PaperClipIcon className="w-8 h-8 text-slate-400 mb-2" />
                                                    <p className="text-sm text-slate-500">Adicionar Imagem</p>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700">Mensagem</label>
                                <textarea id="message" rows={3} value={message} onChange={e => setMessage(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md" placeholder="Ex: Não perca! 50% de desconto no Premium apenas hoje."></textarea>
                            </div>
                            
                            <div>
                                <label htmlFor="target" className="block text-sm font-medium text-slate-700">Público-Alvo</label>
                                <select id="target" value={target} onChange={e => setTarget(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md">
                                    <option value="all">Todos os Usuários</option>
                                    <option value="premium">Apenas Premium</option>
                                    <option value="free">Apenas Plano Básico</option>
                                    <option value="non_verified">Apenas Não Verificados</option>
                                </select>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-md hover:bg-sky-700 transition-colors disabled:bg-sky-300"
                            >
                                {isSubmitting ? 'Enviando...' : 'Publicar Agora'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Histórico */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Atalhos Administrativos</h2>
                         <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                                <h3 className="font-bold text-slate-800">Forçar Exibição de Vendas</h3>
                                <p className="text-sm text-slate-500">Ativa o botão Premium na tela inicial do app.</p>
                            </div>
                            <Toggle checked={isPremiumSaleActive} onChange={onPremiumSaleToggle} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Campanhas Recentes</h2>
                         <input 
                            type="text"
                            placeholder="Pesquisar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full mb-4 p-2 border border-slate-300 rounded-md"
                        />
                         <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3">Campanha</th>
                                        <th className="px-4 py-3">Público</th>
                                        <th className="px-4 py-3">Tipo</th>
                                        <th className="px-4 py-3">Criado em</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCampaigns.map(c => (
                                        <tr key={c.id} className="bg-white border-b hover:bg-slate-50 text-xs">
                                            <td className="px-4 py-4 font-bold text-slate-900">{c.name}</td>
                                            <td className="px-4 py-4 uppercase font-semibold">{c.target}</td>
                                            <td className="px-4 py-4">{c.type}</td>
                                            <td className="px-4 py-4">{new Date(c.created_at || "").toLocaleDateString('pt-BR')}</td>
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