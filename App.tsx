import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { UserProfile, DeletionFeedback, ReportReason, FilterState, Tag, VerificationStatus, Message } from './types';
import { useAuth } from './auth/AuthContext';
import { supabase } from './lib/supabaseClient';

import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { CreateProfile } from './components/CreateProfile';
import { LoadingScreen } from './components/LoadingScreen';
import { ProfileCard } from './components/ProfileCard';
import { BottomNav } from './components/BottomNav';
import { NoMoreProfiles } from './components/NoMoreProfiles';
import { MatchModal } from './components/MatchModal';
import { MessagesScreen } from './components/MessagesScreen';
import { ChatScreen } from './components/ChatScreen';
import { LikesScreen } from './components/LikesScreen';
import { PremiumScreen } from './components/PremiumScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { FilterScreen } from './components/FilterScreen';
import { BlockUserModal } from './components/BlockUserModal';
import { ReportUserModal } from './components/ReportUserModal';
import { DeleteAccountModal } from './components/DeleteAccountModal';
import { PrivacyPolicyScreen } from './components/PrivacyPolicyScreen';
import { TermsOfUseScreen } from './components/TermsOfUseScreen';
import { CookiePolicyScreen } from './components/CookiePolicyScreen';
import { CommunityRulesScreen } from './components/CommunityRulesScreen';
import { SafetyTipsScreen } from './components/SafetyTipsScreen';
import { HelpAndSupportScreen } from './components/HelpAndSupportScreen';
import { SalesPage } from './components/SalesPage';
import { FaceVerificationModal } from './components/FaceVerificationModal';
import { FaceVerification } from './components/FaceVerification';
import { BoostConfirmationModal } from './components/BoostConfirmationModal';
import { PeakTimeModal } from './components/PeakTimeModal';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { SetupCheck } from './components/SetupCheck';
import { useLanguage } from './contexts/LanguageContext';
import { ToastContainer } from './components/ToastContainer';
import { useToast } from './contexts/ToastContext';


type AppStatus = 'landing' | 'auth' | 'create_profile' | 'loading' | 'app' | 'profile_error';
type AppView = 'profiles' | 'matches' | 'messages' | 'premium';
type ModalView = 'none' | 'filters' | 'settings' | 'block' | 'report' | 'delete' | 'privacy' | 'terms' | 'cookies' | 'community' | 'safety' | 'support' | 'sales' | 'face_verification_prompt' | 'face_verification_flow' | 'boost_confirm' | 'peak_time' | 'profile_detail' | 'edit_profile';

const BOOST_DURATION = 3600; // 60 minutes in seconds

// Mock data for tags, simulating a fetch from a 'tags' table
const mockTags: Tag[] = [
    { id: 'denom_1', category: 'denominations', name: 'Batista', emoji: '💧', created_at: new Date().toISOString() },
    { id: 'denom_2', category: 'denominations', name: 'Presbiteriana', emoji: '📖', created_at: new Date().toISOString() },
    { id: 'denom_3', category: 'denominations', name: 'Metodista', emoji: '🔥', created_at: new Date().toISOString() },
    { id: 'denom_4', category: 'denominations', name: 'Pentecostal', emoji: '🕊️', created_at: new Date().toISOString() },
    { id: 'denom_5', category: 'denominations', name: 'Adventista', emoji: '🕖', created_at: new Date().toISOString() },
    { id: 'denom_6', category: 'denominations', name: 'Católico', emoji: '✝️', created_at: new Date().toISOString() },
    { id: 'denom_7', category: 'denominations', name: 'CCB', emoji: '🎶', created_at: new Date().toISOString() },
    { id: 'denom_8', category: 'denominations', name: 'Cristão', emoji: '❤️', created_at: new Date().toISOString() },
    { id: 'denom_9', category: 'denominations', name: 'Evangélico', emoji: '🙌', created_at: new Date().toISOString() },
    { id: 'denom_10', category: 'denominations', name: 'Espirita', emoji: '✨', created_at: new Date().toISOString() },
    { id: 'denom_11', category: 'denominations', name: 'Judaísmo', emoji: '✡️', created_at: new Date().toISOString() },
    { id: 'denom_12', category: 'denominations', name: 'Não Denominacional', emoji: '⛪', created_at: new Date().toISOString() },

    { id: 'kv_1', category: 'keyValues', name: 'Família', emoji: '👨‍👩‍👧‍👦', created_at: new Date().toISOString() },
    { id: 'kv_2', category: 'keyValues', name: 'Oração', emoji: '🙏', created_at: new Date().toISOString() },
    { id: 'kv_3', category: 'keyValues', name: 'Serviço', emoji: '🤝', created_at: new Date().toISOString() },
    { id: 'kv_4', category: 'keyValues', name: 'Honestidade', emoji: '✅', created_at: new Date().toISOString() },
    { id: 'kv_5', category: 'keyValues', name: 'Comunhão', emoji: '🧑‍🤝‍🧑', created_at: new Date().toISOString() },
    { id: 'kv_6', category: 'keyValues', name: 'Adoração', emoji: '🎤', created_at: new Date().toISOString() },
    { id: 'kv_7', category: 'keyValues', name: 'Missões', emoji: '🌍', created_at: new Date().toISOString() },
    { id: 'kv_8', category: 'keyValues', name: 'Fé', emoji: '✝️', created_at: new Date().toISOString() },

    { id: 'int_1', category: 'interests', name: 'Leitura', emoji: '📚', created_at: new Date().toISOString() },
    { id: 'int_2', category: 'interests', name: 'Música', emoji: '🎵', created_at: new Date().toISOString() },
    { id: 'int_3', category: 'interests', name: 'Viagens', emoji: '✈️', created_at: new Date().toISOString() },
    { id: 'int_4', category: 'interests', name: 'Caminhadas', emoji: '🚶‍♂️', created_at: new Date().toISOString() },
    { id: 'int_5', category: 'interests', name: 'Fotografia', emoji: '📷', created_at: new Date().toISOString() },
    { id: 'int_6', category: 'interests', name: 'Culinária', emoji: '🍳', created_at: new Date().toISOString() },
    { id: 'int_7', category: 'interests', name: 'Filmes', emoji: '🎬', created_at: new Date().toISOString() },
    { id: 'int_8', category: 'interests', name: 'Voluntariado', emoji: '💖', created_at: new Date().toISOString() },
    { id: 'int_9', category: 'interests', name: 'Esportes', emoji: '⚽', created_at: new Date().toISOString() },
    { id: 'int_10', category: 'interests', name: 'Estudo Bíblico', emoji: '📖', created_at: new Date().toISOString() },

    { id: 'lang_1', category: 'languages', name: 'Português', emoji: '🇧🇷', created_at: new Date().toISOString() },
    { id: 'lang_2', category: 'languages', name: 'Inglês', emoji: '🇺🇸', created_at: new Date().toISOString() },
    { id: 'lang_3', category: 'languages', name: 'Espanhol', emoji: '🇪🇸', created_at: new Date().toISOString() },
];


