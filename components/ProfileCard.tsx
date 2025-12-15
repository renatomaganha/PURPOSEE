import React, { useState, useEffect, useRef, useMemo } from 'react';
import { UserProfile } from '../types';
import { ChevronUpIcon } from './icons/ChevronUpIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { HeartIcon } from './icons/HeartIcon';
import { XIcon } from './icons/XIcon';
import { RewindIcon } from './icons/RewindIcon';
import { HeartSparkleIcon } from './icons/HeartSparkleIcon';
import { VerifiedBadgeIcon } from './icons/VerifiedBadgeIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { FlagIcon } from './icons/FlagIcon';
import { UserMinusIcon } from './icons/UserMinusIcon';
import { CrossIcon } from './icons/CrossIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { Tooltip } from './Tooltip';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { SparklesIcon } from './icons/SparklesIcon';
import { useToast } from '../contexts/ToastContext';
import { StarIcon } from './icons/StarIcon';


interface ProfileCardProps {
  profile: UserProfile;
  currentUserProfile: UserProfile;
  onLike: () => void;
  onPass: () => void;
  onRewind: () => void;
  onSuperLike: () => void;
  onBlock: () => void;
  onReport: () => void;
  onGoToSales: () => void;
  distance: number | null;
  matchReason?: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const SWIPE_THRESHOLD = 80; // pixels

const InfoPill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="bg-sky-100 text-sky-800 text-xs font-semibold mr-2 mb-2 px-2.5 py-1 rounded-full">
    {children}
  </span>
);

const OverlayInfoPill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold mr-2 mb-2 px-2.5 py-1 rounded-full">
    {children}
  </span>
);

