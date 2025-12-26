import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { VerifiedBadgeIcon } from './icons/VerifiedBadgeIcon';
import { HeartIcon } from './icons/HeartIcon';
import { XIcon } from './icons/XIcon';
import { UserMinusIcon } from './icons/UserMinusIcon';
import { FlagIcon } from './icons/FlagIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface ProfileDetailModalProps {
  profile: UserProfile;
  onClose: () => void;
  onConfirmMatch: () => void;
  onRemoveMatch: () => void;
  onBlock: () => void;
  onReport: () => void;
  onUnmatch?: () => void;
  onChat?: () => void;
  distance: number | null;
  matchReason?: string;
  isMutualMatch?: boolean;
}

// Subcomponente reutilizado do ProfileCard
const InfoPill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="bg-sky-100 text-sky-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-1 rounded-full">
    {children}
  </span>
);

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({ 
    profile, 
    onClose, 
    onConfirmMatch, 
    onRemoveMatch, 
    onBlock, 
    onReport, 
    onUnmatch,
    onChat,
    distance, 
    matchReason,
    isMutualMatch = false
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const { t } = useLanguage();

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % profile.photos.length);
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + profile.photos.length) % profile.photos.length);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-end">
      <div className="bg-white w-full h-[90vh] max-h-[700px] rounded-t-2xl flex flex-col animate-slide-up">
        <div className="flex-shrink-0 relative w-full h-1/2">
            <img
                src={profile.photos[photoIndex] || ''}
                alt={profile.name}
                className="w-full h-full object-cover rounded-t-2xl"
            />
             {/* Navegação de Fotos (barras no topo) */}
            <div className="absolute top-2 left-2 right-2 flex space-x-1">
                {profile.photos.filter(p => !!p).map((_, index) => (
                    <div key={index} className={`h-1 flex-1 rounded-full ${index === photoIndex ? 'bg-white' : 'bg-white/50'}`}></div>
                ))}
            </div>
             {/* Áreas de clique para trocar de foto */}
            {profile.photos.filter(p => !!p).length > 1 && (
            <>
                <div className="absolute top-0 left-0 h-full w-1/2" onClick={prevPhoto}></div>
                <div className="absolute top-0 right-0 h-full w-1/2" onClick={nextPhoto}></div>
            </>
            )}
            <button onClick={onClose} className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-1.5 z-10">
                <ChevronDownIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="overflow-y-auto p-4 flex-grow">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                {profile.name}, <span className="font-light">{profile.age}</span>
                {profile.isVerified && <VerifiedBadgeIcon className="w-6 h-6 ml-2 text-sky-500" />}
            </h2>
            <p className="text-sm text-slate-500 mb-3">
                {distance !== null 
                    ? t('distanceAway', { distance }) 
                    : (profile.location !== t('locationObtained') ? profile.location : '')}
            </p>
             {matchReason && (
                <div className="mb-3 flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full w-fit">
                    <SparklesIcon className="w-4 h-4 text-amber-600" />
                    <span>{matchReason}</span>
                </div>
            )}
            <p className="text-slate-700 text-sm mb-4">{profile.bio}</p>

            <div className="border-t border-slate-200 pt-3">
            <h3 className="text-sm font-bold text-sky-800 mb-2">Valores e Fé</h3>
            <div className="flex flex-wrap">
                <InfoPill>{profile.denomination}</InfoPill>
                <InfoPill>Igreja: {profile.churchFrequency}</InfoPill>
                {profile.keyValues.map((value) => (
                <InfoPill key={value}>{value}</InfoPill>
                ))}
            </div>
            </div>

            {(profile.churchName || profile.favoriteSong || profile.favoriteVerse || profile.favoriteBook) && (
                <div className="border-t border-slate-200 pt-3 mt-3">
                    <h3 className="text-sm font-bold text-sky-800 mb-2">Detalhes da Fé</h3>
                    <ul className="space-y-2 text-sm text-slate-700">
                        {profile.churchName && <li><strong>Igreja:</strong> {profile.churchName}</li>}
                        {profile.favoriteSong && <li><strong>Música Favorita:</strong> {profile.favoriteSong}</li>}
                        {profile.favoriteVerse && <li><strong>Versículo Favorito:</strong> {profile.favoriteVerse}</li>}
                        {profile.favoriteBook && <li><strong>Livro Favorito:</strong> {profile.favoriteBook}</li>}
                    </ul>
                </div>
            )}

            <div className="border-t border-slate-200 pt-3 mt-3">
            <h3 className="text-sm font-bold text-sky-800 mb-2">Interesses</h3>
            <div className="flex flex-wrap">
                {profile.interests.map((interest) => (
                <InfoPill key={interest}>{interest}</InfoPill>
                ))}
            </div>
            </div>
            
            <div className="pt-6 mt-4 text-center flex flex-wrap justify-center gap-4">
                 {isMutualMatch && (
                     <button className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg" onClick={onUnmatch}>
                        <XIcon className="w-4 h-4" /> Desfazer Match
                     </button>
                 )}
                 <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600 px-3 py-2 rounded-lg" onClick={onBlock}>
                     <UserMinusIcon className="w-4 h-4" /> Bloquear {profile.name}
                 </button>
                 <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-amber-600 px-3 py-2 rounded-lg" onClick={onReport}>
                     <FlagIcon className="w-4 h-4" /> Denunciar
                 </button>
             </div>
        </div>

         {/* Barra de Ação Fixa */}
        <div className="bg-white p-4 border-t border-slate-200 flex justify-center items-center gap-x-4 sticky bottom-0 flex-shrink-0">
            {isMutualMatch ? (
                <button
                    onClick={onChat}
                    className="w-full bg-sky-600 text-white font-bold py-3.5 rounded-2xl shadow-lg hover:bg-sky-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    <ChatBubbleIcon className="w-5 h-5" />
                    Enviar Mensagem
                </button>
            ) : (
                <>
                    <button
                        onClick={onRemoveMatch}
                        className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 border-2 border-slate-200 hover:scale-110 transition-transform"
                        aria-label="Recusar"
                    >
                        <XIcon className="w-8 h-8"/>
                    </button>
                    <button
                        onClick={onConfirmMatch}
                        className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center text-green-500 border-2 border-slate-200 hover:scale-110 transition-transform"
                        aria-label="Curtir de volta"
                    >
                        <HeartIcon className="w-10 h-10"/>
                    </button>
                </>
            )}
        </div>

      </div>
       <style>{`
            @keyframes slide-up {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
            .animate-slide-up {
                animation: slide-up 0.3s ease-out;
            }
        `}</style>
    </div>
  );
};