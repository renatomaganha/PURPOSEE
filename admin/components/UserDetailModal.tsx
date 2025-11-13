
import React, { useState, useMemo } from 'react';
import { UserProfile, UserActivity, ActivityType, AdminMessage } from '../types';
import { XIcon } from '../../components/icons/XIcon';
import { UserCircleIcon } from '../icons/UserCircleIcon';
import { ActivityLogIcon } from '../icons/ActivityLogIcon';
import { HeartIcon } from '../icons/HeartIcon';
import { ChatBubbleIcon } from '../icons/ChatBubbleIcon';
import { PencilIcon } from '../icons/PencilIcon';
import { VerifiedBadgeIcon } from '../../components/icons/VerifiedBadgeIcon';
import { ChatBubbleLeftRightIcon } from '../icons/ChatBubbleLeftRightIcon';


interface UserDetailModalProps {
    user: UserProfile;
    activities: UserActivity[];
    messages: AdminMessage[];
    onClose: () => void;
    onAction: (userId: string, action: 'warn' | 'suspend' | 'reactivate' | 'delete') => void;
    onViewChat: (user1: UserProfile, user2: UserProfile) => void;
}

type ModalView = 'profile' | 'activity' | 'conversations';

const InfoPill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="bg-sky-100 text-sky-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-1 rounded-full">
    {children}
  </span>
);

const formatActivity = (activity: UserActivity): string => {
    switch (activity.type) {
        case ActivityType.LOGIN: return 'Fez login na plataforma.';
        case ActivityType.LIKE: return `Curtiu o perfil de ${activity.targetUserName || 'um usuário'}.`;
        case ActivityType.PASS: return `Passou o perfil de ${activity.targetUserName || 'um usuário'}.`;
        case ActivityType.MATCH: return `Deu match com ${activity.targetUserName || 'um usuário'}.`;
        case ActivityType.MESSAGE_SENT: return `Enviou uma mensagem para ${activity.targetUserName || 'um usuário'}.`;
        case ActivityType.PROFILE_UPDATE: return `Atualizou o perfil: ${activity.details || ''}.`;
        default: return 'Atividade desconhecida.';
    }
};

const ActivityIcon: React.FC<{type: ActivityType, className?: string}> = ({ type, className="w-5 h-5" }) => {
    switch(type) {
        case ActivityType.LIKE: return <HeartIcon className={className} />;
        case ActivityType.PASS: return <XIcon className={className} />;
        case ActivityType.MATCH: return <HeartIcon className={`${className} text-green-500`} />;
        case ActivityType.MESSAGE_SENT: return <ChatBubbleIcon className={className} />;
        case ActivityType.PROFILE_UPDATE: return <PencilIcon className={className} />;
        default: return <ActivityLogIcon className={className} />;
    }
}