export const ProfileCard: React.FC<ProfileCardProps> = ({ 
    profile, 
    currentUserProfile, 
    onLike, 
    onPass, 
    onRewind, 
    onSuperLike, 
    onBlock, 
    onReport, 
    onGoToSales, 
    distance, 
    matchReason,
    isFavorite,
    onToggleFavorite
}) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useLanguage();
  const { addToast } = useToast();
  
  // Swipe state
  const cardRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null); // Ref para aplicar o blur apenas na imagem
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState(0);
  const [deltaX, setDeltaX] = useState(0);
  const [actionFeedback, setActionFeedback] = useState<'like' | 'pass' | 'superlike' | null>(null);
  const [isStarAnimating, setIsStarAnimating] = useState(false);
  
  // Overlay content state
  const [overlayContent, setOverlayContent] = useState<React.ReactNode>(null);
  const [overlayOpacity, setOverlayOpacity] = useState(1);
  
  // Filter out null/empty photos to only render existing ones
  const validPhotos = useMemo(() => profile.photos.filter((p): p is string => !!p), [profile.photos]);


  // Reset state when profile changes
  useEffect(() => {
    setIsDetailsVisible(false);
    setPhotoIndex(0);
    setDeltaX(0);
    setActionFeedback(null);
    setIsStarAnimating(false);
    if (cardRef.current) {
        cardRef.current.style.transition = 'none';
        cardRef.current.style.transform = '';
        cardRef.current.style.opacity = '1';
    }
    if (imageContainerRef.current) {
        imageContainerRef.current.style.transition = 'none';
        imageContainerRef.current.style.filter = 'none';
    }
  }, [profile.id]);

  const toggleDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDetailsVisible(prev => !prev);
  };
  
  const handlePhotoChange = (newIndex: number) => {
    setOverlayOpacity(0);
    setTimeout(() => {
      setPhotoIndex(newIndex);
      setOverlayOpacity(1);
    }, 150); // Duration should be less than the slide animation
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDetailsVisible) return;
    if (validPhotos.length > 1) {
        handlePhotoChange((photoIndex + 1) % validPhotos.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isDetailsVisible) return;
     if (validPhotos.length > 1) {
        handlePhotoChange((photoIndex - 1 + validPhotos.length) % validPhotos.length);
    }
  };
  
  // --- Swipe Handlers ---
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isDetailsVisible) return;
    setIsSwiping(true);
    setStartX(e.clientX);
    if (cardRef.current) cardRef.current.style.transition = 'none';
    if (imageContainerRef.current) imageContainerRef.current.style.transition = 'none';
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isSwiping || !cardRef.current) return;
    const currentX = e.clientX;
    const dx = currentX - startX;
    setDeltaX(dx);
    
    // Efeito de Rotação mais pronunciado
    const rotation = dx * 0.08; 
    cardRef.current.style.transform = `translateX(${dx}px) rotate(${rotation}deg)`;

    // Efeito de Blur progressivo na imagem
    if (imageContainerRef.current) {
        const blurAmount = Math.min(Math.abs(dx) / 15, 8); // Max 8px blur
        imageContainerRef.current.style.filter = `blur(${blurAmount}px)`;
    }
  };
  
  const handlePointerUp = () => {
    if (!isSwiping || !cardRef.current) return;
    setIsSwiping(false);
    
    // Restaurar transições para animação suave
    cardRef.current.style.transition = 'transform 0.3s ease-out';
    if (imageContainerRef.current) {
        imageContainerRef.current.style.transition = 'filter 0.3s ease-out';
    }
    
    if (deltaX > SWIPE_THRESHOLD) { // Right swipe
      cardRef.current.style.transform = `translateX(100vw) rotate(30deg)`;
      onLike();
    } else if (deltaX < -SWIPE_THRESHOLD) { // Left swipe
      cardRef.current.style.transform = `translateX(-100vw) rotate(-30deg)`;
      onPass();
    } else { // Return to center
      cardRef.current.style.transform = '';
      if (imageContainerRef.current) {
          imageContainerRef.current.style.filter = 'none';
      }
    }
    setDeltaX(0);
  };
  
 const handleActionClick = (action: 'like' | 'pass' | 'superlike' | 'rewind') => {
      if (!cardRef.current) return;

      if (action === 'rewind') {
          onRewind();
          return;
      }
      
      if (action === 'superlike' && !currentUserProfile.isPremium) {
        onGoToSales();
        return;
      }

      setActionFeedback(action);

      setTimeout(() => {
          if (!cardRef.current) return;
          
          // Adiciona blur programaticamente ao clicar nos botões também
          if (imageContainerRef.current) {
              imageContainerRef.current.style.transition = 'filter 0.5s ease-in';
              imageContainerRef.current.style.filter = 'blur(4px)';
          }

          switch (action) {
              case 'like':
                  cardRef.current.style.transition = 'transform 0.5s ease-in';
                  cardRef.current.style.transform = `translateX(100vw) rotate(30deg)`;
                  onLike();
                  break;
              case 'pass':
                  cardRef.current.style.transition = 'transform 0.5s ease-in';
                  cardRef.current.style.transform = `translateX(-100vw) rotate(-30deg)`;
                  onPass();
                  break;
              case 'superlike':
                  cardRef.current.style.transition = 'transform 0.5s ease-in, opacity 0.5s ease-in';
                  cardRef.current.style.transform = `translateY(-100vh) rotate(15deg)`;
                  cardRef.current.style.opacity = '0';
                  onSuperLike();
                  break;
          }
      }, 200);
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsStarAnimating(true);
      setTimeout(() => setIsStarAnimating(false), 400); // Reset animation state
      onToggleFavorite();
  };

    const renderOverlayContent = (indexOverride?: number) => {
        const indexToRender = indexOverride ?? photoIndex;

        // Base content visible on all photos
        const mainInfoContent = (
            <>
                <h2 className="text-3xl font-bold text-white flex items-center">
                    {profile.name}, <span className="font-light">{profile.age}</span>
                    {profile.isVerified && <VerifiedBadgeIcon className="w-6 h-6 ml-2 text-white" />}
                </h2>
                <p className="text-md text-white/90 mb-1">
                    {distance !== null && t('distanceAway', { distance })}
                </p>
                {matchReason && photoIndex === 0 && ( // Show reason only on first photo
                    <div className="flex items-center gap-1.5 bg-amber-400/20 backdrop-blur-sm text-amber-100 text-xs font-semibold px-2 py-0.5 rounded-full w-fit">
                        <SparklesIcon className="w-3 h-3 text-amber-300" />
                        <span>{matchReason}</span>
                    </div>
                )}
            </>
        );

        let specificContent: React.ReactNode = null;

        // Photo-specific content that appears above the main info
        switch (indexToRender) {
            case 1:
                if (validPhotos[1]) {
                    specificContent = (
                        <div className="mb-2">
                            <div className="flex items-center mb-2">
                                <HeartIcon className="w-5 h-5 mr-3 text-red-400 flex-shrink-0" />
                                <p className="font-semibold text-lg">{t(profile.relationshipGoal)}</p>
                            </div>
                            <div className="flex items-center">
                                <CrossIcon className="w-5 h-5 mr-3 text-sky-400 flex-shrink-0" />
                                <p className="font-semibold text-lg">{profile.denomination}</p>
                            </div>
                        </div>
                    );
                }
                break;
            case 2:
                 if (validPhotos[2] && profile.keyValues.length > 0) {
                    specificContent = (
                        <div className="mb-2">
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-2">{t('keyFaithValues')}</h3>
                            <div className="flex flex-wrap">
                                {profile.keyValues.slice(0, 4).map(value => <OverlayInfoPill key={value}>{value}</OverlayInfoPill>)}
                            </div>
                        </div>
                    );
                 }
                break;
            case 3:
                if (validPhotos[3] && profile.interests.length > 0) {
                    specificContent = (
                        <div className="mb-2">
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-2">{t('interests')}</h3>
                            <div className="flex flex-wrap">
                                {profile.interests.slice(0, 4).map(interest => <OverlayInfoPill key={interest}>{interest}</OverlayInfoPill>)}
                            </div>
                        </div>
                    );
                }
                break;
            case 4:
                if (validPhotos[4] && profile.languages && profile.languages.length > 0) {
                    specificContent = (
                         <div className="mb-2">
                             <h3 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center"><ChatBubbleIcon className="w-4 h-4 mr-2"/>{t('languages')}</h3>
                            <div className="flex flex-wrap">
                                {profile.languages.slice(0, 4).map(lang => <OverlayInfoPill key={lang}>{lang}</OverlayInfoPill>)}
                            </div>
                        </div>
                    );
                }
                break;
            default:
                // No specific content for photo 0 or others
                specificContent = null;
        }

        return (
            <div className="flex justify-between items-end">
                <div>
                    {specificContent}
                    {mainInfoContent}
                </div>
                {!isDetailsVisible && (
                    <button onClick={toggleDetails} className="bg-white/20 backdrop-blur-sm text-white rounded-full p-2 z-10 flex-shrink-0">
                        <ChevronUpIcon className="w-6 h-6" />
                    </button>
                )}
            </div>
        );
    };


  return (
    <div className="w-full max-w-sm h-full max-h-[700px] flex flex-col" ref={cardRef} style={{ willChange: 'transform' }}>
        <div 
          className="relative w-full aspect-[3/4] bg-slate-800 rounded-2xl shadow-xl overflow-hidden touch-none select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp} // End swipe if mouse leaves
        >
          {/* Container Principal da Imagem */}
          <div 
            ref={imageContainerRef}
            className="relative w-full h-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onContextMenu={(e) => e.preventDefault()}
            style={{ willChange: 'filter' }}
          >
            {/* Sliding image container */}
            <div
                className="flex h-full transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${photoIndex * 100}%)` }}
            >
                {validPhotos.map((photo, index) => (
                    <img
                        key={index}
                        src={photo}
                        alt={`${profile.name} ${index + 1}`}
                        className="w-full h-full object-cover flex-shrink-0"
                        draggable={false}
                    />
                ))}
            </div>

             {/* Swipe Feedback Overlays */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-opacity z-20"
              style={{ 
                opacity: deltaX > 10 ? Math.min(deltaX / SWIPE_THRESHOLD, 1) : 0,
                transform: `rotate(-15deg) scale(${1 + Math.min(deltaX / SWIPE_THRESHOLD, 1) * 0.2})` 
              }}
            >
              <div className="border-4 border-green-400 rounded-full p-4 bg-green-400/20 backdrop-blur-sm">
                <HeartIcon className="w-16 h-16 text-green-400" />
              </div>
            </div>

            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-opacity z-20"
              style={{ 
                opacity: deltaX < -10 ? Math.min(Math.abs(deltaX) / SWIPE_THRESHOLD, 1) : 0,
                transform: `rotate(15deg) scale(${1 + Math.min(Math.abs(deltaX) / SWIPE_THRESHOLD, 1) * 0.2})` 
              }}
            >
              <div className="border-4 border-red-500 rounded-full p-4 bg-red-500/20 backdrop-blur-sm">
                <XIcon className="w-16 h-16 text-red-500" />
              </div>
            </div>
            
            {/* Click Action Feedback Overlays */}
            <div 
              className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ease-out z-30 ${
                actionFeedback ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
            >
              {actionFeedback === 'like' && (
                <div className="border-4 border-green-400 rounded-full p-4 bg-green-400/20 transform -rotate-15">
                  <HeartIcon className="w-16 h-16 text-green-400" />
                </div>
              )}
              {actionFeedback === 'pass' && (
                <div className="border-4 border-red-500 rounded-full p-4 bg-red-500/20 transform rotate-15">
                  <XIcon className="w-16 h-16 text-red-500" />
                </div>
              )}
              {actionFeedback === 'superlike' && (
                <div className="p-4 transform scale-125">
                  <HeartSparkleIcon className="w-24 h-24 text-sky-400 drop-shadow-[0_0_15px_rgba(56,189,248,0.8)]" />
                </div>
              )}
            </div>

            {/* Navegação de Fotos (barras no topo) */}
            <div className="absolute top-2 left-2 right-2 flex space-x-1 z-10">
              {validPhotos.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded-full ${index === photoIndex ? 'bg-white' : 'bg-white/50'}`}
                ></div>
              ))}
            </div>
            
            {/* Favorite Button (Star) */}
            <div className="absolute top-6 right-4 z-20">
                <Tooltip text={isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}>
                    <button
                        onClick={handleFavoriteClick}
                        className="p-2 transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                    >
                        <StarIcon 
                            className={`w-8 h-8 drop-shadow-md transition-colors duration-300 ${
                                isFavorite 
                                    ? 'text-amber-400 fill-current' // Estrela preenchida amarela
                                    : 'text-transparent stroke-white stroke-[1.5]' // Apenas contorno branco
                            } ${isStarAnimating ? 'animate-pop' : ''}`} 
                        />
                    </button>
                </Tooltip>
            </div>

            {/* Overlay com informações dinâmicas */}
            <div
                className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white transition-opacity duration-150 z-10"
                style={{ opacity: overlayOpacity }}
            >
                {renderOverlayContent()}
            </div>


            {/* Áreas de clique para trocar de foto (para mobile) */}
            {validPhotos.length > 1 && !isDetailsVisible && (
              <>
                <div className="absolute top-0 left-0 h-full w-1/2 z-10" onClick={prevPhoto}></div>
                <div className="absolute top-0 right-0 h-full w-1/2 z-10" onClick={nextPhoto}></div>
              </>
            )}

            {/* Botões de Navegação (para desktop) */}
            {isHovered && validPhotos.length > 1 && !isDetailsVisible && (
                <>
                    <button
                        onClick={prevPhoto}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full z-20 hover:bg-black/60 transition-colors"
                        aria-label={t('previousPhoto')}
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextPhoto}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-1 rounded-full z-20 hover:bg-black/60 transition-colors"
                        aria-label={t('nextPhoto')}
                    >
                        <ChevronRightIcon className="w-6 h-6" />
                    </button>
                </>
            )}
          </div>

          {/* Painel de Detalhes (deslizável) */}
          <div className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl transform transition-transform duration-300 ease-in-out ${isDetailsVisible ? 'translate-y-0' : 'translate-y-full'} max-h-full flex flex-col z-30`}>
            <button onClick={toggleDetails} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-20">
                <ChevronDownIcon className="w-7 h-7" />
            </button>

            <div className={`overflow-y-auto p-4 pb-16 transition-opacity duration-200 ${isDetailsVisible ? 'opacity-100 delay-200' : 'opacity-0'}`}>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center">
                    {profile.name}, <span className="font-light">{profile.age}</span>
                    {profile.isVerified && <VerifiedBadgeIcon className="w-6 h-6 ml-2 text-sky-500" />}
                </h2>
                <p className="text-sm text-slate-500 mb-3">
                    {distance !== null 
                        ? t('distanceAway', { distance }) 
                        : (profile.location !== t('locationObtained') ? profile.location : '')}
                </p>
                {matchReason && (
                    <div className="mb-3 flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded-full w-fit">
                        <SparklesIcon className="w-4 h-4 text-amber-600" />
                        <span>{matchReason}</span>
                    </div>
                )}
                <p className="text-slate-700 text-sm mb-4">{profile.bio}</p>

                <div className="border-t border-slate-200 pt-3">
                <h3 className="text-sm font-bold text-sky-800 mb-2">{t('keyFaithValues')}</h3>
                <div className="flex flex-wrap">
                    <InfoPill>{profile.denomination}</InfoPill>
                    <InfoPill>Igreja: {t(profile.churchFrequency)}</InfoPill>
                    {profile.keyValues.map((value) => (
                    <InfoPill key={value}>{value}</InfoPill>
                    ))}
                </div>
                </div>

                <div className="border-t border-slate-200 pt-3 mt-3">
                <h3 className="text-sm font-bold text-sky-800 mb-2">{t('interests')}</h3>
                <div className="flex flex-wrap">
                    {profile.interests.map((interest) => (
                    <InfoPill key={interest}>{interest}</InfoPill>
                    ))}
                </div>
                </div>
                <div className="pt-4 mt-2 text-center flex justify-center gap-6">
                    <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600" onClick={onBlock}>
                        <UserMinusIcon className="w-4 h-4" /> {t('blockUser', { name: profile.name })}
                    </button>
                    <button className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-amber-600" onClick={onReport}>
                        <FlagIcon className="w-4 h-4" /> {t('report')}
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* --- BARRA DE AÇÃO PERMANENTE --- */}
        <div className="flex-shrink-0 bg-transparent py-2 flex justify-center items-center gap-x-4">
            <Tooltip text={t('rewind')}>
                <button
                    onClick={() => handleActionClick('rewind')}
                    className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-amber-500 border-2 border-slate-200 hover:scale-110 transition-transform"
                    aria-label={t('rewind')}
                >
                    <RewindIcon className="w-7 h-7"/>
                </button>
            </Tooltip>
            <Tooltip text={t('pass')}>
                <button
                    onClick={() => handleActionClick('pass')}
                    className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-red-500 border-2 border-slate-200 hover:scale-110 transition-transform"
                    aria-label={t('pass')}
                >
                    <XIcon className="w-8 h-8"/>
                </button>
            </Tooltip>
            <Tooltip text={t('like')}>
                <button
                    onClick={() => handleActionClick('like')}
                    className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center text-green-500 border-2 border-slate-200 hover:scale-110 transition-transform"
                    aria-label={t('like')}
                >
                    <HeartIcon className="w-10 h-10"/>
                </button>
            </Tooltip>
            <div className="relative">
                <Tooltip text={t('superLike')}>
                    <button
                        onClick={() => handleActionClick('superlike')}
                        className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-sky-500 border-2 border-slate-200 hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:text-slate-400"
                        aria-label={t('superLike')}
                    >
                        <HeartSparkleIcon className="w-8 h-8"/>
                        {currentUserProfile.isPremium && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-sky-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                                {currentUserProfile.superLikesRemaining ?? 0}
                            </span>
                        )}
                    </button>
                </Tooltip>
                 {!currentUserProfile.isPremium && (
                    <div className="absolute -right-2 -top-2">
                        <Tooltip text={t('superLikeTooltip')}>
                            <InformationCircleIcon className="w-5 h-5 text-sky-500 cursor-help" />
                        </Tooltip>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};