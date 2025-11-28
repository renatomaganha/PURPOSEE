import React from 'react';
import { BellAlertIcon } from './icons/BellAlertIcon';
import { XIcon } from './icons/XIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface NotificationPermissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAllow: () => void;
}

export const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({ isOpen, onClose, onAllow }) => {
    const { t } = useLanguage();

    if (!isOpen) {
        return null;
    }

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
                <BellAlertIcon className="w-16 h-16 mx-auto text-sky-500 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Ativar Notificações?</h2>
                <p className="text-sm text-slate-600 mb-6">
                    Receba alertas em tempo real sobre novas mensagens e matches para não perder nenhuma conexão importante.
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onAllow}
                        className="w-full bg-sky-600 text-white font-bold py-3 rounded-full hover:bg-sky-700 transition-colors"
                    >
                        Permitir Notificações
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-slate-200 text-slate-800 font-bold py-3 rounded-full hover:bg-slate-300 transition-colors"
                    >
                        Agora Não
                    </button>
                </div>
            </div>
        </div>
    );
};