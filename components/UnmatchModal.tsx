import React from 'react';
import { UserProfile } from '../types';
import { UserMinusIcon } from './icons/UserMinusIcon';
import { XIcon } from './icons/XIcon';

export type UnmatchMode = 'unmatch' | 'revoke' | 'reject';

interface UnmatchModalProps {
  profile: UserProfile;
  onClose: () => void;
  onConfirm: () => void;
  mode: UnmatchMode;
}

export const UnmatchModal: React.FC<UnmatchModalProps> = ({ profile, onClose, onConfirm, mode }) => {
  
  const getContent = () => {
      switch (mode) {
          case 'unmatch':
              return {
                  title: `Desfazer Match com ${profile.name}?`,
                  description: "Ao desfazer o match, vocês não poderão mais trocar mensagens e o perfil desaparecerá da sua lista de conversas. Essa ação não pode ser desfeita.",
                  buttonText: "Sim, Desfazer Match"
              };
          case 'revoke':
              return {
                  title: `Cancelar curtida para ${profile.name}?`,
                  description: "A pessoa não receberá mais sua notificação de curtida. Você terá que aguardar o perfil aparecer novamente para curtir.",
                  buttonText: "Sim, Cancelar Curtida"
              };
          case 'reject':
              return {
                  title: `Recusar curtida de ${profile.name}?`,
                  description: "Este perfil será removido da sua lista de curtidas recebidas. Você não verá mais esta notificação.",
                  buttonText: "Sim, Recusar"
              };
      }
  };

  const content = getContent();

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
            {content.title}
        </h2>
        
        <p className="text-sm text-slate-600 mb-6">
            {content.description}
        </p>

        <div className="flex flex-col gap-3">
             <button
                onClick={onConfirm}
                className="w-full bg-red-600 text-white font-bold py-3 rounded-full hover:bg-red-700 transition-colors"
            >
                {content.buttonText}
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