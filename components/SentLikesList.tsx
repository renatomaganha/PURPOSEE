import React from 'react';
import { UserProfile } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { XIcon } from './icons/XIcon';

interface SentLikesListProps {
  sentLikes: UserProfile[];
  onViewProfile: (user: UserProfile) => void;
  onRevokeLike: (user: UserProfile) => void;
}

export const SentLikesList: React.FC<SentLikesListProps> = ({ sentLikes, onViewProfile, onRevokeLike }) => {
    const { t } = useLanguage();

    if (sentLikes.length === 0) {
        return (
            <div className="text-center text-slate-500 pt-16 px-4">
                <p className="font-semibold">{t('noLikesSent')}</p>
                <p className="text-sm mt-1">{t('noLikesSentDesc')}</p>
            </div>
        );
    }

    return (
        <div className="p-4">
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {sentLikes.map((profile) => (
                    <div 
                        key={profile.id}
                        className="relative aspect-square bg-slate-200 rounded-lg overflow-hidden group shadow-sm"
                    >
                        <img 
                            src={profile.photos[0]}
                            alt={profile.name}
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => onViewProfile(profile)}
                        />
                         <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
                            <p className="text-white font-bold text-sm truncate">{profile.name}, {profile.age}</p>
                        </div>
                        
                        {/* Botão de Cancelar Curtida */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRevokeLike(profile);
                            }}
                            className="absolute top-2 right-2 bg-white rounded-full p-2 text-red-500 hover:bg-red-50 transition-colors shadow-md z-10 transform hover:scale-105"
                            aria-label="Cancelar curtida"
                        >
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};