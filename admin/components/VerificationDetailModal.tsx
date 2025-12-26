import React, { useState } from 'react';
import { FaceVerification, VerificationStatus } from '../types';
import { XIcon } from '../../components/icons/XIcon';
import { CheckIcon } from '../icons/CheckIcon';

interface VerificationDetailModalProps {
    verification: FaceVerification;
    onClose: () => void;
    onUpdateStatus: (verificationId: string, newStatus: VerificationStatus) => Promise<void>;
}

export const VerificationDetailModal: React.FC<VerificationDetailModalProps> = ({ verification, onClose, onUpdateStatus }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const isPending = verification.status === VerificationStatus.PENDING;

    const statusStyles: Record<VerificationStatus, string> = {
        [VerificationStatus.PENDING]: 'bg-amber-100 text-amber-800',
        [VerificationStatus.VERIFIED]: 'bg-green-100 text-green-800',
        [VerificationStatus.REJECTED]: 'bg-red-100 text-red-800',
        [VerificationStatus.NOT_VERIFIED]: 'bg-slate-100 text-slate-800',
    };

    const handleAction = async (status: VerificationStatus) => {
        setIsProcessing(true);
        try {
            await onUpdateStatus(verification.id, status);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col p-8 text-slate-800 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{isPending ? 'Revisar' : 'Detalhes da'} Verificação Facial</h2>
                <p className="text-sm text-slate-500 mb-6">
                    Usuário: <span className="font-semibold">{verification.user_name}</span> | Solicitado em: {new Date(verification.created_at).toLocaleString('pt-BR')}
                </p>

                <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2">
                    <div className="flex flex-col items-center">
                        <h3 className="font-bold text-lg mb-2">Foto de Perfil Principal</h3>
                        <img 
                            src={verification.profile_photo_url} 
                            alt="Foto de perfil" 
                            className="w-full aspect-square object-cover rounded-lg shadow-md border-2 border-slate-200"
                        />
                    </div>
                     <div className="flex flex-col items-center">
                        <h3 className="font-bold text-lg mb-2">Selfie de Verificação</h3>
                        <img 
                            src={verification.selfie_photo_url} 
                            alt="Selfie de verificação"
                            className="w-full aspect-square object-cover rounded-lg shadow-md border-2 border-slate-200"
                        />
                    </div>
                </div>

                {isPending ? (
                    <div className="mt-6 pt-6 border-t flex items-center justify-end gap-4">
                        <p className="text-sm font-semibold mr-auto text-slate-600">As fotos correspondem à mesma pessoa?</p>
                        <button 
                            disabled={isProcessing}
                            onClick={() => handleAction(VerificationStatus.REJECTED)}
                            className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg text-sm hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
                        >
                            {isProcessing ? <div className="w-5 h-5 border-2 border-t-white border-white/30 rounded-full animate-spin"></div> : <XIcon className="w-5 h-5"/>}
                            Rejeitar
                        </button>
                        <button 
                            disabled={isProcessing}
                            onClick={() => handleAction(VerificationStatus.VERIFIED)}
                            className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg text-sm hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
                        >
                            {isProcessing ? <div className="w-5 h-5 border-2 border-t-white border-white/30 rounded-full animate-spin"></div> : <CheckIcon className="w-5 h-5"/>}
                            Aprovar
                        </button>
                    </div>
                ) : (
                    <div className="mt-6 pt-4 border-t text-sm text-slate-600 space-y-1">
                        <div className="flex items-center gap-2">
                            <span>Status Final:</span>
                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${statusStyles[verification.status]}`}>
                                {verification.status}
                            </span>
                        </div>
                        <p>Revisado por: <span className="font-bold">{verification.reviewed_by || 'N/A'}</span></p>
                        {verification.reviewed_at && <p>Data da Revisão: <span className="font-bold">{new Date(verification.reviewed_at).toLocaleString('pt-BR')}</span></p>}
                    </div>
                )}
            </div>
        </div>
    );
};