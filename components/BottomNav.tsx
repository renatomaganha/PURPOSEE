import React from 'react';
import { ExploreIcon } from './icons/ExploreIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { FilterIcon } from './icons/FilterIcon';
import { GearIcon } from './icons/GearIcon';
import { HeartIcon } from './icons/HeartIcon';
import { BellIcon } from './icons/BellIcon';
import { BoltIcon } from './icons/BoltIcon';
import { Tooltip } from './Tooltip';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface BottomNavProps {
  activeView: 'profiles' | 'matches' | 'premium' | 'messages';
  onNavigate: (view: 'profiles' | 'matches' | 'premium' | 'messages') => void;
  onFilterClick: () => void;
  onSettingsClick: () => void;
  matchCount: number;
  unreadMessagesCount: number;
  isPremium: boolean;
  boostCount: number;
  isBoostActive: boolean;
  onBoostClick: () => void;
  boostTimeRemaining: number | null;
  boostDuration: number;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badgeCount?: number;
  isSpecial?: boolean;
  disabled?: boolean;
  hasTooltip?: boolean;
  tooltipText?: string;
}> = ({ icon, label, isActive, onClick, badgeCount, isSpecial = false, disabled = false, hasTooltip, tooltipText }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center justify-center flex-1 pt-2 pb-1 transition-colors duration-200 relative ${
      isActive ? 'text-sky-600' : isSpecial ? 'text-amber-500 hover:text-amber-600' : 'text-slate-500 hover:text-sky-500'
    } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-slate-500`}
  >
    {badgeCount && badgeCount > 0 ? (
       <span className="absolute top-1 right-[20%] w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
        {badgeCount}
      </span>
    ) : null}
     {hasTooltip && tooltipText && (
        <div className="absolute top-0 right-1.5">
            <Tooltip text={tooltipText}>
                <InformationCircleIcon className="w-4 h-4 text-slate-400 cursor-help" />
            </Tooltip>
        </div>
    )}
    <Tooltip text={label}>
        {icon}
    </Tooltip>
    <span className="text-xs mt-1">{label}</span>
  </button>
);

export const BottomNav: React.FC<BottomNavProps> = ({ 
    activeView, 
    onNavigate, 
    matchCount, 
    unreadMessagesCount, 
    onFilterClick, 
    onSettingsClick,
    isPremium,
    boostCount,
    isBoostActive,
    onBoostClick,
    boostTimeRemaining,
    boostDuration
}) => {
  const { t } = useLanguage();
  return (
    <div className="flex-shrink-0 h-16 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around z-20">
      <NavItem
        icon={<ExploreIcon className="w-6 h-6" />}
        label={t('explore')}
        isActive={activeView === 'profiles'}
        onClick={() => onNavigate('profiles')}
      />
      <NavItem
        icon={<FilterIcon className="w-6 h-6" />}
        label={t('filters')}
        isActive={false}
        onClick={onFilterClick}
      />
      <NavItem
        icon={
            <div className="relative flex items-center justify-center h-6 w-6">
                {isBoostActive && boostTimeRemaining !== null && (
                    <svg className="absolute -top-1.5 -left-1.5 w-9 h-9 transform -rotate-90" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" fill="transparent" className="text-amber-200/70"/>
                        <circle 
                            cx="10" 
                            cy="10" 
                            r="9" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            fill="transparent" 
                            className="text-amber-500"
                            strokeLinecap="round"
                            strokeDasharray={2 * Math.PI * 9}
                            strokeDashoffset={2 * Math.PI * 9 * (1 - (boostTimeRemaining / boostDuration))}
                            style={{ transition: 'stroke-dashoffset 1s linear' }}
                        />
                    </svg>
                )}
                 <BoltIcon className={`w-6 h-6 transition-colors ${isBoostActive ? 'text-amber-500' : ''}`} />
            </div>
        }
        label={t('boost')}
        isActive={isBoostActive}
        isSpecial={true}
        onClick={onBoostClick}
        badgeCount={boostCount}
        disabled={!isPremium}
        hasTooltip={!isPremium}
        tooltipText={t('boostTooltip')}
      />
       <NavItem
        icon={<HeartIcon className="w-6 h-6" />}
        label={t('likes')}
        isActive={activeView === 'matches'}
        onClick={() => onNavigate('matches')}
        badgeCount={matchCount}
      />
       <NavItem
        icon={<BellIcon className="w-6 h-6" />}
        label={t('messages')}
        isActive={activeView === 'messages'}
        onClick={() => onNavigate('messages')}
        badgeCount={unreadMessagesCount}
      />
      <NavItem
        icon={<SparklesIcon className="w-6 h-6" />}
        label={t('premium')}
        isActive={activeView === 'premium'}
        onClick={() => onNavigate('premium')}
      />
       <NavItem
        icon={<GearIcon className="w-6 h-6" />}
        label={t('settings')}
        isActive={false}
        onClick={onSettingsClick}
      />
    </div>
  );
};