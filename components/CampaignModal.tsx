import React from 'react';
import { XIcon } from './icons/XIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { HeartIcon } from './icons/HeartIcon';
import { GlobeIcon } from './icons/GlobeIcon';

interface CampaignModalProps {
    campaign: {
        name: string;
        message: string;
        image_url?: string;
        type: string;
        external_link?: string;
        button_label?: string;
    };
    onClose: () => void;
    onAction?: () => void;
}

export const CampaignModal: React.FC<CampaignModalProps> = ({ campaign, onClose, onAction }) => {
    
    const handleMainAction = () => {
        if (campaign.external_link) {
            window.open(campaign.external_link, '_blank', 'noopener,noreferrer');
            onClose();
        } else if (onAction) {
            onAction();
        } else {
            onClose();
        }
    };

    const displayButtonLabel = campaign.button_label || (campaign.external_link ? 'Saiba Mais' : 'Aproveitar Oferta');

    return (
        <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[70] p-4"
            onClick={onClose}
        >
            <div 
                className={`bg-white shadow-2xl w-full max-w-sm relative animate-slide-up overflow-hidden ${campaign.image_url ? 'rounded-[2rem] aspect-[3/5]' : 'rounded-3xl'}`}
                onClick={e => e.stopPropagation()}
            >
                {campaign.image_url ? (
                    /* VISUAL DE PERFIL CARD */
                    <div className="relative h-full w-full">
                        <img 
                            src={campaign.image_url} 
                            alt={campaign.name} 
                            className="w-full h-full object-cover"
                            loading="eager"
                        />
                        
                        {/* Overlay Superior */}
                        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start bg-gradient-to-b from-black/50 to-transparent">
                            <div className="bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                Patrocinado
                            </div>
                            <button 
                                onClick={onClose} 
                                className="bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-all backdrop-blur-sm"
                            >
                                <XIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Overlay Inferior (Conteúdo do Perfil) */}
                        <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <SparklesIcon className="w-5 h-5 text-amber-400" />
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-90">Anúncio Purpose</span>
                            </div>
                            
                            <h2 className="text-3xl font-black mb-2 leading-tight drop-shadow-md">
                                {campaign.name}
                            </h2>
                            
                            <p className="text-sm opacity-90 leading-relaxed mb-6 line-clamp-3 text-slate-100">
                                {campaign.message}
                            </p>

                            {/* Botões Estilo Tinder/Purpose */}
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={onClose}
                                    className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/20 transition-all active:scale-90"
                                    title="Passar"
                                >
                                    <XIcon className="w-7 h-7 text-red-400" />
                                </button>
                                
                                <button 
                                    onClick={handleMainAction}
                                    className="flex-grow bg-white text-slate-900 hover:bg-sky-50 font-black py-4 rounded-2xl transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-2"
                                >
                                    {campaign.external_link ? <GlobeIcon className="w-5 h-5 text-sky-600" /> : <HeartIcon className="w-5 h-5 text-sky-600" />}
                                    {displayButtonLabel}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* VISUAL DE MODAL DE TEXTO (BACKUP) */
                    <div className="p-10 text-center">
                        <button 
                            onClick={onClose} 
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>
                        <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <SparklesIcon className="w-12 h-12 text-sky-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">{campaign.name}</h2>
                        <p className="text-slate-600 leading-relaxed mb-8">{campaign.message}</p>
                        <button 
                            onClick={handleMainAction}
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95"
                        >
                            {displayButtonLabel}
                        </button>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(50px); opacity: 0; scale: 0.95; }
                    to { transform: translateY(0); opacity: 1; scale: 1; }
                }
                .animate-slide-up {
                    animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
};