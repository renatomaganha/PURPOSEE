import React, { useState, useEffect } from 'react';
import { Campaign, CampaignType } from '../types';
import { PaperClipIcon } from '../icons/PaperClipIcon';
import { InformationCircleIcon } from '../icons/InformationCircleIcon';
import { supabase } from '../../lib/supabaseClient';
import { CampaignModal } from '../../components/CampaignModal';

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
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const { data, error } = await supabase
                    .from('campaigns')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (error) {
                    console.warn("Marketing: Erro ao buscar campanhas:", error.message);
                    return;
                }
                if (data) setCampaigns(data);
            } catch (err) {
                console.error("Marketing: Erro inesperado:", err);
            }
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
        
        // Verificação de segurança extra
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            alert("Sua sessão expirou. Por favor, faça login novamente no Admin.");
            return;
        }

        if (!campaignName || !message || (campaignType === CampaignType.POPUP && !selectedFile)) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        setIsSubmitting(true);
        let imageUrl = '';

        try {
            // 1. Upload da imagem se for POPUP
            if (campaignType === CampaignType.POPUP && selectedFile) {
                const fileName = `pub_${Date.now()}_${selectedFile.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
                
                console.log("Admin: Iniciando upload para marketing-assets...", fileName);
                
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('marketing-assets')
                    .upload(fileName, selectedFile);
                
                if (uploadError) {
                    throw new Error(`Erro no Storage: ${uploadError.message}. Verifique se o bucket 'marketing-assets' existe e é PÚBLICO.`);
                }
                
                const { data: publicUrl } = supabase.storage
                    .from('marketing-assets')
                    .getPublicUrl(fileName);
                
                imageUrl = publicUrl.publicUrl;
                console.log("Admin: Imagem enviada com sucesso:", imageUrl);
            }

            // 2. Inserção no banco
            console.log("Admin: Tentando salvar campanha no banco...");
            
            const payload = {
                name: campaignName,
                type: campaignType,
                target,
                message,
                image_url: imageUrl || null,
                reach: 0,
                ctr: 0
            };

            const { data: newCampaign, error: insertError } = await supabase
                .from('campaigns')
                .insert(payload)
                .select()
                .single();

            if (insertError) {
                console.error("Erro RLS Detalhado:", insertError);
                if (insertError.message.includes("violates row-level security policy")) {
                    throw new Error("Permissão Negada (RLS). Execute o novo SQL master no painel do Supabase para corrigir.");
                }
                throw insertError;
            }

            alert('Campanha enviada com sucesso!');
            setCampaigns([newCampaign, ...campaigns]);
            
            // Reset form
            setCampaignName('');
            setMessage('');
            setTarget('all');
            setCampaignType(CampaignType.TEXT);
            setImagePreview(null);
            setSelectedFile(null);

        } catch (error: any) {
            console.error("Erro ao processar campanha:", error);
            alert(error.message);
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
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-800">Nova Campanha</h2>
                            {imagePreview && campaignType === CampaignType.POPUP && (
                                <button 
                                    onClick={() => setIsPreviewOpen(true)}
                                    className="text-xs font-bold text-sky-600 hover:underline"
                                >
                                    Ver Prévia
                                </button>
                            )}
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="campaignName" className="block text-sm font-medium text-slate-700">Título Interno</label>
                                <input type="text" id="campaignName" value={campaignName} onChange={e => setCampaignName(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Ex: Oferta Black Friday"/>
                            </div>
                            
                             <div>
                                <label className="block text-sm font-medium text-slate-700">Formato</label>
                                <div className="mt-2 flex gap-4">
                                    <label className="flex items-center cursor-pointer">
                                        <input type="radio" value={CampaignType.TEXT} checked={campaignType === CampaignType.TEXT} onChange={() => setCampaignType(CampaignType.TEXT)} className="form-radio text-sky-600"/>
                                        <span className="ml-2 text-sm">Apenas Texto</span>
                                    </label>
                                     <label className="flex items-center cursor-pointer">
                                        <input type="radio" value={CampaignType.POPUP} checked={campaignType === CampaignType.POPUP} onChange={() => setCampaignType(CampaignType.POPUP)} className="form-radio text-sky-600"/>
                                        <span className="ml-2 text-sm">Modal com Imagem</span>
                                    </label>
                                </div>
                            </div>

                            {campaignType === CampaignType.POPUP && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Banner da Oferta</label>
                                    <div className="mt-1 flex items-center justify-center w-full">
                                        <label className="flex flex-col w-full h-32 border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-lg cursor-pointer transition-colors overflow-hidden">
                                            {imagePreview ? (
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-2"/>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    <PaperClipIcon className="w-8 h-8 text-slate-400 mb-2" />
                                                    <p className="text-sm text-slate-500">Selecionar Imagem</p>
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                </div>
                            )}

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-700">Texto da Mensagem</label>
                                <textarea id="message" rows={3} value={message} onChange={e => setMessage(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none" placeholder="O que o usuário verá..."></textarea>
                            </div>
                            
                            <div>
                                <label htmlFor="target" className="block text-sm font-medium text-slate-700">Enviar Para</label>
                                <select id="target" value={target} onChange={e => setTarget(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none">
                                    <option value="all">Todos os Usuários</option>
                                    <option value="premium">Apenas Usuários Premium</option>
                                    <option value="free">Apenas Usuários Free</option>
                                    <option value="non_verified">Usuários Não Verificados</option>
                                </select>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-sky-600 text-white font-bold py-3 px-4 rounded-md hover:bg-sky-700 transition-colors disabled:bg-sky-300 shadow-md"
                            >
                                {isSubmitting ? 'Publicando...' : 'Publicar Agora'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Histórico */}
                <div className="lg:col-span-3">
                    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Controles Rápidos</h2>
                         <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div>
                                <h3 className="font-bold text-slate-800">Forçar Botão Premium</h3>
                                <p className="text-sm text-slate-500">Ativa a oferta Premium na Home do app.</p>
                            </div>
                            <Toggle checked={isPremiumSaleActive} onChange={onPremiumSaleToggle} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Campanhas Ativas</h2>
                         <input 
                            type="text"
                            placeholder="Filtrar por nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full mb-4 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 outline-none"
                        />
                         <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-500">
                                <thead className="text-xs text-slate-700 uppercase bg-slate-50 font-bold">
                                    <tr>
                                        <th className="px-4 py-3">Nome</th>
                                        <th className="px-4 py-3">Público</th>
                                        <th className="px-4 py-3">Formato</th>
                                        <th className="px-4 py-3 text-right">Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredCampaigns.map(c => (
                                        <tr key={c.id} className="bg-white border-b hover:bg-slate-50 text-xs">
                                            <td className="px-4 py-4 font-bold text-slate-900">{c.name}</td>
                                            <td className="px-4 py-4 uppercase font-semibold text-[10px]">{c.target}</td>
                                            <td className="px-4 py-4">{c.type}</td>
                                            <td className="px-4 py-4 text-right">{new Date(c.created_at || "").toLocaleDateString('pt-BR')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                             {filteredCampaigns.length === 0 && (
                                <p className="text-center p-8 text-slate-400 text-sm">Nenhuma campanha registrada.</p>
                             )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Prévia Local */}
            {isPreviewOpen && (
                <CampaignModal 
                    campaign={{ 
                        name: campaignName, 
                        message: message, 
                        image_url: imagePreview || undefined, 
                        type: campaignType 
                    }} 
                    onClose={() => setIsPreviewOpen(false)} 
                />
            )}
        </div>
    );
};