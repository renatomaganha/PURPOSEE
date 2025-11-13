import React from 'react';
import { UserProfile } from '../types';
import { BoltIcon } from './icons/BoltIcon';
import { ClockIcon } from './icons/ClockIcon';

interface PeakTimeModalProps {
  userProfile: UserProfile;
  onClose: () => void;
  onActivateBoost: () => void;
  onGoToPremium: () => void;
}

export const PeakTimeModal: React.FC<PeakTimeModalProps> = ({ userProfile, onClose, onActivateBoost, onGoToPremium }) => {
  const isPremiumWithBoosts = userProfile.isPremium && (userProfile.boostsRemaining ?? 0) > 0;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-slate-800 relative text-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="mx-auto w-16 h-16 rounded-full bg-sky-100 flex items-center justify-center mb-4">
            <ClockIcon className="w-10 h-10 text-sky-500" />
        </div>
        
        {isPremiumWithBoosts ? (
            <>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">É Horário de Pico!</h2>
                <p className="text-sm text-slate-600 mb-6">
                    Aproveite a maior atividade no app! Use um dos seus <strong>{userProfile.boostsRemaining} Impulsos</strong> para ser visto(a) por mais pessoas e aumentar suas chances de conexão.
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onActivateBoost}
                        className="w-full bg-amber-500 text-white font-bold py-3 rounded-full hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <BoltIcon className="w-5 h-5"/>
                        Iniciar Impulso
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-slate-200 text-slate-800 font-bold py-3 rounded-full hover:bg-slate-300 transition-colors"
                    >
                        Agora Não
                    </button>
                </div>
            </>
        ) : (
             <>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Aproveite o Horário de Pico!</h2>
                <p className="text-sm text-slate-600 mb-6">
                    O app está com mais pessoas ativas agora! Assine o Premium para usar o <strong>Impulso</strong>, ficar no topo das pesquisas por 60 minutos e multiplicar suas chances de match.
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={onGoToPremium}
                        className="w-full bg-sky-600 text-white font-bold py-3 rounded-full hover:bg-sky-700 transition-colors"
                    >
                        Seja Premium
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full bg-slate-200 text-slate-800 font-bold py-3 rounded-full hover:bg-slate-300 transition-colors"
                    >
                        Agora Não
                    </button>
                </div>
            </>
        )}
      </div>
    </div>
  );
};