export const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, activities, messages, onClose, onAction, onViewChat }) => {
    const [view, setView] = useState<ModalView>('profile');

    const conversations = useMemo(() => {
        const conversationsMap = new Map<string, { partner: UserProfile, lastMessage: AdminMessage }>();
        const userMessages = messages.filter(m => m.sender_id === user.id || m.receiver_id === user.id);

        for (const message of userMessages) {
            const partnerId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
            
            // This is a placeholder as we don't have all users' data here.
            // In a real app, you'd fetch the user profile from a complete list.
            const partnerProfile: UserProfile = { id: partnerId, name: `Usuário ${partnerId}`, photos: [''], age: 0 } as UserProfile;

            const existing = conversationsMap.get(partnerId);
            if (!existing || new Date(message.created_at) > new Date(existing.lastMessage.created_at)) {
                conversationsMap.set(partnerId, { partner: partnerProfile, lastMessage: message });
            }
        }
        return Array.from(conversationsMap.values());
    }, [user, messages]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col text-slate-800 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-20">
                    <XIcon className="w-6 h-6" />
                </button>
                
                <div className="flex items-center p-6 border-b border-slate-200">
                    <img src={user.photos[0]} alt={user.name} className="w-16 h-16 rounded-full object-cover mr-4" />
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                            {user.name}, {user.age}
                            {user.isVerified && <VerifiedBadgeIcon className="w-6 h-6 ml-2 text-sky-500" />}
                        </h2>
                        <p className="text-sm text-slate-500">{user.email}</p>
                    </div>
                </div>

                <div className="flex border-b border-slate-200">
                    <button onClick={() => setView('profile')} className={`flex-1 py-3 font-bold text-center flex items-center justify-center gap-2 ${view === 'profile' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-500'}`}>
                        <UserCircleIcon className="w-5 h-5"/> Perfil
                    </button>
                    <button onClick={() => setView('activity')} className={`flex-1 py-3 font-bold text-center flex items-center justify-center gap-2 ${view === 'activity' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-500'}`}>
                       <ActivityLogIcon className="w-5 h-5" /> Atividades
                    </button>
                     <button onClick={() => setView('conversations')} className={`flex-1 py-3 font-bold text-center flex items-center justify-center gap-2 ${view === 'conversations' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-500'}`}>
                       <ChatBubbleLeftRightIcon className="w-5 h-5" /> Conversas
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6">
                    {view === 'profile' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-bold text-slate-700 mb-2">Fotos</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {user.photos.map((photo, index) => (
                                        <img key={index} src={photo} alt={`${user.name} ${index+1}`} className="w-full aspect-square object-cover rounded-lg" />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div><h3 className="font-bold text-slate-700">Bio</h3><p className="text-sm text-slate-600">{user.bio}</p></div>
                                <div><h3 className="font-bold text-slate-700">Localização</h3><p className="text-sm text-slate-600">{user.location}</p></div>
                                <div><h3 className="font-bold text-slate-700">Fé</h3>
                                    <div className="flex flex-wrap mt-1"><InfoPill>{user.denomination}</InfoPill><InfoPill>Igreja: {user.churchFrequency}</InfoPill></div>
                                </div>
                                <div><h3 className="font-bold text-slate-700">Valores</h3>
                                    <div className="flex flex-wrap mt-1">{user.keyValues.map(v => <InfoPill key={v}>{v}</InfoPill>)}</div>
                                </div>
                                <div><h3 className="font-bold text-slate-700">Interesses</h3>
                                    <div className="flex flex-wrap mt-1">{user.interests.map(i => <InfoPill key={i}>{i}</InfoPill>)}</div>
                                </div>
                            </div>
                        </div>
                    )}
                    {view === 'activity' && (
                         <div>
                             <h3 className="font-bold text-slate-700 mb-4">Registro de Atividades Recentes</h3>
                             {activities.length > 0 ? (
                                <ul className="space-y-4">
                                    {activities.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(activity => (
                                        <li key={activity.id} className="flex items-start gap-3">
                                            <div className="mt-1 p-2 bg-slate-100 rounded-full text-slate-500"><ActivityIcon type={activity.type} /></div>
                                            <div>
                                                <p className="text-sm text-slate-800">{formatActivity(activity)}</p>
                                                <p className="text-xs text-slate-400">{new Date(activity.timestamp).toLocaleString('pt-BR')}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                             ) : ( <p className="text-center text-slate-500 py-8">Nenhuma atividade registrada para este usuário.</p> )}
                        </div>
                    )}
                    {view === 'conversations' && (
                         <div>
                            <h3 className="font-bold text-slate-700 mb-4">Conversas</h3>
                            {conversations.length > 0 ? (
                                <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
                                    {conversations.map(({ partner, lastMessage }) => (
                                        <div key={partner.id} className="p-3 flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-slate-800">{partner.name}</p>
                                                <p className="text-xs text-slate-500 truncate max-w-xs">{lastMessage.text}</p>
                                            </div>
                                            <button onClick={() => onViewChat(user, partner)} className="bg-sky-100 text-sky-700 font-bold text-xs py-1 px-3 rounded-full hover:bg-sky-200">Ver Conversa</button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-slate-500 py-8">Nenhuma conversa encontrada para este usuário.</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end items-center gap-3">
                    <span className="text-sm font-semibold text-slate-600 mr-auto">Ações de Moderação:</span>
                    <button onClick={() => onAction(user.id, 'warn')} className="bg-amber-500 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-amber-600">Avisar</button>
                    <button onClick={() => onAction(user.id, user.status === 'active' ? 'suspend' : 'reactivate')} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-orange-600">
                        {user.status === 'active' ? 'Suspender' : 'Reativar'}
                    </button>
                    <button onClick={() => onAction(user.id, 'delete')} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg text-sm hover:bg-red-700">Excluir</button>
                </div>
            </div>
        </div>
    );
};