const dbProfileToAppProfile = (dbData: any): UserProfile => {
  if (!dbData) return {} as UserProfile;
  // Mapeamento explícito de snake_case (banco de dados) para camelCase (aplicativo)
  return {
    id: dbData.id,
    name: dbData.name,
    age: dbData.age,
    dob: dbData.dob,
    gender: dbData.gender,
    seeking: dbData.seeking || [],
    location: dbData.location,
    latitude: dbData.latitude,
    longitude: dbData.longitude,
    photos: dbData.photos || Array(5).fill(null),
    privatePhoto: dbData.private_photo,
    video: dbData.video,
    bio: dbData.bio,
    denomination: dbData.denomination,
    churchFrequency: dbData.church_frequency,
    churchName: dbData.church_name,
    favoriteVerse: dbData.favorite_verse,
    favoriteSong: dbData.favorite_song,
    favoriteBook: dbData.favorite_book,
    keyValues: dbData.key_values || [],
    relationshipGoal: dbData.relationship_goal,
    maritalStatus: dbData.marital_status,
    partnerDescription: dbData.partner_description,
    interests: dbData.interests || [],
    languages: dbData.languages || [],
    isVerified: dbData.is_verified,
    face_verification_status: dbData.face_verification_status || VerificationStatus.NOT_VERIFIED,
    isPremium: dbData.is_premium,
    isInvisibleMode: dbData.is_invisible_mode,
    isPaused: dbData.is_paused,
    height: dbData.height,
    zodiacSign: dbData.zodiac_sign,
    isAgeHidden: dbData.is_age_hidden,
    isZodiacHidden: dbData.is_zodiac_hidden,
    superLikesRemaining: dbData.super_likes_remaining,
    superLikeResetDate: dbData.super_like_reset_date,
    boostsRemaining: dbData.boosts_remaining,
    boostResetDate: dbData.boost_reset_date,
    boostIsActive: dbData.boost_is_active,
    boostExpiresAt: dbData.boost_expires_at,
  };
};

/**
 * Calcula a distância em km entre duas coordenadas geográficas.
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

/**
 * Calcula a pontuação de compatibilidade entre dois perfis.
 */
const calculateCompatibilityScore = (currentUser: UserProfile, otherUser: UserProfile, likedCurrentUserIds: string[]): { score: number, reason: string } => {
    let score = 0;
    const reasons: { score: number, text: string }[] = [];

    // Prioridade máxima: Perfil com Boost ativo
    if (otherUser.boostIsActive) {
        score += 1000;
    }
    
    // Prioridade alta: O outro usuário já curtiu o usuário atual
    if (likedCurrentUserIds.includes(otherUser.id)) {
        score += 500;
        reasons.push({ score: 500, text: `${otherUser.name} curtiu você!` });
    }

    // Mesmo objetivo de relacionamento (importante)
    if (currentUser.relationshipGoal && otherUser.relationshipGoal && currentUser.relationshipGoal === otherUser.relationshipGoal) {
        score += 100;
        reasons.push({ score: 100, text: `Ambos buscam ${currentUser.relationshipGoal}` });
    }

    // Valores de fé compartilhados
    const sharedValues = currentUser.keyValues?.filter(value => otherUser.keyValues?.includes(value)) || [];
    score += sharedValues.length * 20;
    if (sharedValues.length > 0) {
        reasons.push({ score: sharedValues.length * 20 + 1, text: `Ambos valorizam ${sharedValues[0]}` });
    }

    // Interesses em comum
    const sharedInterests = currentUser.interests?.filter(interest => otherUser.interests?.includes(interest)) || [];
    score += sharedInterests.length * 10;
    if (sharedInterests.length > 0) {
        reasons.push({ score: sharedInterests.length * 10, text: `Vocês dois amam ${sharedInterests[0]}` });
    }
    
    // Bônus menores
    if (currentUser.denomination === otherUser.denomination) score += 5;
    if (currentUser.churchFrequency === otherUser.churchFrequency) score += 5;

    // Bônus de proximidade
    if (currentUser.latitude && currentUser.longitude && otherUser.latitude && otherUser.longitude) {
        const distance = getDistance(currentUser.latitude, currentUser.longitude, otherUser.latitude, otherUser.longitude);
        if (distance < 10) score += 5; // Bônus para menos de 10km
    }

    // Ordena as razões pela pontuação e escolhe a mais relevante
    const topReason = reasons.sort((a, b) => b.score - a.score)[0]?.text || '';
        
    return { score, reason: topReason };
};


