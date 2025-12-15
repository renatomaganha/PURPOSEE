import React from 'react';
import { UserProfile } from '../types';
import { MatchesList } from './MatchesList';
import { SentLikesList } from './SentLikesList';
import { MutualMatchesList } from './MutualMatchesList';
import { FavoritesList } from './FavoritesList';
import { useLanguage } from '../contexts/LanguageContext';

interface LikesScreenProps {
  receivedLikes: UserProfile[];
  sentLikes: UserProfile[];
  mutualMatches: UserProfile[];
  favoriteProfiles: UserProfile[]; // Nova prop
  superLikedBy: string[];
  currentUserProfile: UserProfile;
  onConfirmMatch: (user: UserProfile) => void;
  onRemoveMatch: (user: UserProfile) => void;
  onRevokeLike: (user: UserProfile) => void;
  onUnmatch: (user: UserProfile) => void;
  onRemoveFavorite: (user: UserProfile) => void; // Nova prop
  onViewProfile: (user: UserProfile) => void;
  onGoToSales: () => void;
  activeTab: 'received' | 'sent' | 'matches' | 'favorites'; // Tipo atualizado
  onTabChange: (tab: 'received' | 'sent' | 'matches' | 'favorites') => void; // Tipo atualizado
  onChat: (user: UserProfile) => void;
}

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; badge?: number }> = ({ label, isActive, onClick, badge }) => (
    <button
        onClick={onClick}
        className={`flex-1 pb-3 font-bold text-center transition-colors duration-200 text-sm sm:text-base relative ${
            isActive 
                ? 'text-sky-600 border-b-2 border-sky-600' 
                : 'text-slate-500 hover:text-slate-800'
        }`}
    >
        {label}
        {badge && badge > 0 ? (
            <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        ) : null}
    </button>
);

export const LikesScreen: React.FC<LikesScreenProps> = (props) => {
    const { t } = useLanguage();
    const { 
        receivedLikes, 
        sentLikes,
        mutualMatches,
        favoriteProfiles,
        superLikedBy, 
        currentUserProfile, 
        onConfirmMatch, 
        onRemoveMatch,
        onRevokeLike,
        onUnmatch,
        onRemoveFavorite,
        onViewProfile,
        onGoToSales,
        activeTab,
        onTabChange,
        onChat
    } = props;

    return (
        <div className="bg-slate-100 min-h-full flex flex-col">
            <header className="bg-white p-4 shadow-sm sticky top-0 z-10">
                <h1 className="text-3xl font-bold text-slate-800">{t('likes')}</h1>
                <div className="flex border-b border-slate-200 mt-4 overflow-x-auto no-scrollbar">
                    <TabButton 
                        label={`${t('likesReceived')}`}
                        isActive={activeTab === 'received'}
                        onClick={() => onTabChange('received')}
                        badge={receivedLikes.length}
                    />
                    <TabButton 
                        label="Conexões"
                        isActive={activeTab === 'matches'}
                        onClick={() => onTabChange('matches')}
                    />
                    <TabButton 
                        label="Favoritos"
                        isActive={activeTab === 'favorites'}
                        onClick={() => onTabChange('favorites')}
                    />
                    <TabButton 
                        label={t('likesSent')}
                        isActive={activeTab === 'sent'}
                        onClick={() => onTabChange('sent')}
                    />
                </div>
            </header>

            <main className="flex-grow">
                {activeTab === 'received' && (
                    <MatchesList 
                        matches={receivedLikes}
                        superLikedBy={superLikedBy}
                        onConfirmMatch={onConfirmMatch}
                        onRemoveMatch={onRemoveMatch}
                        onViewProfile={onViewProfile}
                        currentUserProfile={currentUserProfile}
                        onGoToSales={onGoToSales}
                    />
                )}
                {activeTab === 'matches' && (
                    <MutualMatchesList
                        matches={mutualMatches}
                        onViewProfile={onViewProfile}
                        onUnmatch={onUnmatch}
                        onChat={onChat}
                    />
                )}
                {activeTab === 'favorites' && (
                    <FavoritesList
                        favorites={favoriteProfiles}
                        onViewProfile={onViewProfile}
                        onRemoveFavorite={onRemoveFavorite}
                    />
                )}
                {activeTab === 'sent' && (
                    <SentLikesList
                        sentLikes={sentLikes}
                        onViewProfile={onViewProfile}
                        onRevokeLike={onRevokeLike}
                    />
                )}
            </main>
        </div>
    );
};