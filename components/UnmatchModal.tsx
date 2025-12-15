import React from 'react';
import { UserProfile } from '../types';
import { UserMinusIcon } from './icons/UserMinusIcon';
import { XIcon } from './icons/XIcon';

interface UnmatchModalProps {
  profile: UserProfile;
  onClose: () => void;
  onConfirm: () => void;
  isMutual: boolean; // True se for desfazer match, False se for cancelar curtida enviada
}

export const UnmatchModal: React.FC<UnmatchModalProps> = ({ profile, onClose, onConfirm, isMutual }) => {
  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-slate-800 relative text-center animate-pop"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <XIcon className="w-6 h-6" />
        </button>
        
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserMinusIcon className="w-8 h-8 text-red-500" />
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-2">
            {isMutual ? `Desfazer Match com ${profile.name}?` : `Cancelar curtida para ${profile.name}?`}
        </h2>
        
        <p className="text-sm text-slate-600 mb-6">
            {isMutual 
                ? "Ao desfazer o match, vocês não poderão mais trocar mensagens e o perfil desaparecerá da sua lista de conversas. Essa ação não pode ser desfeita."
                : "A pessoa não receberá mais sua notificação de curtida. Você terá que aguardar o perfil aparecer novamente para curtir."
            }
        </p>

        <div className="flex flex-col gap-3">
             <button
                onClick={onConfirm}
                className="w-full bg-red-600 text-white font-bold py-3 rounded-full hover:bg-red-700 transition-colors"
            >
                {isMutual ? "Sim, Desfazer Match" : "Sim, Cancelar Curtida"}
            </button>
             <button
                onClick={onClose}
                className="w-full bg-slate-200 text-slate-800 font-bold py-3 rounded-full hover:bg-slate-300 transition-colors"
            >
                Voltar
            </button>
        </div>
      </div>
    </div>
  );
};