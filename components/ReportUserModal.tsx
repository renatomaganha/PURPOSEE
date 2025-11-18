import React, { useState, useRef, useEffect } from 'react';
// FIX: Import ReportReason from types.ts to centralize type definitions.
import { UserProfile, ReportReason } from '../types';
import { FlagIcon } from './icons/FlagIcon';
import { XIcon } from './icons/XIcon';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';
import { PaperClipIcon } from './icons/PaperClipIcon';
import { useToast } from '../contexts/ToastContext';

// FIX: Removed the duplicate ReportReason type. It is now imported from types.ts.

const reportReasons: ReportReason[] = [
    'Perfil Falso/Spam',
    'Fotos Inapropriadas',
    'Assédio ou Ofensas',
    'Menor de Idade',
    'Golpe/Fraude',
    'Outro',
];

interface ReportUserModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSubmit: (reason: ReportReason, details: string, files: File[]) => Promise<boolean>;
}

type ReportStep = 'form' | 'submitting' | 'success';

export const ReportUserModal: React.FC<ReportUserModalProps> = ({ profile, onClose, onSubmit }) => {
    const [step, setStep] = useState<ReportStep>('form');
    const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
    const [details, setDetails] = useState('');
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToast();

    useEffect(() => {
        // Cleanup object URLs on unmount to prevent memory leaks
        return () => {
            previews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previews]);

    const updatePreviews = (currentFiles: File[]) => {
        // Revoke old previews before creating new ones
        previews.forEach(url => URL.revokeObjectURL(url));
        const newPreviews = currentFiles.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => {
                const updatedFiles = [...prev, ...newFiles].slice(0, 3);
                updatePreviews(updatedFiles);
                return updatedFiles;
            });
        }
    };

    const removeFile = (indexToRemove: number) => {
        setFiles(prev => {
            const updatedFiles = prev.filter((_, index) => index !== indexToRemove);
            updatePreviews(updatedFiles);
            return updatedFiles;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedReason) {
            addToast({ type: 'error', message: 'Por favor, selecione um motivo para a denúncia.' });
            return;
        }
        setStep('submitting');
        const success = await onSubmit(selectedReason, details, files);
        if (success) {
            setStep('success');
            // Do not auto-close here, App.tsx handles closing after success logic.
        } else {
            setStep('form'); // Volta ao formulário em caso de erro no envio
        }
    };
    
    const renderContent = () => {
        switch (step) {
            case 'submitting':
                return (
                    <div className="flex flex-col items-center justify-center h-64">
                         <div className="w-12 h-12 border-4 border-t-sky-500 border-slate-200 rounded-full animate-spin"></div>
                         <p className="mt-4 text-slate-600 font-semibold">Enviando denúncia...</p>
                    </div>
                );
            case 'success':
                return (
                     <div className="flex flex-col items-center justify-center h-64 text-center">
                         <CheckBadgeIcon className="w-20 h-20 text-green-500 mb-4" />
                         <h2 className="text-2xl font-bold text-slate-800">Denúncia Enviada</h2>
                         <p className="mt-2 text-slate-600">Agradecemos por nos ajudar a manter a comunidade segura. Nossa equipe analisará o caso.</p>
                    </div>
                );
            case 'form':
                return (
                    <form onSubmit={handleSubmit}>
                        <div className="text-center mb-6">
                            <FlagIcon className="w-12 h-12 mx-auto text-amber-500 mb-3" />
                            <h2 className="text-2xl font-bold text-slate-800">Denunciar {profile.name}</h2>
                            <p className="text-sm text-slate-500 mt-1">Sua denúncia é anônima. Ajude-nos a entender o problema.</p>
                        </div>

                        <div className="space-y-2 mb-4">
                            {reportReasons.map(reason => (
                                <button
                                    type="button"
                                    key={reason}
                                    onClick={() => setSelectedReason(reason)}
                                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${selectedReason === reason ? 'bg-sky-100 border-sky-500 font-semibold' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                                >
                                    {reason}
                                </button>
                            ))}
                        </div>

                        {(selectedReason === 'Outro' || selectedReason === 'Assédio ou Ofensas' || selectedReason === 'Fotos Inapropriadas') && (
                             <div>
                                <label htmlFor="details" className="block text-sm font-medium text-slate-700 mb-1">
                                    Por favor, forneça mais detalhes:
                                </label>
                                <textarea
                                    id="details"
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    rows={3}
                                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none"
                                    placeholder="Qualquer informação adicional nos ajuda a analisar o caso."
                                />
                            </div>
                        )}

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Anexar evidências (prints, etc.)
                            </label>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={files.length >= 3}
                                    className="flex items-center gap-2 px-3 py-2 border border-slate-300 rounded-md text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <PaperClipIcon className="w-4 h-4" />
                                    Adicionar Imagem
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    multiple
                                    accept="image/png, image/jpeg, image/gif"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                                <span className="text-xs text-slate-500">Até 3 imagens</span>
                            </div>

                            {previews.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {previews.map((previewUrl, index) => (
                                        <div key={index} className="relative w-16 h-16">
                                            <img
                                                src={previewUrl}
                                                alt={`preview ${index}`}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5 shadow-md"
                                                aria-label="Remover imagem"
                                            >
                                                <XIcon className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-6 flex flex-col gap-3">
                             <button
                                type="submit"
                                disabled={!selectedReason}
                                className="w-full bg-amber-500 text-white font-bold py-3 rounded-full hover:bg-amber-600 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                            >
                                Enviar Denúncia
                            </button>
                             <button
                                type="button"
                                onClick={onClose}
                                className="w-full bg-slate-200 text-slate-800 font-bold py-2 rounded-full hover:bg-slate-300 transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                );
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={step === 'form' ? onClose : undefined}
        >
          <div 
            className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
             {step === 'form' && (
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <XIcon className="w-6 h-6" />
                </button>
             )}
            <div className="overflow-y-auto">
                {renderContent()}
            </div>
          </div>
        </div>
    );
};