function App() {
  const { session, signOut } = useAuth();
  const { t } = useLanguage();
  const { addToast } = useToast();
  const [logoUrl] = useState<string | null>('https://ojsgrhaopwwqpoyayumb.supabase.co/storage/v1/object/public/logoo/PURPOSE.png');
  const [appStatus, setAppStatus] = useState<AppStatus>('loading');
  
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);
  const [allOtherUsers, setAllOtherUsers] = useState<UserProfile[]>([]);
  const [profiles, setProfiles] = useState<Array<{ profile: UserProfile; reason: string }>>([]); // Swipe deck com razão
  const [currentIndex, setCurrentIndex] = useState(0);

  const [activeView, setActiveView] = useState<AppView>('profiles');
  const [modalView, setModalView] = useState<ModalView>('none');
  const [modalHistory, setModalHistory] = useState<ModalView[]>([]);
  const [profileToDetail, setProfileToDetail] = useState<UserProfile | null>(null);

  const [likedProfiles, setLikedProfiles] = useState<string[]>([]); 
  const [passedProfiles, setPassedProfiles] = useState<string[]>([]);
  const [superLikedBy, setSuperLikedBy] = useState<string[]>([]); 
  const [likedMe, setLikedMe] = useState<string[]>([]);
  
  const [activeChat, setActiveChat] = useState<UserProfile | null>(null);
  
  const [matchedUser, setMatchedUser] = useState<UserProfile | null>(null);
  const [userToBlockOrReport, setUserToBlockOrReport] = useState<UserProfile | null>(null);
  
  const [isPremiumSaleActive, setIsPremiumSaleActive] = useState(true);
  
  const [tags, setTags] = useState<Tag[]>(mockTags); // Usando mockTags por enquanto

  const boostTimerRef = useRef<number | null>(null);
  const [boostTimeRemaining, setBoostTimeRemaining] = useState<number | null>(null);

  const peakTimeModalShown = useRef(false);

  const [filters, setFilters] = useState<FilterState>({
    ageRange: { min: 18, max: 60 },
    distance: 100,
    denominations: [],
    churchFrequencies: [],
    relationshipGoals: [],
    verifiedOnly: false,
    churchName: '',
  });

  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [lastReadTimestamps, setLastReadTimestamps] = useState<{[chatId: string]: string}>(() => {
    try {
      const saved = localStorage.getItem('lastReadTimestamps');
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn("Could not read lastReadTimestamps from localStorage", error);
      return {};
    }
  });
  const [unreadCounts, setUnreadCounts] = useState<{[chatId: string]: number}>({});

  const [likesSubView, setLikesSubView] = useState<'received' | 'sent'>('received');

  const openModal = (view: ModalView) => {
    if (view === modalView) return; // Avoid duplicates
    setModalHistory(prev => [...prev, modalView]);
    setModalView(view);
  };

  const closeModal = () => {
    const lastView = modalHistory.length > 0 ? modalHistory[modalHistory.length - 1] : 'none';
    setModalHistory(prev => prev.slice(0, -1));
    setModalView(lastView);
  };

  const handleSignOut = async () => {
    await signOut();
    setModalView('none');
    setModalHistory([]);
  };

  // Helper to update profile in state and DB
  const updateCurrentUserProfile = async (updates: Partial<UserProfile>) => {
      if (!currentUserProfile) return;

      // Optimistic UI update
      const oldProfile = currentUserProfile;
      const updatedProfile = { ...currentUserProfile, ...updates };
      setCurrentUserProfile(updatedProfile);

      const dbPayload: { [key: string]: any } = {};
      if (updates.superLikesRemaining !== undefined) dbPayload.super_likes_remaining = updates.superLikesRemaining;
      if (updates.superLikeResetDate !== undefined) dbPayload.super_like_reset_date = updates.superLikeResetDate;
      if (updates.boostsRemaining !== undefined) dbPayload.boosts_remaining = updates.boostsRemaining;
      if (updates.boostResetDate !== undefined) dbPayload.boost_reset_date = updates.boostResetDate;
      if (updates.boostIsActive !== undefined) dbPayload.boost_is_active = updates.boostIsActive;
      if (updates.boostExpiresAt !== undefined) dbPayload.boost_expires_at = updates.boostExpiresAt;
      if (updates.isInvisibleMode !== undefined) dbPayload.is_invisible_mode = updates.isInvisibleMode;
      if (updates.isPaused !== undefined) dbPayload.is_paused = updates.isPaused;
      if (updates.isVerified !== undefined) dbPayload.is_verified = updates.isVerified;
      if (updates.face_verification_status !== undefined) dbPayload.face_verification_status = updates.face_verification_status;

      if (Object.keys(dbPayload).length === 0) return;

      const { error } = await supabase
          .from('user_profiles')
          .update(dbPayload)
          .eq('id', currentUserProfile.id);

      if (error) {
          console.error("Error updating profile in DB:", "Message:", error.message, "Details:", error.details, "Code:", error.code);
          // Revert state on error
          setCurrentUserProfile(oldProfile);
          addToast({ type: 'error', message: "Ocorreu um erro ao salvar as alterações. Tente novamente." });
      }
  };


  // Main effect to react to session changes and determine app status
  useEffect(() => {
    const checkSessionAndProfile = async () => {
      if (session) {
        setAppStatus('loading');
        
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (data) {
            const userProfile = dbProfileToAppProfile(data);
            // Concede status premium ao usuário especificado
            if (session.user.email === '19reiss@gmail.com') {
                userProfile.isPremium = true;
            }
            setCurrentUserProfile(userProfile);
            setAppStatus('app');

            // Automatically request location if not set.
            if (!userProfile.latitude && !userProfile.longitude) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const { latitude, longitude } = position.coords;
                            const locationString = t('locationObtained');
                            
                            setCurrentUserProfile(prev => prev ? { ...prev, latitude, longitude, location: locationString } : null);

                            const { error: updateError } = await supabase
                                .from('user_profiles')
                                .update({ latitude, longitude, location: locationString })
                                .eq('id', userProfile.id);
                            
                            if (updateError) {
                                console.error("Failed to save automatic location to DB:", updateError);
                            }
                        },
                        (error) => {
                            console.warn(`Automatic geolocation request failed: ${error.message}`);
                        },
                        {
                            enableHighAccuracy: false,
                            timeout: 10000,
                            maximumAge: 600000 
                        }
                    );
                }
            }

          } else {
            if (error && error.code !== 'PGRST116') {
              console.error("Erro ao buscar perfil:", "Message:", error.message, "Details:", error.details, "Code:", error.code);
              setAppStatus('profile_error');
            } else {
              setAppStatus('create_profile');
            }
          }
        } catch (e: any) {
          console.error("Erro catastrófico ao buscar perfil:", e.message, e);
          setAppStatus('profile_error');
        }
      } else {
        setAppStatus('landing');
        setCurrentUserProfile(null);
        setModalView('none');
        setModalHistory([]);
      }
    };
    checkSessionAndProfile();
  }, [session, t]);

  // Effect to load other users' data and likes once the main app is ready
  useEffect(() => {
    if (appStatus !== 'app' || !session?.user) return;

    const loadAppData = async () => {
      // Fetch other users
      const { data: otherUsersData, error: otherUsersError } = await supabase
        .from('user_profiles')
        .select('*')
        .neq('id', session.user.id);

      if (otherUsersError) {
        console.error("Error fetching other profiles:", otherUsersError);
      } else {
        setAllOtherUsers(otherUsersData.map(dbProfileToAppProfile));
      }

      // Fetch likes data
      const { data: likesData, error: likesError } = await supabase
        .from('likes')
        .select('liker_id, liked_id, is_super_like')
        .or(`liker_id.eq.${session.user.id},liked_id.eq.${session.user.id}`);

      if (likesError) {
        console.error("Error fetching likes:", likesError);
      } else if (likesData) {
        setLikedProfiles(likesData.filter(l => l.liker_id === session.user.id).map(l => l.liked_id));
        const whoLikedMe = likesData.filter(l => l.liked_id === session.user.id);
        setLikedMe(whoLikedMe.map(l => l.liker_id));
        setSuperLikedBy(whoLikedMe.filter(l => l.is_super_like).map(l => l.liker_id));
      }

      // Fetch all messages for the current user
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`receiver_id.eq.${session.user.id},sender_id.eq.${session.user.id}`);
      
      if (messagesError) {
        console.error("Error fetching all messages:", messagesError);
      } else if (messagesData) {
        setAllMessages(messagesData as Message[]);
      }
    };

    loadAppData();
  }, [appStatus, session]);
  
  const matches = useMemo(() => {
    // People who liked me, but I haven't actioned yet
    if (!currentUserProfile) return [];

    return allOtherUsers.filter(u => 
      u.name && u.age && // Garante que o perfil está minimamente completo
      likedMe.includes(u.id) && 
      !likedProfiles.includes(u.id) && 
      !passedProfiles.includes(u.id) &&
      currentUserProfile.seeking?.includes(u.gender) // Garante que o gênero é o que o usuário procura
    );
  }, [allOtherUsers, likedMe, likedProfiles, passedProfiles, currentUserProfile]);

  const sentLikesProfiles = useMemo(() => {
    // People I have liked, sorted by most recent like
    return likedProfiles
        .map(id => allOtherUsers.find(u => u.id === id))
        .filter((u): u is UserProfile => !!u)
        .reverse(); // simple reverse to show most recent first
  }, [allOtherUsers, likedProfiles]);

  const conversations = useMemo(() => {
    // Mutual likes
    const mutualIds = likedProfiles.filter(id => likedMe.includes(id));
    return allOtherUsers.filter(u => mutualIds.includes(u.id));
  }, [allOtherUsers, likedProfiles, likedMe]);

  // Effect to calculate unread message counts
  useEffect(() => {
    if (!currentUserProfile || conversations.length === 0) {
      if (Object.keys(unreadCounts).length > 0) setUnreadCounts({});
      return;
    }

    const newUnreadCounts: {[chatId: string]: number} = {};
    
    conversations.forEach(convo => {
      const lastRead = lastReadTimestamps[convo.id] || new Date(0).toISOString();
      const unreadInConvo = allMessages.filter(msg =>
        msg.sender_id === convo.id && // Message is from the other person
        msg.receiver_id === currentUserProfile.id && // Message is to me
        new Date(msg.created_at) > new Date(lastRead)
      ).length;
      
      if (unreadInConvo > 0) {
        newUnreadCounts[convo.id] = unreadInConvo;
      }
    });
    
    if (JSON.stringify(newUnreadCounts) !== JSON.stringify(unreadCounts)) {
      setUnreadCounts(newUnreadCounts);
    }
  }, [allMessages, conversations, lastReadTimestamps, currentUserProfile, unreadCounts]);

  // Realtime subscription for new messages
  useEffect(() => {
    if (!currentUserProfile) return;

    const channel = supabase.channel(`public:messages:receiver_id=eq.${currentUserProfile.id}`);
    
    channel.on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `receiver_id=eq.${currentUserProfile.id}`
      }, 
      (payload) => {
           const newMessage = payload.new as Message;
           if (activeChat?.id !== newMessage.sender_id) {
              setAllMessages(prev => [...prev, newMessage]);
           }
      }
    ).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserProfile, activeChat]);


  const checkAndApplyWeeklyBonuses = useCallback(async () => {
    if (!currentUserProfile || !currentUserProfile.isPremium) return;
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const lastSuperLikeReset = new Date(currentUserProfile.superLikeResetDate || 0);
    const lastBoostReset = new Date(currentUserProfile.boostResetDate || 0);

    const updates: Partial<UserProfile> = {};

    if (lastSuperLikeReset < oneWeekAgo) {
      updates.superLikesRemaining = 4; // Replenish to 4
      updates.superLikeResetDate = now.toISOString();
    }

    if (lastBoostReset < oneWeekAgo) {
      updates.boostsRemaining = (currentUserProfile.boostsRemaining ?? 0) + 1; // Add 1 boost
      updates.boostResetDate = now.toISOString();
    }

    if (Object.keys(updates).length > 0) {
      console.log("Applying weekly premium bonuses:", updates);
      await updateCurrentUserProfile(updates);
    }
  }, [currentUserProfile]);

  const checkBoostStatus = useCallback(() => {
    if (currentUserProfile?.boostIsActive && currentUserProfile.boostExpiresAt) {
        const expireTime = new Date(currentUserProfile.boostExpiresAt).getTime();
        const now = new Date().getTime();
        const remaining = Math.round((expireTime - now) / 1000);
        if (remaining > 0) {
            setBoostTimeRemaining(remaining);
        } else {
            updateCurrentUserProfile({ boostIsActive: false, boostExpiresAt: null });
            setBoostTimeRemaining(null);
        }
    }
  }, [currentUserProfile]);
  
  const checkPeakTime = useCallback(() => {
    if (peakTimeModalShown.current) return; // Show only once per session
    const currentHour = new Date().getHours();
    if (currentHour >= 18 || currentHour < 0) { // 18:00 - 23:59
        openModal('peak_time');
        peakTimeModalShown.current = true;
    }
  }, []);

  // Effect to run checks once the profile is loaded and app is ready
  useEffect(() => {
      if (appStatus === 'app' && currentUserProfile) {
          checkAndApplyWeeklyBonuses();
          checkBoostStatus();
          checkPeakTime();
      }
  }, [appStatus, currentUserProfile, checkAndApplyWeeklyBonuses, checkBoostStatus, checkPeakTime]);
  
  // Timer for active boost
  useEffect(() => {
    if (boostTimeRemaining !== null && boostTimeRemaining > 0) {
      boostTimerRef.current = window.setTimeout(() => {
        setBoostTimeRemaining(t => (t ? t - 1 : 0));
      }, 1000);
    } else if (boostTimeRemaining === 0) {
      console.log("Boost expired!");
      updateCurrentUserProfile({ boostIsActive: false, boostExpiresAt: null });
      setBoostTimeRemaining(null);
    }
    return () => {
      if (boostTimerRef.current) {
        clearTimeout(boostTimerRef.current);
      }
    };
  }, [boostTimeRemaining]);

  // Filter and sort profiles
  useEffect(() => {
    if (!currentUserProfile) return;

    // 1. Filter out unwanted profiles
    let availableProfiles = allOtherUsers.filter(p => 
      p.photos.some(photo => !!photo) &&
      !likedProfiles.includes(p.id) && 
      !passedProfiles.includes(p.id) &&
      (!p.isInvisibleMode || likedProfiles.includes(p.id)) &&
      !p.isPaused &&
      // Garante que o usuário atual veja apenas os gêneros que ele procura.
      currentUserProfile.seeking?.includes(p.gender)
    );
    
    // 2. Apply location filter
    if (currentUserProfile.latitude && currentUserProfile.longitude) {
        availableProfiles = availableProfiles.filter(p => {
            if (!p.latitude || !p.longitude) return false;
            const distance = getDistance(currentUserProfile.latitude!, currentUserProfile.longitude!, p.latitude, p.longitude);
            return distance <= filters.distance;
        });
    }

    // 3. Apply advanced filters (if premium)
    if (currentUserProfile.isPremium) {
        if (filters.denominations.length > 0) {
            availableProfiles = availableProfiles.filter(p => p.denomination && filters.denominations.includes(p.denomination));
        }
        if (filters.churchName && filters.churchName.trim() !== '') {
            const searchTerm = filters.churchName.trim().toLowerCase();
            availableProfiles = availableProfiles.filter(p => 
                p.churchName && p.churchName.toLowerCase().includes(searchTerm)
            );
        }
        if (filters.churchFrequencies.length > 0) {
            availableProfiles = availableProfiles.filter(p => p.churchFrequency && filters.churchFrequencies.includes(p.churchFrequency));
        }
        if (filters.relationshipGoals.length > 0) {
            availableProfiles = availableProfiles.filter(p => p.relationshipGoal && filters.relationshipGoals.includes(p.relationshipGoal));
        }
        if (filters.verifiedOnly) {
            availableProfiles = availableProfiles.filter(p => p.isVerified);
        }
    }

    // 4. Smart Matchmaking: Calculate scores
    const profilesWithScores = availableProfiles.map(p => {
        const { score, reason } = calculateCompatibilityScore(currentUserProfile, p, likedMe);
        return { profile: p, score, reason };
    });

    // 5. Sort by the calculated score in descending order
    profilesWithScores.sort((a, b) => b.score - a.score);

    // 6. Update the state with the sorted profiles and their reasons
    setProfiles(profilesWithScores.map(({profile, reason}) => ({profile, reason})));
    setCurrentIndex(0);
  }, [likedProfiles, passedProfiles, filters, currentUserProfile, allOtherUsers, likedMe]);

  const currentProfileWithData = profiles[currentIndex];
  const currentProfile = currentProfileWithData?.profile;
  const matchReason = currentProfileWithData?.reason;


  const distanceToCurrentProfile = useMemo(() => {
    if (!currentProfile || !currentUserProfile?.latitude || !currentUserProfile?.longitude || !currentProfile.latitude || !currentProfile.longitude) {
        return null;
    }
    return getDistance(
        currentUserProfile.latitude,
        currentUserProfile.longitude,
        currentProfile.latitude,
        currentProfile.longitude
    );
  }, [currentProfile, currentUserProfile]);


  const handleSwipe = () => {
    setCurrentIndex(prev => prev + 1);
  };
  
  const executeLike = async (isSuperLike: boolean) => {
    if (!currentProfile || !currentUserProfile) return;

    const originalLikedProfiles = likedProfiles;
    setLikedProfiles(prev => [...prev, currentProfile.id]);

    const { error } = await supabase.from('likes').insert({
        liker_id: currentUserProfile.id,
        liked_id: currentProfile.id,
        is_super_like: isSuperLike,
    });
    
    if (error) {
        console.error("Error liking profile:", error);
        setLikedProfiles(originalLikedProfiles); // Revert on error
        return;
    }

    if (likedMe.includes(currentProfile.id)) {
      setMatchedUser(currentProfile);
    }
    
    handleSwipe();
  };

  const handleLike = () => executeLike(false);

  const handlePass = () => {
    if (!currentProfile) return;
    setPassedProfiles(prev => [...prev, currentProfile.id]);
    handleSwipe();
  };
  
  const handleSuperLike = async () => {
    if (!currentUserProfile) return;
    if (!currentUserProfile.isPremium) {
      addToast({ type: 'info', message: "A Super Conexão é um recurso exclusivo para usuários Premium." });
      return;
    }
    if ((currentUserProfile.superLikesRemaining ?? 0) > 0) {
      await updateCurrentUserProfile({ superLikesRemaining: (currentUserProfile.superLikesRemaining ?? 1) - 1 });
      executeLike(true);
    } else {
      addToast({ type: 'info', message: "Você não tem mais Super Conexões. Elas renovam semanalmente." });
    }
  };

  const handleRewind = () => {
    if (!currentUserProfile?.isPremium) {
        addToast({ type: 'info', message: "Voltar é um recurso Premium!" });
        return;
    }
    if (currentIndex > 0 || passedProfiles.length > 0) {
        const lastPassedId = passedProfiles[passedProfiles.length - 1];
        if (lastPassedId) {
            setPassedProfiles(prev => prev.slice(0, -1));
            setCurrentIndex(prev => Math.max(0, prev - 1));
             console.log("Rewound to previous profile.");
        }
    }
  };
  
  const handleToggleInvisibleMode = async () => {
    if (currentUserProfile?.isPremium) {
      await updateCurrentUserProfile({ isInvisibleMode: !currentUserProfile.isInvisibleMode });
    }
  };
  
  const handleTogglePauseAccount = async () => {
    if (confirm(`Tem certeza de que deseja ${currentUserProfile?.isPaused ? 'reativar' : 'pausar'} sua conta?`)) {
        if (currentUserProfile) {
            await updateCurrentUserProfile({ isPaused: !currentUserProfile.isPaused });
        }
    }
  };
  
  const handleConfirmAccountDeletion = async (feedback: Omit<DeletionFeedback, 'userId'>) => {
      console.log("Feedback de exclusão recebido:", feedback);
      addToast({ type: 'success', message: "Sua conta foi deletada. Sentiremos sua falta!" });
      await handleSignOut();
  };

  const handleActivateBoost = () => {
    if (currentUserProfile?.isPremium && (currentUserProfile.boostsRemaining ?? 0) > 0) {
        openModal('boost_confirm');
    } else if (!currentUserProfile?.isPremium) {
        addToast({ type: 'info', message: "Impulso é um recurso Premium." });
    } else {
        addToast({ type: 'info', message: "Você não tem mais Impulsos. Eles renovam semanalmente." });
    }
  };

  const confirmAndActivateBoost = async () => {
     if (!currentUserProfile) return;
     const expiry = new Date(new Date().getTime() + BOOST_DURATION * 1000);
     await updateCurrentUserProfile({
         boostsRemaining: (currentUserProfile.boostsRemaining ?? 1) - 1,
         boostIsActive: true,
         boostExpiresAt: expiry.toISOString()
     });
     setBoostTimeRemaining(BOOST_DURATION);
     closeModal();
     addToast({ type: 'success', message: "Impulso ativado! Seu perfil será destacado por 60 minutos." });
  };

  const handleSelectChat = (user: UserProfile) => {
    setActiveChat(user);
    const newTimestamps = { ...lastReadTimestamps, [user.id]: new Date().toISOString() };
    setLastReadTimestamps(newTimestamps);
    try {
        localStorage.setItem('lastReadTimestamps', JSON.stringify(newTimestamps));
    } catch (error) {
        console.error("Failed to save timestamps to localStorage", error);
    }
  };

  const handleConfirmMatch = async (userToMatch: UserProfile) => {
    if (!currentUserProfile) return;
    
    // Adiciona à lista de perfis curtidos localmente e no DB
    setLikedProfiles(prev => [...prev, userToMatch.id]);

    const { error } = await supabase.from('likes').insert({
        liker_id: currentUserProfile.id,
        liked_id: userToMatch.id,
        is_super_like: false,
    });

    if (error) {
        console.error("Error confirming match:", "Message:", error.message, "Details:", error.details, "Code:", error.code);
        // Reverte em caso de erro
        setLikedProfiles(prev => prev.filter(id => id !== userToMatch.id));
        return;
    }

    // Como é uma curtida de volta, aciona o modal de match
    setMatchedUser(userToMatch);
  };

  // Derived lists from tags state
  const denominations = useMemo(() => tags.filter(t => t.category === 'denominations'), [tags]);
  const keyValues = useMemo(() => tags.filter(t => t.category === 'keyValues'), [tags]);
  const interests = useMemo(() => tags.filter(t => t.category === 'interests'), [tags]);
  const languages = useMemo(() => tags.filter(t => t.category === 'languages'), [tags]);

  // FIX: Operator '+' cannot be applied to types 'unknown' and 'unknown'.
  // Explicitly typing the accumulator and value in the reduce function helps TypeScript's
  // type inference and resolves the error.
  const totalUnreadCount = Object.values(unreadCounts).reduce((sum: number, count: number) => sum + count, 0);

  // Render logic
  const renderContent = () => {
    switch (appStatus) {
      case 'loading':
        return <LoadingScreen logoUrl={logoUrl} />;
      case 'profile_error':
        return (
          <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-100 text-center p-4">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Erro ao Carregar Perfil</h2>
            <p className="text-slate-700 mb-8 max-w-sm">
                Não conseguimos carregar os dados do seu perfil. Isso pode ser um problema temporário de conexão. Por favor, saia e tente fazer login novamente.
            </p>
            <button
                onClick={handleSignOut}
                className="bg-sky-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-sky-700"
            >
                Sair e Tentar Novamente
            </button>
          </div>
        );
      case 'landing':
        return <LandingPage logoUrl={logoUrl} onEnter={() => setAppStatus('auth')} onShowPrivacyPolicy={() => openModal('privacy')} onShowTermsOfUse={() => openModal('terms')} />;
      case 'auth':
        return <AuthModal onClose={() => setAppStatus('landing')} />;
      case 'create_profile':
        return (
          <SetupCheck>
            <CreateProfile onProfileCreated={(profile) => { setCurrentUserProfile(profile); setAppStatus('app'); }} denominations={denominations} keyValues={keyValues} interests={interests} languages={languages} />
          </SetupCheck>
        );
      case 'app':
        if (!currentUserProfile) {
            return <LoadingScreen logoUrl={logoUrl} />;
        }
        
        const mainContent = () => {
          if (activeChat) {
            return <ChatScreen match={activeChat} currentUserProfile={currentUserProfile} onBack={() => setActiveChat(null)} />;
          }
          switch (activeView) {
            case 'profiles':
              return currentProfile ? 
                <ProfileCard 
                  profile={currentProfile} 
                  currentUserProfile={currentUserProfile}
                  onLike={handleLike} 
                  onPass={handlePass}
                  onSuperLike={handleSuperLike}
                  onRewind={handleRewind}
                  onBlock={() => { setUserToBlockOrReport(currentProfile); openModal('block'); }}
                  onReport={() => { setUserToBlockOrReport(currentProfile); openModal('report'); }}
                  distance={distanceToCurrentProfile}
                  matchReason={matchReason}
                /> : <NoMoreProfiles onGoToFilters={() => openModal('filters')} />;
            case 'matches':
              return <LikesScreen 
                receivedLikes={matches}
                sentLikes={sentLikesProfiles}
                superLikedBy={superLikedBy}
                currentUserProfile={currentUserProfile}
                onConfirmMatch={handleConfirmMatch}
                onRemoveMatch={(userId) => setPassedProfiles(p => [...p, userId])}
                onViewProfile={(user) => { setProfileToDetail(user); openModal('profile_detail'); }}
                activeTab={likesSubView}
                onTabChange={setLikesSubView}
                onNavigateToSales={() => openModal('sales')}
              />;
            case 'messages':
              return <MessagesScreen conversations={conversations} currentUserProfile={currentUserProfile} onSelectChat={handleSelectChat} />;
            case 'premium':
              return <PremiumScreen 
                currentUserProfile={currentUserProfile}
                onEditProfile={() => openModal('edit_profile')}
                onNavigateToSales={() => openModal('sales')}
                isPremiumSaleActive={isPremiumSaleActive}
                onToggleInvisibleMode={handleToggleInvisibleMode}
                onSignOut={handleSignOut}
              />;
            default:
              return <NoMoreProfiles onGoToFilters={() => openModal('filters')} />;
          }
        };

        return (
           <SetupCheck>
              {/* Use h-dvh for dynamic viewport height on mobile */}
              <div className="w-screen h-dvh flex flex-col bg-slate-100">
                  {/* Main content area that grows and scrolls */}
                  <main className="flex-grow overflow-y-auto">
                      {/* Inner container for layout control (centering profiles vs. list views) */}
                      <div className={`relative w-full max-w-sm mx-auto ${activeView === 'profiles' ? 'h-full flex flex-col items-center justify-center' : ''}`}>
                          {mainContent()}
                      </div>
                  </main>
  
                  {/* BottomNav is now part of the flex flow, not fixed */}
                  {!activeChat && (
                      <BottomNav
                        activeView={activeView}
                        onNavigate={(view) => { setActiveView(view); setActiveChat(null); }}
                        matchCount={matches.length}
                        unreadMessagesCount={totalUnreadCount}
                        onFilterClick={() => openModal('filters')}
                        onSettingsClick={() => openModal('settings')}
                        isPremium={currentUserProfile.isPremium}
                        boostCount={currentUserProfile.boostsRemaining ?? 0}
                        isBoostActive={currentUserProfile.boostIsActive ?? false}
                        onBoostClick={handleActivateBoost}
                        boostTimeRemaining={boostTimeRemaining}
                        boostDuration={BOOST_DURATION}
                      />
                  )}
              </div>
          </SetupCheck>
        );
      default:
        return <LandingPage logoUrl={logoUrl} onEnter={() => setAppStatus('auth')} onShowPrivacyPolicy={() => openModal('privacy')} onShowTermsOfUse={() => openModal('terms')} />;
    }
  };

  const renderModal = () => {
    if (!currentUserProfile && appStatus !== 'landing' && appStatus !== 'auth') return null;

    switch (modalView) {
      case 'filters':
        if(!currentUserProfile) return null;
        return <FilterScreen onClose={closeModal} onApply={(f) => { setFilters(f); closeModal(); }} currentFilters={filters} isPremiumUser={currentUserProfile.isPremium} denominations={denominations} />;
      case 'settings':
        if(!currentUserProfile) return null;
        return <SettingsScreen 
            currentUserProfile={currentUserProfile}
            onClose={closeModal} 
            onEditProfile={() => openModal('edit_profile')}
            onSignOut={handleSignOut}
            onToggleInvisibleMode={handleToggleInvisibleMode}
            onTogglePauseAccount={handleTogglePauseAccount}
            onDeleteAccountRequest={() => openModal('delete')}
            onShowPrivacyPolicy={() => openModal('privacy')}
            onShowTermsOfUse={() => openModal('terms')}
            onShowCookiePolicy={() => openModal('cookies')}
            onShowCommunityRules={() => openModal('community')}
            onShowSafetyTips={() => openModal('safety')}
            onShowHelpAndSupport={() => openModal('support')}
            onVerifyProfileRequest={() => openModal('face_verification_prompt')}
        />;
      case 'edit_profile':
        if (!currentUserProfile) return null;
        return <CreateProfile
            onProfileCreated={(profile) => {
                setCurrentUserProfile(profile);
                closeModal();
            }}
            isEditing={true}
            onClose={closeModal}
            denominations={denominations} 
            keyValues={keyValues} 
            interests={interests}
            languages={languages}
        />;
      case 'block':
        if (!userToBlockOrReport) return null;
        return <BlockUserModal profile={userToBlockOrReport} onClose={closeModal} onConfirm={() => { addToast({type: 'info', message: `Bloqueado ${userToBlockOrReport.name}`}); closeModal(); handlePass(); }} />;
      case 'report':
        if (!userToBlockOrReport || !currentUserProfile) return null;
        return <ReportUserModal
            profile={userToBlockOrReport}
            onClose={closeModal}
            onSubmit={async (reason: ReportReason, details: string, files: File[]) => {
                const uploadedUrls: string[] = [];

                for (const file of files) {
                    const fileName = `${currentUserProfile.id}/report_evidence/${Date.now()}_${file.name}`;
                    // A new bucket 'report-evidence' needs to be created in Supabase Storage with public read access.
                    const { error: uploadError } = await supabase.storage
                        .from('report-evidence')
                        .upload(fileName, file);

                    if (uploadError) {
                        console.error("Error uploading evidence:", uploadError);
                        addToast({ type: 'error', message: "Falha ao enviar uma das evidências. A denúncia não foi enviada."});
                        return false;
                    }

                    const { data } = supabase.storage
                        .from('report-evidence')
                        .getPublicUrl(fileName);
                    
                    if (data.publicUrl) {
                        uploadedUrls.push(data.publicUrl);
                    }
                }

                // A new table 'reports' needs to be created in Supabase.
                const { error: reportError } = await supabase
                    .from('reports')
                    .insert({
                        reporter_id: currentUserProfile.id,
                        reported_id: userToBlockOrReport.id,
                        reason,
                        details,
                        status: 'Pendente',
                        evidence_urls: uploadedUrls.length > 0 ? uploadedUrls : null,
                    });

                if (reportError) {
                    console.error("Error submitting report:", reportError);
                    addToast({ type: 'error', message: "Falha ao enviar denúncia. Tente novamente."});
                    return false;
                }
                
                // Success case is handled inside the modal (shows a success message)
                handlePass(); // Automatically pass the reported user
                return true; 
            }}
        />;
      case 'delete':
        return <DeleteAccountModal onClose={closeModal} onSubmit={handleConfirmAccountDeletion} />;
      case 'privacy': return <PrivacyPolicyScreen onClose={closeModal} />;
      case 'terms': return <TermsOfUseScreen onClose={closeModal} />;
      case 'cookies': return <CookiePolicyScreen onClose={closeModal} />;
      case 'community': return <CommunityRulesScreen onClose={closeModal} />;
      case 'safety': return <SafetyTipsScreen onClose={closeModal} />;
      case 'support': 
        if(!currentUserProfile) return null;
        return <HelpAndSupportScreen onClose={closeModal} currentUserProfile={currentUserProfile} />;
      case 'sales': return <SalesPage onClose={closeModal} />;
      case 'face_verification_prompt': 
        if(!currentUserProfile) return null;
        return <FaceVerificationModal 
          onClose={closeModal} 
          onStartVerification={() => openModal('face_verification_flow')} 
        />;
      case 'face_verification_flow': 
        if(!currentUserProfile) return null;
        return <FaceVerification 
          userProfile={currentUserProfile}
          onBack={closeModal} 
          onComplete={async (status: VerificationStatus) => {
              // A lógica de inserção no DB e upload já está no componente FaceVerification.
              // Este callback atualiza o estado principal do app.
              await updateCurrentUserProfile({ 
                  face_verification_status: status,
                  // Atualiza o status geral de verificação se aprovado automaticamente
                  isVerified: status === VerificationStatus.VERIFIED ? true : currentUserProfile.isVerified 
              });
              
              // O componente FaceVerification mostra uma tela de sucesso.
              // Após um tempo, fechamos o modal.
              if (status === VerificationStatus.VERIFIED) {
                  setTimeout(() => {
                    closeModal(); 
                  }, 2000); 
              }
              // Se falhar, o componente tem um botão "Tentar Novamente". O 'onBack' pode fechar o fluxo.
        }} />;
      case 'boost_confirm': 
        if(!currentUserProfile) return null;
        return <BoostConfirmationModal onClose={closeModal} onConfirm={confirmAndActivateBoost} boostCount={currentUserProfile.boostsRemaining ?? 0} />;
      case 'peak_time': 
        if(!currentUserProfile) return null;
        return <PeakTimeModal userProfile={currentUserProfile} onClose={closeModal} onActivateBoost={handleActivateBoost} onGoToPremium={() => {openModal('sales')}} />;
      case 'profile_detail': {
        if (!profileToDetail || !currentUserProfile) return null;
        let distanceToDetail: number | null = null;
        if (currentUserProfile.latitude && currentUserProfile.longitude && profileToDetail.latitude && profileToDetail.longitude) {
            distanceToDetail = getDistance(currentUserProfile.latitude, currentUserProfile.longitude, profileToDetail.latitude, profileToDetail.longitude);
        }
        // Recalculate match reason for consistency
        const { reason } = calculateCompatibilityScore(currentUserProfile, profileToDetail, likedMe);
        // FIX: Pass the `distanceToDetail` variable to the `distance` prop of ProfileDetailModal.
        return <ProfileDetailModal 
                  profile={profileToDetail}
                  onClose={closeModal}
                  onConfirmMatch={() => {
                      setLikedProfiles(p => [...p, profileToDetail.id]);
                      setMatchedUser(profileToDetail); 
                      closeModal();
                  }}
                  onRemoveMatch={() => {setPassedProfiles(p => [...p, profileToDetail.id]); closeModal();}}
                  onBlock={() => {setUserToBlockOrReport(profileToDetail); openModal('block')}}
                  onReport={() => {setUserToBlockOrReport(profileToDetail); openModal('report')}}
                  distance={distanceToDetail}
                  matchReason={reason}
                />;
      }
      default:
        return null;
    }
  };

  return (
    <>
      <ToastContainer />
      {renderContent()}
      {matchedUser && currentUserProfile && <MatchModal matchedUser={matchedUser} currentUserPhoto={currentUserProfile.photos[0] || ''} onClose={() => setMatchedUser(null)} onStartChat={() => { setActiveChat(matchedUser); setMatchedUser(null); setActiveView('messages'); }} />}
      {renderModal()}
    </>
  );
}

export default App;