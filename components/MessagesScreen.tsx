import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';


interface MessagesScreenProps {
  conversations: UserProfile[];
  onSelectChat: (user: UserProfile) => void;
  currentUserProfile: UserProfile | null;
}

interface Snippet {
    text: string;
    created_at: string;
}

const ConversationItem: React.FC<{ conversation: UserProfile; onSelectChat: (user: UserProfile) => void; currentUserProfile: UserProfile }> = ({ conversation, onSelectChat, currentUserProfile }) => {
    const [lastMessage, setLastMessage] = useState<Snippet | null>(null);

    useEffect(() => {
        if (!currentUserProfile) return;

        const fetchLastMessage = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('text, created_at')
                .or(`(sender_id.eq.${currentUserProfile.id},receiver_id.eq.${conversation.id}),(sender_id.eq.${conversation.id},receiver_id.eq.${currentUserProfile.id})`)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                setLastMessage(data);
            }
        };
        
        fetchLastMessage();

        const channelId = `conversation_${[currentUserProfile.id, conversation.id].sort().join('_')}`;
        const channel = supabase.channel(channelId);
        
        channel.on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `or(and(sender_id.eq.${currentUserProfile.id},receiver_id.eq.${conversation.id}),and(sender_id.eq.${conversation.id},receiver_id.eq.${currentUserProfile.id}))`
          },
          (payload) => {
            setLastMessage(payload.new as Snippet);
          }
        ).subscribe();
        
        return () => {
          supabase.removeChannel(channel);
        };
    }, [conversation.id, currentUserProfile]);

    const formatTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        const diffDays = Math.floor(diffSeconds / 86400);

        if (diffSeconds < 60) return "Agora";
        if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m`;
        if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h`;
        if (diffDays === 1) return "Ontem";
        return date.toLocaleDateString('pt-BR');
    };

    return (
        <div
            onClick={() => onSelectChat(conversation)}
            className="p-4 flex items-center space-x-4 cursor-pointer hover:bg-slate-50 transition-colors duration-200"
        >
            <img src={conversation.photos[0]} alt={conversation.name} className="w-14 h-14 rounded-full object-cover" />
            <div className="flex-grow">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-lg">{conversation.name}</h3>
                    {lastMessage && <span className="text-xs text-slate-400">{formatTimestamp(lastMessage.created_at)}</span>}
                </div>
                <p className="text-sm text-slate-500 truncate">
                  {lastMessage ? lastMessage.text : "Toque para iniciar a conversa."}
                </p>
            </div>
        </div>
    );
};


export const MessagesScreen: React.FC<MessagesScreenProps> = ({ conversations, onSelectChat, currentUserProfile }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white min-h-full">
      <header className="bg-white p-4 shadow-sm sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-slate-800">{t('messages')}</h1>
      </header>
      
      {conversations.length === 0 ? (
        <div className="text-center text-slate-500 pt-24 px-6">
          <p className="text-lg">{t('yourConversations')}</p>
          <p className="text-sm mt-2">{t('yourConversationsDesc')}</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-200">
          {currentUserProfile && conversations.map((conv) => (
            <ConversationItem 
                key={conv.id}
                conversation={conv}
                onSelectChat={onSelectChat}
                currentUserProfile={currentUserProfile}
            />
          ))}
        </div>
      )}
    </div>
  );
};