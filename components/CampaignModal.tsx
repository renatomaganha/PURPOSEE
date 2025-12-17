import React from 'react';
import { XIcon } from './icons/XIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface CampaignModalProps {
    campaign: {
        name: string;
        message: string;
        image_url?: string;
        type: string;
    };
    onClose: () => void;
    onAction?: () => void;
}

export const CampaignModal: React.FC<CampaignModalProps> = ({ campaign, onClose, onAction }) => {
    const handleMainAction = () => {
        if (onAction) {
            onAction();
        } else {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[70] p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative animate-slide-up"
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-all"
                >
                    <XIcon className="w-5 h-5" />
                </button>

                {campaign.image_url ? (
                    <div className="relative w-full">
                        <div className="aspect-[4/5] w-full overflow-hidden">
                            <img 
                                src={campaign.image_url} 
                                alt={campaign.name} 
                                className="w-full h-full object-cover"
                                loading="eager"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <SparklesIcon className="w-5 h-5 text-amber-400" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-90">Destaque Purpose</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-2 leading-tight">{campaign.name}</h2>
                            <p className="text-sm opacity-90 leading-relaxed mb-4">{campaign.message}</p>
                            <button 
                                onClick={handleMainAction}
                                className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold py-3.5 rounded-2xl transition-all shadow-xl active:scale-95"
                            >
                                Aproveitar Oferta
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-10 text-center">
                        <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <SparklesIcon className="w-12 h-12 text-sky-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">{campaign.name}</h2>
                        <p className="text-slate-600 leading-relaxed mb-8">{campaign.message}</p>
                        <button 
                            onClick={onClose}
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-95"
                        >
                            Entendido!
                        </button>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up {
                    animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
};