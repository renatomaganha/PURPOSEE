import React from 'react';
import { UserProfile } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface MatchModalProps {
  matchedUser: UserProfile;
  currentUserPhoto: string;
  onClose: () => void;
  onStartChat: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({ matchedUser, currentUserPhoto, onClose, onStartChat }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-sky-500 to-sky-700 text-white rounded-2xl shadow-2xl w-full max-w-sm text-center p-8 relative transform transition-all scale-100 opacity-100">
        <SparklesIcon className="w-16 h-16 text-amber-300 mx-auto mb-4" />
        <h2 className="text-4xl font-bold mb-2">{t('itsAMatch')}</h2>
        <p className="text-lg opacity-90 mb-6">{t('youAndUserMatched', { name: matchedUser.name })}</p>

        <div className="flex justify-center items-center space-x-[-20px] mb-8">
          <img src={currentUserPhoto} alt="Você" className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"/>
          <img src={matchedUser.photos[0]} alt={matchedUser.name} className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"/>
        </div>

        <button
          onClick={onStartChat}
          className="w-full bg-white text-sky-700 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-slate-200 transition-transform transform hover:scale-105 mb-3"
        >
          {t('sendMessage')}
        </button>
        <button
          onClick={onClose}
          className="w-full bg-transparent text-white font-semibold py-2 px-6 rounded-full hover:bg-white/20 transition"
        >
          {t('keepSwiping')}
        </button>
      </div>
    </div>
  );
};