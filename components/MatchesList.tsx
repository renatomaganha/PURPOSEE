import React from 'react';
import { UserProfile } from '../types';
import { MapPinIcon } from './icons/MapPinIcon';
import { XIcon } from './icons/XIcon';
import { HeartIcon } from './icons/HeartIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { useLanguage } from '../contexts/LanguageContext';


interface MatchesListProps {
  matches: UserProfile[];
  superLikedBy: string[];
  onConfirmMatch: (user: UserProfile) => void;
  onRemoveMatch: (userId: string) => void;
  onViewProfile: (user: UserProfile) => void;
  onGoToSales: () => void;
  currentUserProfile: UserProfile;
}

/**
 * Calcula a distância em km entre duas coordenadas geográficas usando a fórmula de Haversine.
 */
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return Math.round(distance);
}


export const MatchesList: React.FC<MatchesListProps> = ({ matches, superLikedBy, onConfirmMatch, onRemoveMatch, onViewProfile, onGoToSales, currentUserProfile }) => {
  const isPremium = currentUserProfile.isPremium;
  const { t } = useLanguage();

  return (
    <div className="p-4">
      {!isPremium && (
          <div className="mb-4 p-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg shadow-lg text-center">
              <h3 className="font-bold text-lg">{t('unlockLikes')}</h3>
              <p className="text-sm mt-1 mb-3">{t('unlockLikesDesc')}</p>
              <button onClick={onGoToSales} className="bg-white text-amber-700 font-bold py-2 px-6 rounded-full shadow-md hover:bg-amber-100 transition-colors">
                  {t('becomePremium')}
              </button>
          </div>
      )}
      {matches.length === 0 ? (
        <div className="text-center text-slate-500 pt-16">
          <p>{t('noLikesYet')}</p>
          <p className="text-sm">{t('noLikesYetDesc')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => {
            const isSuperLike = superLikedBy.includes(match.id);
            const canView = isPremium || isSuperLike;

            const distance = (currentUserProfile.latitude && currentUserProfile.longitude && match.latitude && match.longitude)
              ? getDistance(currentUserProfile.latitude, currentUserProfile.longitude, match.latitude, match.longitude)
              : null;

            return (
            <div
              key={match.id}
              className={`bg-white rounded-xl shadow p-3 flex items-center space-x-4 transition-all ${isSuperLike ? 'border-2 border-sky-400' : ''}`}
            >
              <img 
                src={match.photos[0]} 
                alt={canView ? match.name : "Perfil de usuário que te curtiu"} 
                className={`w-16 h-16 rounded-full object-cover border-2 border-slate-200 transition-all duration-300 ${!canView ? 'blur-md' : ''}`}
              />
              <div className="flex-grow">
                <h3 className={`font-bold text-slate-800 text-lg transition-all duration-300 ${!canView ? 'blur-sm select-none' : ''}`}>
                   {isSuperLike && canView && <span className="mr-2" role="img" aria-label="Super Conexão">💫</span>}
                  {canView ? `${match.name}, ` : t('someoneLikedYou')}
                  {canView && <span className="font-normal text-slate-600">{match.age}</span>}
                </h3>
                {isSuperLike && canView && (
                    <div className="mt-1 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-fuchsia-500">
                        {t('sentSuperLike')}
                    </div>
                )}
                <div className={`flex items-center text-sm text-slate-500 mt-1 transition-all duration-300 ${!canView ? 'blur-sm select-none' : ''}`}>
                  <MapPinIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                  <span>
                    {canView && distance !== null 
                      ? t('distanceAway', { distance }) 
                      : canView 
                      ? match.location // Fallback para o nome da cidade se as coordenadas faltarem
                      : t('locationHidden')
                    }
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                 <button 
                    onClick={() => onRemoveMatch(match.id)} 
                    disabled={!canView}
                    className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-200 disabled:hover:text-slate-600"
                    aria-label="Recusar curtida"
                  >
                    <XIcon className="w-5 h-5" />
                </button>
                 <button 
                    onClick={() => onViewProfile(match)} 
                    disabled={!canView}
                    className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center hover:bg-sky-100 hover:text-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-200 disabled:hover:text-slate-600"
                    aria-label="Ver perfil"
                  >
                    <UserCircleIcon className="w-6 h-6" />
                </button>
                <button 
                    onClick={() => onConfirmMatch(match)} 
                    disabled={!canView}
                    className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-500"
                    aria-label="Curtir de volta"
                >
                    <HeartIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
};