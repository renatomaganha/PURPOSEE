import React from 'react';
import { UserProfile } from '../types';
import { StarIcon } from './icons/StarIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface FavoritesListProps {
  favorites: UserProfile[];
  onViewProfile: (user: UserProfile) => void;
  onRemoveFavorite: (user: UserProfile) => void;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onViewProfile, onRemoveFavorite }) => {
    const { t } = useLanguage();

    if (favorites.length === 0) {
        return (
            <div className="text-center text-slate-500 pt-16 px-4">
                <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <StarIcon className="w-8 h-8 text-amber-500" />
                </div>
                <p className="font-semibold text-lg">Nenhum favorito ainda</p>
                <p className="text-sm mt-1">Toque na estrela no perfil de alguém para adicioná-lo aqui e não perdê-lo de vista.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
             <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {favorites.map((profile) => (
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
                        
                        {/* Botão de Remover Favorito */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFavorite(profile);
                            }}
                            className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 text-amber-400 hover:text-slate-400 hover:bg-white transition-colors shadow-md z-10 transform hover:scale-105"
                            aria-label="Remover dos favoritos"
                            title="Remover dos favoritos"
                        >
                            <StarIcon className="w-5 h-5 fill-current" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};