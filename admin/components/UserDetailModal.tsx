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
    isLoading?: boolean;
}

type ModalView = 'profile' | 'activity' | 'conversations';

const InfoPill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="bg-sky-100 text-sky-800 text-[10px] font-bold uppercase tracking-wide mr-2 mb-2 px-2.5 py-1 rounded-full border border-sky-200">
    {children}
  </span>
);

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


export const UserDetailModal: React.FC<UserDetailModalProps> = ({ user, activities, messages, onClose, onAction, onViewChat, isLoading }) => {
    const [view, setView] = useState<ModalView>('profile');

    const conversations = useMemo(() => {
        const conversationsMap = new Map<string, { partnerId: string, lastMessage: AdminMessage }>();
        
        messages.forEach(message => {
            const partnerId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
            if (partnerId === 'SYSTEM_ADMIN') return; // Ignora mensagens de sistema

            const existing = conversationsMap.get(partnerId);
            if (!existing || new Date(message.created_at).getTime() > new Date(existing.lastMessage.created_at).getTime()) {
                conversationsMap.set(partnerId, { partnerId, lastMessage: message });
            }
        });

        return Array.from(conversationsMap.values());
    }, [user.id, messages]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col text-slate-800 relative animate-pop" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-20">
                    <XIcon className="w-6 h-6" />
                </button>
                
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64 p-20">
                        <div className="w-12 h-12 border-4 border-t-sky-500 border-slate-100 rounded-full animate-spin"></div>
                        <p className="mt-4 text-slate-500 font-bold">Buscando histórico completo...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center p-6 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
                            {user.photos[0] ? (
                                <img src={user.photos[0]} alt={user.name} className="w-20 h-20 rounded-full object-cover mr-6 border-4 border-white shadow-sm" />
                            ) : (
                                <div className="w-20 h-20 bg-slate-200 rounded-full mr-6 flex items-center justify-center border-4 border-white shadow-sm">
                                    <UserCircleIcon className="w-10 h-10 text-slate-400" />
                                </div>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                                    {user.name}, {user.age}
                                    {user.isVerified && <VerifiedBadgeIcon className="w-6 h-6 ml-2 text-sky-500" />}
                                </h2>
                                <p className="text-sm text-slate-500 font-medium">{user.email || 'E-mail não informado'}</p>
                                <div className="flex gap-2 mt-2">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {user.status === 'active' ? 'Ativo' : 'Suspenso'}
                                    </span>
                                    {user.isPremium && <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-amber-200">Premium</span>}
                                </div>
                            </div>
                        </div>

                        <div className="flex border-b border-slate-200">
                            <button onClick={() => setView('profile')} className={`flex-1 py-4 font-bold text-center flex items-center justify-center gap-2 transition-all ${view === 'profile' ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50/50' : 'text-slate-400 hover:bg-slate-50'}`}>
                                <UserCircleIcon className="w-5 h-5"/> Perfil
                            </button>
                            <button onClick={() => setView('activity')} className={`flex-1 py-4 font-bold text-center flex items-center justify-center gap-2 transition-all ${view === 'activity' ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50/50' : 'text-slate-400 hover:bg-slate-50'}`}>
                            <ActivityLogIcon className="w-5 h-5" /> Atividades
                            </button>
                            <button onClick={() => setView('conversations')} className={`flex-1 py-4 font-bold text-center flex items-center justify-center gap-2 transition-all ${view === 'conversations' ? 'text-sky-600 border-b-2 border-sky-600 bg-sky-50/50' : 'text-slate-400 hover:bg-slate-50'}`}>
                            <ChatBubbleLeftRightIcon className="w-5 h-5" /> Conversas ({conversations.length})
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6">
                            {view === 'profile' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Fotos de Perfil</h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            {user.photos.slice(0, 4).map((photo, index) => photo ? (
                                                <img key={index} src={photo} alt={`${user.name} ${index+1}`} className="w-full aspect-square object-cover rounded-xl shadow-sm" />
                                            ) : (
                                                <div key={index} className="w-full aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-300">Slot Vazio</div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div><h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">Biografia</h3><p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{user.bio || 'Sem biografia informada.'}</p></div>
                                        <div><h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-1">Localização</h3><p className="text-sm text-slate-600">{user.location}</p></div>
                                        <div><h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Informações de Fé</h3>
                                            <div className="flex flex-wrap mt-1"><InfoPill>{user.denomination}</InfoPill><InfoPill>Frequência: {user.churchFrequency}</InfoPill></div>
                                        </div>
                                        <div><h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Valores Nucleares</h3>
                                            <div className="flex flex-wrap mt-1">{user.keyValues.length > 0 ? user.keyValues.map(v => <InfoPill key={v}>{v}</InfoPill>) : <span className="text-xs text-slate-400">Nenhum valor selecionado</span>}</div>
                                        </div>
                                        <div><h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Interesses</h3>
                                            <div className="flex flex-wrap mt-1">{user.interests.length > 0 ? user.interests.map(i => <InfoPill key={i}>{i}</InfoPill>) : <span className="text-xs text-slate-400">Nenhum interesse selecionado</span>}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {view === 'activity' && (
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-6">Registro de Atividade</h3>
                                    {activities.length > 0 ? (
                                        <div className="relative pl-6 border-l-2 border-slate-100 space-y-8">
                                            {activities.map(activity => (
                                                <div key={activity.id} className="relative">
                                                    <div className="absolute -left-[31px] top-0 p-1.5 bg-white border-2 border-slate-100 rounded-full text-slate-400 shadow-sm">
                                                        <ActivityIcon type={activity.type} className="w-3.5 h-3.5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-slate-800 font-semibold">{activity.details || 'Ação realizada.'}</p>
                                                        <p className="text-xs text-slate-400 mt-0.5">{new Date(activity.timestamp).toLocaleString('pt-BR')}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : ( <p className="text-center text-slate-400 py-12">Nenhuma atividade registrada no sistema para este usuário.</p> )}
                                </div>
                            )}
                            {view === 'conversations' && (
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider mb-6">Canais de Conversa Ativos</h3>
                                    {conversations.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-3">
                                            {conversations.map(({ partnerId, lastMessage }) => (
                                                <div key={partnerId} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between hover:border-sky-200 transition-all group">
                                                    <div className="flex-grow">
                                                        <p className="font-bold text-slate-800">Parceiro ID: {partnerId.slice(0, 8)}...</p>
                                                        <p className="text-xs text-slate-500 truncate max-w-md italic mt-1">"{lastMessage.text}"</p>
                                                        <p className="text-[10px] text-slate-400 mt-2">Última interação: {new Date(lastMessage.created_at).toLocaleString('pt-BR')}</p>
                                                    </div>
                                                    <button onClick={() => alert('Visualização direta de chat desabilitada por privacidade (Admin Nível 2 exigido).')} className="opacity-0 group-hover:opacity-100 bg-white text-sky-600 border border-sky-100 font-bold text-[10px] py-2 px-4 rounded-lg shadow-sm transition-all hover:bg-sky-600 hover:text-white">AUDITAR CHAT</button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-slate-400 py-12">Este usuário ainda não iniciou nenhuma conversa.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end items-center gap-4 rounded-b-2xl">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-auto">Moderação de Conta</span>
                            <button onClick={() => onAction(user.id, 'warn')} className="bg-amber-500 text-white font-bold py-2.5 px-6 rounded-xl text-xs hover:bg-amber-600 transition-colors shadow-sm">AVISAR</button>
                            <button 
                                onClick={() => onAction(user.id, user.status === 'active' ? 'suspend' : 'reactivate')} 
                                className={`${user.status === 'active' ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-colors shadow-sm`}
                            >
                                {user.status === 'active' ? 'SUSPENDER' : 'REATIVAR'}
                            </button>
                            <button onClick={() => onAction(user.id, 'delete')} className="bg-red-600 text-white font-bold py-2.5 px-6 rounded-xl text-xs hover:bg-red-700 transition-colors shadow-sm">EXCLUIR</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};