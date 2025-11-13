import React from 'react';
import { UserProfile } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SentLikesListProps {
  sentLikes: UserProfile[];
  onViewProfile: (user: UserProfile) => void;
}

export const SentLikesList: React.FC<SentLikesListProps> = ({ sentLikes, onViewProfile }) => {
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
                        onClick={() => onViewProfile(profile)}
                        className="relative aspect-square bg-slate-200 rounded-lg overflow-hidden cursor-pointer group"
                    >
                        <img 
                            src={profile.photos[0]}
                            alt={profile.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                         <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
                            <p className="text-white font-bold text-sm truncate">{profile.name}, {profile.age}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
