import React from 'react';
import { UserProfile } from '../types';
import { MatchesList } from './MatchesList';
import { SentLikesList } from './SentLikesList';
import { MutualMatchesList } from './MutualMatchesList';
import { useLanguage } from '../contexts/LanguageContext';

interface LikesScreenProps {
  receivedLikes: UserProfile[];
  sentLikes: UserProfile[];
  mutualMatches: UserProfile[]; // Novo prop para matches mútuos
  superLikedBy: string[];
  currentUserProfile: UserProfile;
  onConfirmMatch: (user: UserProfile) => void;
  onRemoveMatch: (userId: string) => void; // Recusar curtida recebida
  onRevokeLike: (user: UserProfile) => void; // Cancelar curtida enviada
  onUnmatch: (user: UserProfile) => void; // Desfazer match mútuo
  onViewProfile: (user: UserProfile) => void;
  onGoToSales: () => void;
  activeTab: 'received' | 'sent' | 'matches';
  onTabChange: (tab: 'received' | 'sent' | 'matches') => void;
  onChat: (user: UserProfile) => void;
}

const TabButton: React.FC<{ label: string; isActive: boolean; onClick: () => void; }> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 pb-3 font-bold text-center transition-colors duration-200 text-sm sm:text-base ${
            isActive 
                ? 'text-sky-600 border-b-2 border-sky-600' 
                : 'text-slate-500 hover:text-slate-800'
        }`}
    >
        {label}
    </button>
);

export const LikesScreen: React.FC<LikesScreenProps> = (props) => {
    const { t } = useLanguage();
    const { 
        receivedLikes, 
        sentLikes,
        mutualMatches,
        superLikedBy, 
        currentUserProfile, 
        onConfirmMatch, 
        onRemoveMatch,
        onRevokeLike,
        onUnmatch,
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
                <div className="flex border-b border-slate-200 mt-4">
                    <TabButton 
                        label={`${t('likesReceived')} (${receivedLikes.length})`}
                        isActive={activeTab === 'received'}
                        onClick={() => onTabChange('received')}
                    />
                    <TabButton 
                        label="Conexões"
                        isActive={activeTab === 'matches'}
                        onClick={() => onTabChange('matches')}
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