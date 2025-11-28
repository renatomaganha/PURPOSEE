import React from 'react';
import { DynamicLogo } from './DynamicLogo';
import { HeartIcon } from './icons/HeartIcon';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';
import { ChatBubblesIconLanding } from './icons/ChatBubblesIconLanding';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingPageProps {
  logoUrl: string | null;
  onEnter: () => void;
  onShowPrivacyPolicy: () => void;
  onShowTermsOfUse: () => void;
}

const Feature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex items-start">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-1 text-slate-400">{description}</p>
        </div>
    </div>
);


export const LandingPage: React.FC<LandingPageProps> = ({ logoUrl, onEnter, onShowPrivacyPolicy, onShowTermsOfUse }) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col items-center justify-between p-6">
      <div className="flex-grow flex flex-col items-center justify-center text-center">
        <DynamicLogo logoUrl={logoUrl} className="w-28 h-28 drop-shadow-[0_0_8px_rgba(200,200,210,0.2)]" />
        <h1 className="text-4xl font-bold mt-4">{t('landingTitle')}</h1>
        <p className="mt-2 text-lg text-slate-300">{t('landingSubtitle')}</p>

        <div className="mt-12 space-y-6 text-left max-w-sm">
             <Feature 
                icon={<HeartIcon className="w-7 h-7 text-sky-400" />}
                title={t('findYourMatch')}
                description={t('findYourMatchDesc')}
            />
             <Feature 
                icon={<CheckBadgeIcon className="w-7 h-7 text-sky-400" />}
                title={t('safeCommunity')}
                description={t('safeCommunityDesc')}
            />
             <Feature 
                icon={<ChatBubblesIconLanding className="w-7 h-7 text-sky-400" />}
                title={t('intentionalConvos')}
                description={t('intentionalConvosDesc')}
            />
        </div>
      </div>
      
      <div className="w-full max-w-sm flex-shrink-0">
        <button
          onClick={onEnter}
          className="w-full bg-sky-600 font-bold py-4 px-6 rounded-full shadow-lg hover:bg-sky-700 transition-transform transform hover:scale-105"
        >
          {t('enterOrCreate')}
        </button>
        <p className="text-xs text-slate-500 mt-8 text-center">
            {t('byContinuing')}{' '}
            <button onClick={onShowTermsOfUse} className="underline hover:text-white">{t('termsOfUse')}</button> e{' '}
            <button onClick={onShowPrivacyPolicy} className="underline hover:text-white">{t('privacyPolicy')}</button>.
        </p>
      </div>
    </div>
  );
};