import React from 'react';
import { BoltIcon } from './icons/BoltIcon';
import { XIcon } from './icons/XIcon';

interface BoostConfirmationModalProps {
  onClose: () => void;
  onConfirm: () => void;
  boostCount: number;
}

export const BoostConfirmationModal: React.FC<BoostConfirmationModalProps> = ({ onClose, onConfirm, boostCount }) => {
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
        <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <BoltIcon className="w-10 h-10 text-amber-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Ativar Impulso?</h2>
        <p className="text-sm text-slate-600 mb-6">
            Você tem <strong>{boostCount} Impulso{boostCount !== 1 ? 's' : ''} disponível{boostCount !== 1 ? 's' : ''}</strong>.
            Seu perfil ficará no topo das pesquisas por 60 minutos.
        </p>
        <div className="flex flex-col gap-3">
             <button
                onClick={onConfirm}
                className="w-full bg-amber-500 text-white font-bold py-3 rounded-full hover:bg-amber-600 transition-colors"
            >
                Iniciar Impulso
            </button>
             <button
                onClick={onClose}
                className="w-full bg-slate-200 text-slate-800 font-bold py-3 rounded-full hover:bg-slate-300 transition-colors"
            >
                Talvez Mais Tarde
            </button>
        </div>
      </div>
    </div>
  );
};