import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { UserProfile, Message } from '../types';
import { VerifiedBadgeIcon } from './icons/VerifiedBadgeIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { EllipsisVerticalIcon } from './icons/EllipsisVerticalIcon';
import { PaperClipIcon } from './icons/PaperClipIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ViewOnceIcon } from './icons/ViewOnceIcon';
import { XIcon } from './icons/XIcon';
import { LockClosedIcon } from './icons/LockClosedIcon'; // Reusing existing lock icon for opened state

interface ChatScreenProps {
  match: UserProfile;
  currentUserProfile: UserProfile;
  onBack: () => void;
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Mock suggestions for when API key is missing (Demo Mode)
const getMockSuggestion = (matchName: string) => {
    const suggestions = [
        `Oi ${matchName}, vi que você gosta de viajar! Qual foi o lugar mais incrível que você já visitou?`,
        `Olá ${matchName}! Achei muito legal seu interesse por música. Você toca algum instrumento?`,
        `Oi! Sua bio me chamou atenção. Como tem sido sua caminhada na fé recentemente?`,
        `${matchName}, vi que temos valores parecidos. O que você mais gosta de fazer no tempo livre?`,
        `Oi! Qual seu versículo favorito? O meu tem me ajudado muito ultimamente.`
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
};

export const ChatScreen: React.FC<ChatScreenProps> = ({ match, currentUserProfile, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  
  // Media States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // New States for Media Preview and View Once
  const [pendingFile, setPendingFile] = useState<{ file: File, preview: string } | null>(null);
  const [isViewOnceMode, setIsViewOnceMode] = useState(false);
  const [viewingSecureImage, setViewingSecureImage] = useState<Message | null>(null);
  
  const { t } = useLanguage();
  const { addToast } = useToast();
  
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);

  // Channel ID for typing events
  const channelId = [currentUserProfile.id, match.id].sort().join('_');

  useEffect(() => {
    // 1. Load initial history
    const fetchMessages = async () => {
        setIsLoading(true);
        const { data, error: fetchError } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${currentUserProfile.id},receiver_id.eq.${match.id}),and(sender_id.eq.${match.id},receiver_id.eq.${currentUserProfile.id})`)
            .order('created_at', { ascending: true });

        if (fetchError) {
            console.error('Error fetching messages:', fetchError);
        } else {
            setMessages(data as Message[]);
        }
        setIsLoading(false);
    };

    fetchMessages();
    
    // 2. Setup Realtime Subscription
    const channel = supabase.channel(`chat_room_${channelId}`);

    channel
        .on(
            'postgres_changes',
            { 
                event: 'INSERT', 
                schema: 'public', 
                table: 'messages'
            }, 
            (payload) => {
                const newMsg = payload.new as Message;
                const isRelevant = 
                    (newMsg.sender_id === currentUserProfile.id && newMsg.receiver_id === match.id) ||
                    (newMsg.sender_id === match.id && newMsg.receiver_id === currentUserProfile.id);

                if (isRelevant) {
                    setMessages(prev => {
                        if (prev.some(m => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });
                }
            }
        )
        // Listen for updates (e.g. view once status)
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'messages'
            },
            (payload) => {
                const updatedMsg = payload.new as Message;
                setMessages(prev => prev.map(m => m.id === updatedMsg.id ? updatedMsg : m));
            }
        )
        .on('broadcast', { event: 'typing' }, (payload) => {
            if (payload.payload.userId === match.id) {
                setIsTyping(true);
                if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
                typingTimeoutRef.current = window.setTimeout(() => setIsTyping(false), 3000);
            }
        })
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (pendingFile) URL.revokeObjectURL(pendingFile.preview);
    };
  }, [currentUserProfile.id, match.id, channelId]);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isLoading, isRecording, pendingFile]);


  const sendMessage = async (text: string, mediaUrl?: string, mediaType: 'text' | 'image' | 'audio' = 'text', isViewOnce: boolean = false) => {
    const messagePayload = {
        sender_id: currentUserProfile.id,
        receiver_id: match.id,
        text: text,
        media_url: mediaUrl,
        media_type: mediaType,
        is_view_once: isViewOnce,
        viewed_at: null
    };

    // Optimistic Update for Media messages (Text is usually fast enough, but media might need it if we fallback)
    if (mediaType !== 'text') {
        const optimisticMsg: Message = {
            id: Date.now(),
            created_at: new Date().toISOString(),
            ...messagePayload
        };
        setMessages(prev => [...prev, optimisticMsg]);
    }

    const { error } = await supabase.from('messages').insert(messagePayload);
    
    if (error) {
        console.error("Error sending message:", error);
        addToast({ type: 'error', message: `Erro ao salvar mensagem: ${error.message}` });
        // Optional: Remove optimistic update on error if needed, but for now we leave it so user doesn't lose content immediately
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Handle pending image upload first
    if (pendingFile) {
        setIsUploading(true);
        const file = pendingFile.file;
        let publicUrl = '';

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${channelId}/${Date.now()}.${fileExt}`;
            
            const { error: uploadError } = await supabase.storage
                .from('chat-media')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('chat-media')
                .getPublicUrl(fileName);
            
            publicUrl = data.publicUrl;

        } catch (error) {
            console.warn('Backend upload failed, falling back to local URL:', error);
            publicUrl = URL.createObjectURL(file); // Local URL fallback
            addToast({ type: 'info', message: 'Modo Demo: Imagem enviada localmente (Upload falhou).' });
        } finally {
            await sendMessage("", publicUrl, 'image', isViewOnceMode);
            // Cleanup
            setPendingFile(null);
            setIsViewOnceMode(false);
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
        return;
    }

    if (!newMessage.trim()) return;
    
    const text = newMessage.trim();
    setNewMessage(''); 
    await sendMessage(text);
  };
  
  // --- Image Handling ---
  const handleClipClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const preview = URL.createObjectURL(file);
          setPendingFile({ file, preview });
          setIsViewOnceMode(false); // Default to normal
      }
  };

