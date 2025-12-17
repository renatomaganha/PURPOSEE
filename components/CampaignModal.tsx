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
}

export const CampaignModal: React.FC<CampaignModalProps> = ({ campaign, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative animate-pop"
                onClick={e => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-1 transition-colors"
                >
                    <XIcon className="w-6 h-6" />
                </button>

                {campaign.image_url ? (
                    <div className="relative aspect-[4/5] w-full">
                        <img 
                            src={campaign.image_url} 
                            alt={campaign.name} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <SparklesIcon className="w-5 h-5 text-amber-400" />
                                <span className="text-xs font-bold uppercase tracking-wider opacity-80">Novidade</span>
                            </div>
                            <h2 className="text-xl font-bold mb-2">{campaign.name}</h2>
                            <p className="text-sm opacity-90 leading-relaxed">{campaign.message}</p>
                            <button 
                                onClick={onClose}
                                className="w-full mt-4 bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg"
                            >
                                Aproveitar Agora
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <SparklesIcon className="w-10 h-10 text-sky-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">{campaign.name}</h2>
                        <p className="text-slate-600 leading-relaxed mb-6">{campaign.message}</p>
                        <button 
                            onClick={onClose}
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 rounded-xl transition-all shadow-md"
                        >
                            Entendido!
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};