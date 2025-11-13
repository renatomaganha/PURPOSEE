

import React from 'react';
import { UserProfile } from '../types';
import { UserMinusIcon } from './icons/UserMinusIcon';

interface BlockUserModalProps {
  profile: UserProfile;
  onClose: () => void;
  onConfirm: () => void;
}

export const BlockUserModal: React.FC<BlockUserModalProps> = ({ profile, onClose, onConfirm }) => {
  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-slate-800 relative text-center"
        onClick={e => e.stopPropagation()}
      >
        <UserMinusIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Bloquear {profile.name}?</h2>
        <p className="text-sm text-slate-600 mb-6">
            Vocês não verão mais o perfil um do outro e não poderão enviar mensagens. Esta ação pode ser desfeita na tela de Ajustes.
        </p>
        <div className="flex flex-col gap-3">
             <button
                onClick={onConfirm}
                className="w-full bg-red-600 text-white font-bold py-3 rounded-full hover:bg-red-700 transition-colors"
            >
                Confirmar Bloqueio
            </button>
             <button
                onClick={onClose}
                className="w-full bg-slate-200 text-slate-800 font-bold py-3 rounded-full hover:bg-slate-300 transition-colors"
            >
                Cancelar
            </button>
        </div>
      </div>
    </div>
  );
};