  const cancelPendingFile = () => {
      if (pendingFile) URL.revokeObjectURL(pendingFile.preview);
      setPendingFile(null);
      setIsViewOnceMode(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleViewOnce = () => {
      setIsViewOnceMode(prev => !prev);
  };

  // --- View Once Logic ---
  const handleOpenViewOnce = (msg: Message) => {
      if (msg.sender_id === currentUserProfile.id) return; // Sender can't view their own view-once
      if (msg.viewed_at) return; // Already viewed

      setViewingSecureImage(msg);
  };

  const handleCloseViewOnce = async () => {
      if (!viewingSecureImage) return;
      
      const msgId = viewingSecureImage.id;
      setViewingSecureImage(null);

      // Optimistic update
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, viewed_at: new Date().toISOString() } : m));

      // Mark as viewed in DB
      const { error } = await supabase
          .from('messages')
          .update({ viewed_at: new Date().toISOString() })
          .eq('id', msgId);
      
      if (error) console.error("Failed to mark view once as viewed:", error);
  };

  // --- Audio Handling ---
  const startRecording = async () => {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];

          mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                  audioChunksRef.current.push(event.data);
              }
          };

          mediaRecorder.start();
          setIsRecording(true);
          setRecordingTime(0);
          timerIntervalRef.current = window.setInterval(() => {
              setRecordingTime(prev => prev + 1);
          }, 1000);

      } catch (error) {
          console.error("Error accessing microphone:", error);
          addToast({ type: 'error', message: 'Não foi possível acessar o microfone. Verifique as permissões.' });
      }
  };

  const stopRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          
          return new Promise<void>((resolve) => {
               if (!mediaRecorderRef.current) return resolve();
               mediaRecorderRef.current.onstop = async () => {
                  const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                  setIsRecording(false);
                  setIsUploading(true);
                  
                  let publicUrl = '';

                  try {
                      const fileName = `${channelId}/${Date.now()}.webm`;
                      const { error: uploadError } = await supabase.storage
                          .from('chat-media')
                          .upload(fileName, audioBlob);
                      
                      if (uploadError) throw uploadError;

                      const { data } = supabase.storage
                          .from('chat-media')
                          .getPublicUrl(fileName);
                      
                      publicUrl = data.publicUrl;
                  } catch (error) {
                      console.warn("Backend upload failed, falling back to local URL:", error);
                      publicUrl = URL.createObjectURL(audioBlob);
                      addToast({ type: 'info', message: 'Modo Demo: Áudio enviado localmente.' });
                  } finally {
                      setIsUploading(false);
                      if (publicUrl) {
                          await sendMessage("", publicUrl, 'audio');
                      }
                      resolve();
                  }
              };
          });
      }
  };

  const cancelRecording = () => {
      if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop();
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          setIsRecording(false);
          audioChunksRef.current = [];
      }
  };

  const formatRecordingTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleTyping = () => {
    const channel = supabase.channel(`chat_room_${channelId}`);
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: currentUserProfile.id }
    });
  };

  const handleGenerateSuggestion = async () => {
    setIsGenerating(true);
    setNewMessage(t('generating') + '...');

    try {
        if (!process.env.API_KEY) {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockSuggestion = getMockSuggestion(match.name);
            setNewMessage(mockSuggestion);
            setIsGenerating(false);
            return;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const conversationHistory = messages.slice(-10).map(m => {
            const content = m.media_type === 'image' ? '[Imagem]' : m.media_type === 'audio' ? '[Áudio]' : m.text;
            return `${m.sender_id === currentUserProfile.id ? currentUserProfile.name : match.name}: ${content}`;
        }).join('\n');

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
            t('geminiPromptInstructionShort'),
            t('geminiPromptInstructionQuestion'),
            t('geminiPromptInstructionFormat')
        ].join('\n');
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text?.trim().replace(/^"|"$/g, '') || "";
        setNewMessage(text);

    } catch (error) {
        console.error("AI Error:", error);
        const mockSuggestion = getMockSuggestion(match.name);
        setNewMessage(mockSuggestion);
        addToast({ type: 'info', message: "Modo offline: Sugestão gerada localmente." });
    } finally {
        setIsGenerating(false);
    }
};

  return (
    <div className="h-full flex flex-col bg-[#e5ddd5]">
      {/* HEADER */}
      <header className="bg-white px-4 py-3 flex items-center shadow-sm z-20 sticky top-0">
        <button onClick={onBack} className="mr-3 text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors">
            <ArrowLeftIcon className="w-6 h-6" />
        </button>
        
        <div className="relative">
            <img src={match.photos[0]} alt={match.name} className="w-10 h-10 rounded-full object-cover border border-slate-200"/>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
        </div>
        
        <div className="flex-grow ml-3">
            <div className="flex items-center">
                <h2 className="font-bold text-slate-800 text-base">{match.name}</h2>
                {match.isVerified && <VerifiedBadgeIcon className="w-4 h-4 ml-1 text-sky-500" />}
            </div>
            <p className="text-xs text-green-600 font-medium">Online agora</p> 
        </div>
        
        <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
            <EllipsisVerticalIcon className="w-6 h-6" />
        </button>
      </header>

      {/* MESSAGES AREA */}
      <div 
        className="flex-grow p-4 overflow-y-auto custom-scrollbar"
        style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundRepeat: 'repeat', backgroundSize: '400px' }}
      >
        {isLoading ? (
            <div className="flex justify-center items-center h-full">
                <div className="w-8 h-8 border-4 border-t-sky-500 border-white/50 rounded-full animate-spin"></div>
            </div>
        ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white/80 backdrop-blur-sm rounded-xl m-4 shadow-sm">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mb-4">
                    <SparklesIcon className="w-8 h-8 text-sky-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">É um Match!</h3>
                <p className="text-slate-600 text-sm mt-2 mb-4">
                    Vocês se curtiram. Agora é a hora de dar o primeiro passo. Que tal usar nossa IA para quebrar o gelo?
                </p>
                <button 
                    onClick={handleGenerateSuggestion}
                    className="text-sky-600 font-semibold text-sm hover:underline"
                >
                    Sugerir mensagem
                </button>
            </div>
        ) : (
            <div className="space-y-2">
                <div className="flex justify-center my-4">
                    <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm">
                        Hoje
                    </span>
                </div>

              {messages.map((msg, index) => {
                const isMe = msg.sender_id === currentUserProfile.id;
                const isFirstInSequence = index === 0 || messages[index - 1].sender_id !== msg.sender_id;
                
                return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1`}>
                  <div
                    className={`
                        relative max-w-[80%] rounded-lg shadow-sm text-sm
                        ${isMe 
                            ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none' 
                            : 'bg-white text-slate-900 rounded-tl-none'
                        }
                        ${isFirstInSequence ? (isMe ? 'rounded-tr-none' : 'rounded-tl-none') : ''}
                        ${msg.media_type === 'image' ? 'p-1' : 'px-3 py-2'}
                    `}
                  >
                    {msg.media_type === 'image' && msg.media_url ? (
                        msg.is_view_once ? (
                            // Visualização Única (View Once) Message Layout
                            <button 
                                onClick={() => handleOpenViewOnce(msg)}
                                disabled={!!msg.viewed_at || isMe}
                                className={`flex items-center gap-3 p-2 rounded-lg transition-colors w-64 ${
                                    !!msg.viewed_at ? 'opacity-70 cursor-default' : 'hover:bg-black/5 cursor-pointer'
                                }`}
                            >
                                <div className="relative">
                                    <ViewOnceIcon className={`w-6 h-6 ${!!msg.viewed_at ? 'text-slate-400' : 'text-sky-500'}`} />
                                    {!!msg.viewed_at && (
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full">
                                            <LockClosedIcon className="w-3 h-3 text-slate-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="text-left flex-grow">
                                    <p className={`font-semibold ${!!msg.viewed_at ? 'text-slate-500' : 'text-slate-800'}`}>
                                        {msg.viewed_at ? 'Foto aberta' : 'Foto'}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Visualização única
                                    </p>
                                </div>
                            </button>
                        ) : (
                            // Normal Image Layout
                            <div className="mb-1">
                                <img src={msg.media_url} alt="Imagem enviada" className="rounded-lg max-h-60 w-auto object-cover" />
                            </div>
                        )
                    ) : msg.media_type === 'audio' && msg.media_url ? (
                        <div className="flex items-center gap-2 min-w-[200px] py-1">
                            <audio controls src={msg.media_url} className="h-8 w-full" />
                        </div>
                    ) : (
                        <p className="leading-relaxed break-words">{msg.text}</p>
                    )}
                    
                    <div className={`text-[10px] mt-1 flex items-center justify-end space-x-1 ${msg.media_type === 'image' && !msg.is_view_once ? 'pr-1 pb-1 text-white drop-shadow-md' : (isMe ? 'text-slate-500' : 'text-slate-400')}`}>
                        <span>{formatTime(msg.created_at)}</span>
                        {isMe && (
                            <svg viewBox="0 0 16 15" width="16" height="15" className={`${msg.media_type === 'image' && !msg.is_view_once ? 'text-white' : 'text-sky-500'} w-3 h-3 fill-current`}>
                                <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-7.655a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-7.655a.365.365 0 0 0-.063-.51z" />
                            </svg>
                        )}
                    </div>
                    
                    {isFirstInSequence && (
                        <div className={`absolute top-0 w-0 h-0 border-[6px] border-transparent ${
                            isMe 
                            ? 'right-[-6px] border-t-[#d9fdd3] border-l-[#d9fdd3]' 
                            : 'left-[-6px] border-t-white border-r-white'
                        }`}></div>
                    )}
                  </div>
                </div>
              )})}
              
              {isTyping && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    </div>
                  </div>
              )}
              <div ref={endOfMessagesRef} />
            </div>
        )}
      </div>

      {/* SECURE IMAGE VIEWER */}
      {viewingSecureImage && (
          <SecureImageViewer 
            src={viewingSecureImage.media_url!} 
            onClose={handleCloseViewOnce} 
          />
      )}

      {/* INPUT AREA */}
      <footer className="bg-[#f0f2f5] p-2 pb-safe sticky bottom-0 z-20">
        {/* Suggestion Chip */}
        {!isRecording && !pendingFile && (
            <div className="flex justify-center -mt-8 mb-2 pointer-events-none">
                <button
                    onClick={handleGenerateSuggestion}
                    disabled={isGenerating}
                    className="pointer-events-auto shadow-lg flex items-center gap-1.5 py-1.5 px-4 rounded-full bg-white/90 backdrop-blur-md text-amber-600 border border-amber-200 text-xs font-bold hover:bg-amber-50 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <div className="w-3 h-3 border-2 border-t-amber-600 border-amber-200 rounded-full animate-spin"></div>
                    ) : (
                    <SparklesIcon className="w-3.5 h-3.5" />
                    )}
                    {isGenerating ? t('generating') : t('suggestMessageAI')}
                </button>
            </div>
        )}

        {/* Media Preview before Sending */}
        {pendingFile && (
            <div className="absolute bottom-full left-0 right-0 bg-[#e9edef] p-4 border-t border-slate-200 shadow-lg flex flex-col items-center animate-slide-up">
                <div className="relative w-full max-w-sm aspect-[4/5] bg-black rounded-lg overflow-hidden flex items-center justify-center mb-3">
                    <img src={pendingFile.preview} alt="Preview" className="max-w-full max-h-full object-contain" />
                    <button 
                        onClick={cancelPendingFile}
                        className="absolute top-2 left-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
                <div className="w-full max-w-sm bg-white rounded-full px-4 py-2 flex items-center justify-between shadow-sm">
                    <input 
                        type="text" 
                        placeholder="Adicionar legenda..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-grow bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm"
                    />
                    <button 
                        onClick={toggleViewOnce}
                        className={`p-2 rounded-full transition-all ${isViewOnceMode ? 'bg-sky-100 text-sky-600' : 'text-slate-400 hover:bg-slate-100'}`}
                        title="Visualização Única"
                    >
                        <ViewOnceIcon className={`w-6 h-6 ${isViewOnceMode ? 'fill-sky-100' : ''}`} />
                    </button>
                </div>
            </div>
        )}

        <div className="flex items-end gap-2 max-w-4xl mx-auto">
            {isRecording ? (
                // Recording UI
                <div className="flex-grow bg-white rounded-2xl border border-red-200 shadow-sm flex items-center min-h-[44px] px-2 animate-pulse">
                    <button onClick={cancelRecording} className="p-2 text-slate-400 hover:text-red-500">
                        <TrashIcon className="w-6 h-6" />
                    </button>
                    <div className="flex-grow text-center font-mono text-red-500 font-bold">
                        {formatRecordingTime(recordingTime)}
                    </div>
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce mr-3"></div>
                </div>
            ) : (
                // Text Input UI
                <>
                    <button onClick={handleClipClick} className="p-3 mb-1 text-slate-500 hover:bg-slate-200 rounded-full transition-colors">
                        <PaperClipIcon className="w-6 h-6" />
                    </button>
                    <form onSubmit={handleSendMessage} className="flex-grow flex items-end">
                        <div className="flex-grow bg-white rounded-2xl border border-slate-200 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition-all shadow-sm flex items-center min-h-[44px]">
                            <input
                                type="text"
                                placeholder={pendingFile ? "Adicionar legenda..." : t('typeAMessage')}
                                value={newMessage}
                                onChange={(e) => {
                                    setNewMessage(e.target.value);
                                    if (!pendingFile) handleTyping();
                                }}
                                disabled={!!pendingFile} // Disable text input here if viewing preview, use preview input instead
                                className="w-full bg-transparent px-4 py-2.5 focus:outline-none text-slate-800 placeholder:text-slate-400 disabled:text-slate-300"
                            />
                        </div>
                    </form>
                </>
            )}
          
            {newMessage.trim() || isRecording || pendingFile ? (
                <button 
                    onClick={isRecording ? stopRecording : () => handleSendMessage()}
                    disabled={isUploading}
                    className={`
                        w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-200 mb-0.5
                        ${isRecording ? 'bg-green-500 hover:bg-green-600' : 'bg-sky-600 hover:bg-sky-700'} 
                        text-white transform hover:scale-105
                    `}
                >
                    {isUploading ? (
                        <div className="w-5 h-5 border-2 border-t-white border-white/30 rounded-full animate-spin"></div>
                    ) : (
                        <PaperAirplaneIcon className="w-6 h-6 translate-x-[-1px] translate-y-[1px]" />
                    )}
                </button>
            ) : (
                <button 
                    onClick={startRecording}
                    className="w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-200 bg-sky-600 hover:bg-sky-700 text-white transform hover:scale-105 mb-0.5"
                >
                    <MicrophoneIcon className="w-6 h-6" />
                </button>
            )}
        </div>
      </footer>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileSelect} 
      />
    </div>
  );
};

// Componente separado para Visualização Segura
const SecureImageViewer: React.FC<{ src: string; onClose: () => void }> = ({ src, onClose }) => {
    const [timeLeft, setTimeLeft] = useState(10); // 10 seconds auto-close
    const [isBlurred, setIsBlurred] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onClose();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Security listeners
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setIsBlurred(true);
            } else {
                // Keep blurred if returned, force user to close
                // Or allow unblur? For security, keeping blur is better, but UX might suffer.
                // Let's unblur but the timer kept running.
                setIsBlurred(false);
            }
        };

        const handleBlur = () => setIsBlurred(true);
        const handleFocus = () => setIsBlurred(false);

        // Attempt to detect screenshot keys (very limited support)
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey)) {
                setIsBlurred(true);
                alert("Capturas de tela não são permitidas nesta visualização.");
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("blur", handleBlur);
        window.addEventListener("focus", handleFocus);
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            clearInterval(timer);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center select-none"
            onContextMenu={(e) => e.preventDefault()} // Disable right click
        >
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center text-white z-10">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                    <ViewOnceIcon className="w-4 h-4" />
                    <span className="text-xs font-bold">{timeLeft}s</span>
                </div>
                <button onClick={onClose} className="bg-white/10 p-2 rounded-full hover:bg-white/20">
                    <XIcon className="w-6 h-6" />
                </button>
            </div>

            <div className="relative w-full h-full flex items-center justify-center p-4">
                <img 
                    src={src} 
                    alt="View Once" 
                    className={`max-w-full max-h-full object-contain transition-all duration-200 ${isBlurred ? 'blur-xl opacity-50' : ''}`}
                    style={{ pointerEvents: 'none', userSelect: 'none' }} // Prevent dragging/selecting
                    draggable={false}
                />
                {isBlurred && (
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-center p-4">
                        <div className="bg-black/50 p-4 rounded-xl backdrop-blur-md">
                            <LockClosedIcon className="w-12 h-12 mx-auto mb-2 text-red-500" />
                            <p>Conteúdo Protegido</p>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="absolute bottom-8 text-white/50 text-xs">
                Visualização única. Não capture a tela.
            </div>
        </div>
    );
};