import React from 'react';
import { VerifiedBadgeIcon } from './icons/VerifiedBadgeIcon';
import { XIcon } from './icons/XIcon';

interface FaceVerificationModalProps {
    onClose: () => void;
    onStartVerification: () => void;
}

export const FaceVerificationModal: React.FC<FaceVerificationModalProps> = ({ onClose, onStartVerification }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-slate-800 relative text-center"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <XIcon className="w-6 h-6" />
                </button>
                <VerifiedBadgeIcon className="w-20 h-20 mx-auto text-sky-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Verifique seu Perfil</h2>
                <p className="text-sm text-slate-600 mb-6">
                    Ganhe um selo de verificação e mostre para a comunidade que você é real. Perfis verificados geram mais confiança e recebem mais conexões.
                </p>
                <p className="text-xs text-slate-500 mb-6">
                    Você precisará tirar uma selfie rápida para compararmos com sua foto de perfil principal.
                </p>
                <button
                    onClick={onStartVerification}
                    className="w-full bg-sky-600 text-white font-bold py-3 rounded-full hover:bg-sky-700 transition-colors"
                >
                    Iniciar Verificação
                </button>
            </div>
        </div>
    );
};