import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { UserProfile, Message } from '../types';
import { VerifiedBadgeIcon } from './icons/VerifiedBadgeIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';


interface ChatScreenProps {
  match: UserProfile;
  currentUserProfile: UserProfile;
  onBack: () => void;
}


export const ChatScreen: React.FC<ChatScreenProps> = ({ match, currentUserProfile, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  // Create a stable, unique channel ID for the two users by sorting their IDs
  const channelId = [currentUserProfile.id, match.id].sort().join('_');

  useEffect(() => {
    // Fetch initial messages
    const fetchMessages = async () => {
        setIsLoading(true);
        setError(null);
        const { data, error: fetchError } = await supabase
            .from('messages')
            .select('*')
            .or(`(sender_id.eq.${currentUserProfile.id},receiver_id.eq.${match.id}),(sender_id.eq.${match.id},receiver_id.eq.${currentUserProfile.id})`)
            .order('created_at', { ascending: true });

        if (fetchError) {
            console.error('Error fetching messages:', "Message:", fetchError.message, "Details:", fetchError.details, "Code:", fetchError.code);
            setError(t('chatHistoryError'));
        } else {
            setMessages(data as Message[]);
        }
        setIsLoading(false);
    };

    fetchMessages();
    
    // Set up realtime channel
    const channel = supabase.channel(`chat_${channelId}`, {
      config: {
        broadcast: { self: false }, // Don't receive our own broadcast events
      },
    });

    // Listen for new messages
    channel.on('postgres_changes', 
        { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'messages',
        }, 
        (payload) => {
             const newMessagePayload = payload.new as Message;
             // Only add message if it's part of this conversation
             const isForThisChat = 
                (newMessagePayload.sender_id === currentUserProfile.id && newMessagePayload.receiver_id === match.id) ||
                (newMessagePayload.sender_id === match.id && newMessagePayload.receiver_id === currentUserProfile.id);

             if (isForThisChat) {
                setMessages(prev => {
                  // Prevent duplicates from optimistic UI vs. realtime
                  if (prev.some(m => m.id === newMessagePayload.id)) return prev;
                  return [...prev, newMessagePayload];
                });
             }
        }
    );

    // Listen for typing events from the other user
    channel.on('broadcast', { event: 'typing' }, () => {
      setIsTyping(true);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // Hide indicator after 3s of inactivity
      typingTimeoutRef.current = window.setTimeout(() => {
        setIsTyping(false);
      }, 3000); 
    });

    channel.subscribe();

    return () => {
        supabase.removeChannel(channel);
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
    };
  }, [channelId, currentUserProfile.id, match.id, t]);
  
  // Auto-scroll to bottom when new messages or typing indicator appear
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    
    const messageText = newMessage;
    setNewMessage(''); // Clear input immediately for better UX

    // Rely on the realtime subscription to show the message, making the DB the single source of truth.
    const { error } = await supabase.from('messages').insert({
        sender_id: currentUserProfile.id,
        receiver_id: match.id,
        text: messageText,
    });
    
    if (error) {
        console.error("Error sending message:", "Message:", error.message, "Details:", error.details, "Code:", error.code);
        setNewMessage(messageText); // Restore text on error
    }
  };
  
  // Broadcast a typing event to the channel
  const handleTyping = () => {
    const channel = supabase.channel(`chat_${channelId}`);
    channel.send({
      type: 'broadcast',
      event: 'typing',
    });
  };

  const handleGenerateSuggestion = async () => {
    setIsGenerating(true);
    setNewMessage(t('generating') + '...');

    try {
        // FIX: Use process.env.API_KEY as per the guidelines.
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const conversationHistory = messages.map(m => `${m.sender_id === currentUserProfile.id ? currentUserProfile.name : match.name}: ${m.text}`).join('\n');

        const prompt = [
            t('geminiPromptBase', { currentUserProfileName: currentUserProfile.name, matchName: match.name }),
            '',
            t('geminiPromptCurrentUserProfile', { currentUserProfileName: currentUserProfile.name }),
            t('geminiPromptInterests', { interests: currentUserProfile.interests.join(', ') }),
            t('geminiPromptBio', { bio: currentUserProfile.bio }),
            '',
            t('geminiPromptMatchProfile', { matchName: match.name }),
            t('geminiPromptInterests', { interests: match.interests.join(', ') }),
            t('geminiPromptBio', { bio: match.bio }),
            '',
            messages.length > 0 ? t('geminiPromptConversationHistory', { conversationHistory }) : '',
            '',
            t('geminiPromptInstructions'),
            messages.length > 0 ? t('geminiPromptInstructionContinue') : t('geminiPromptInstructionInitial'),
            t('geminiPromptInstructionShort'),
            t('geminiPromptInstructionPersonal'),
            t('geminiPromptInstructionQuestion'),
            t('geminiPromptInstructionTone'),
            messages.length > 0 ? t('geminiPromptInstructionNoGreeting') : '',
            '',
            t('geminiPromptInstructionFormat')
        ].filter(line => line !== '').join('\n');
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        // FIX: Access the text directly from the response object.
        const text = response.text.trim().replace(/^"|"$/g, '');
        setNewMessage(text);
    } catch (error) {
        console.error("Error generating suggestion:", error instanceof Error ? error.message : error);
        setNewMessage("Não foi possível gerar uma sugestão. Tente novamente.");
    } finally {
        setIsGenerating(false);
    }
};


  return (
    <div className="h-full flex flex-col bg-slate-100">
      {/* Cabeçalho do Chat */}
      <header className="bg-white p-4 flex items-center shadow-md z-10 sticky top-0">
        <button onClick={onBack} className="mr-4 text-sky-600">&larr;</button>
        <img src={match.photos[0]} alt={match.name} className="w-10 h-10 rounded-full object-cover mr-3"/>
        <div className="flex items-center">
            <h2 className="font-bold text-slate-800">{match.name}</h2>
            {match.isVerified && <VerifiedBadgeIcon className="w-5 h-5 ml-1 text-sky-500" />}
        </div>
      </header>

      {/* Lista de Mensagens */}
      <div className="flex-grow p-4 overflow-y-auto">
        {isLoading ? (
            <div className="flex justify-center items-center h-full">
                <div className="w-8 h-8 border-4 border-t-sky-500 border-slate-200 rounded-full animate-spin"></div>
                <p className="ml-4 text-slate-500">{t('loadingMessages')}</p>
            </div>
        ) : error ? (
            <div className="flex justify-center items-center h-full">
                <p className="text-red-500 text-center">{error}</p>
            </div>
        ) : messages.length === 0 ? (
            <div className="flex justify-center items-center h-full">
                <p className="text-slate-500 text-center px-4">{t('chatStartConversation', { name: match.name })}</p>
            </div>
        ) : (
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_id === currentUserProfile.id ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      msg.sender_id === currentUserProfile.id
                        ? 'bg-sky-500 text-white rounded-br-none'
                        : 'bg-white text-slate-800 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-white text-slate-800 rounded-bl-none">
                        <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                  </div>
              )}
              <div ref={endOfMessagesRef} />
            </div>
        )}
      </div>

      {/* Campo de Entrada de Mensagem */}
      <footer className="bg-white p-4 sticky bottom-0 border-t border-slate-200">
        <div className="mb-3">
            <button
                onClick={handleGenerateSuggestion}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-amber-100 text-amber-800 font-semibold hover:bg-amber-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isGenerating ? (
                    <>
                        <div className="w-4 h-4 border-2 border-t-amber-800 border-amber-200 rounded-full animate-spin"></div>
                        {t('generating')}...
                    </>
                ) : (
                   <>
                       <SparklesIcon className="w-5 h-5" />
                       {t('suggestMessageAI')}
                   </>
                )}
            </button>
        </div>
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            placeholder={t('typeAMessage')}
            value={newMessage}
            onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
            }}
            className="w-full border border-slate-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button type="submit" className="ml-3 bg-sky-600 text-white rounded-full p-3 flex-shrink-0 hover:bg-sky-700 transition-colors disabled:bg-slate-400" disabled={!newMessage.trim()}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086L2.279 16.76a.75.75 0 00.95.826l14.5-4.25a.75.75 0 000-1.355l-14.5-4.25z" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};