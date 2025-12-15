import React from 'react';
import { UserProfile } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { XIcon } from './icons/XIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';

interface MutualMatchesListProps {
  matches: UserProfile[];
  onViewProfile: (user: UserProfile) => void;
  onUnmatch: (user: UserProfile) => void;
  onChat: (user: UserProfile) => void;
}

export const MutualMatchesList: React.FC<MutualMatchesListProps> = ({ matches, onViewProfile, onUnmatch, onChat }) => {
    const { t } = useLanguage();

    if (matches.length === 0) {
        return (
            <div className="text-center text-slate-500 pt-16 px-4">
                <p className="font-semibold text-lg">Sem conexões ainda</p>
                <p className="text-sm mt-1">Quando o interesse for mútuo, seus matches aparecerão aqui para conversar.</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-3">
            {matches.map((profile) => (
                <div 
                    key={profile.id}
                    className="bg-white rounded-xl shadow p-3 flex items-center space-x-4"
                >
                    <div className="relative cursor-pointer" onClick={() => onViewProfile(profile)}>
                        <img 
                            src={profile.photos[0]} 
                            alt={profile.name} 
                            className="w-16 h-16 rounded-full object-cover border-2 border-sky-100"
                        />
                        {profile.isVerified && (
                            <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5">
                                <div className="w-3 h-3 bg-sky-500 rounded-full border border-white"></div>
                            </div>
                        )}
                    </div>
                    
                    <div className="flex-grow cursor-pointer" onClick={() => onChat(profile)}>
                        <h3 className="font-bold text-slate-800 text-lg">
                            {profile.name}, <span className="font-normal text-slate-600 text-sm">{profile.age}</span>
                        </h3>
                        <p className="text-xs text-green-600 font-semibold flex items-center gap-1">
                            <ChatBubbleIcon className="w-3 h-3" /> Conectados
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => onChat(profile)}
                            className="w-10 h-10 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center hover:bg-sky-200 transition-colors"
                            aria-label="Conversar"
                        >
                            <ChatBubbleIcon className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => onUnmatch(profile)}
                            className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors"
                            aria-label="Desfazer Match"
                        >
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};