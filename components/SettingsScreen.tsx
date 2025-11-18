// FIX: Re-created the SettingsScreen component to resolve module and parsing errors.
import React, { useState, useEffect } from 'react';
import { UserProfile, VerificationStatus } from '../types';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { BellIcon } from './icons/BellIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { QuestionMarkCircleIcon } from './icons/QuestionMarkCircleIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';
import { PauseIcon } from './icons/PauseIcon';
import { TrashIcon } from './icons/TrashIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { subscribeUserToPush, unsubscribeUserFromPush, getSubscriptionState } from '../lib/notificationUtils';
import { Tooltip } from './Tooltip';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { VerifiedBadgeIcon } from './icons/VerifiedBadgeIcon';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { GlobeIcon } from './icons/GlobeIcon';
import { useToast } from '../contexts/ToastContext';


interface SettingsScreenProps {
    currentUserProfile: UserProfile | null;
    onClose: () => void;
    onEditProfile: () => void;
    onSignOut: () => void;
    onToggleInvisibleMode: () => void;
    onTogglePauseAccount: () => void;
    onDeleteAccountRequest: () => void;
    onShowPrivacyPolicy: () => void;
    onShowTermsOfUse: () => void;
    onShowCookiePolicy: () => void;
    onShowCommunityRules: () => void;
    onShowSafetyTips: () => void;
    onShowHelpAndSupport: () => void;
    onVerifyProfileRequest: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="px-4 pb-2 text-sm font-bold text-slate-500 uppercase">{title}</h2>
        <div className="bg-white rounded-lg shadow-sm divide-y divide-slate-200">{children}</div>
    </div>
);

const SettingItem: React.FC<{
    icon: React.ReactNode;
    title: React.ReactNode;
    subtitle?: string;
    onClick?: () => void;
    action?: React.ReactNode;
}> = ({ icon, title, subtitle, onClick, action }) => (
    <div onClick={onClick} className={`flex items-center p-4 first:rounded-t-lg last:rounded-b-lg ${onClick ? 'cursor-pointer hover:bg-slate-50' : ''}`}>
        <div className="mr-4 text-slate-500">{icon}</div>
        <div className="flex-grow">
            <h3 className="font-bold text-slate-800">{title}</h3>
            {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        {action && <div className="ml-4">{action}</div>}
    </div>
);

const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }> = ({ checked, onChange, disabled }) => (
    <button
        role="switch"
        aria-checked={checked}
        onClick={() => !disabled && onChange(!checked)}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-sky-500' : 'bg-slate-300'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-6' : ''}`}></div>
    </button>
);

const VerificationStatusBadge: React.FC<{ status: VerificationStatus }> = ({ status }) => {
    const styles = {
        [VerificationStatus.VERIFIED]: "bg-green-100 text-green-800",
        [VerificationStatus.PENDING]: "bg-amber-100 text-amber-800",
        [VerificationStatus.REJECTED]: "bg-red-100 text-red-800",
        [VerificationStatus.NOT_VERIFIED]: "bg-slate-100 text-slate-800",
    };
    return (
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status]}`}>
            {status}
        </span>
    );
};


export const SettingsScreen: React.FC<SettingsScreenProps> = ({
    currentUserProfile,
    onClose,
    onEditProfile,
    onSignOut,
    onToggleInvisibleMode,
    onTogglePauseAccount,
    onDeleteAccountRequest,
    onShowPrivacyPolicy,
    onShowTermsOfUse,
    onShowCookiePolicy,
    onShowCommunityRules,
    onShowSafetyTips,
    onShowHelpAndSupport,
    onVerifyProfileRequest,
}) => {
    const [notificationStatus, setNotificationStatus] = useState<NotificationPermission | 'loading'>('loading');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const { language, setLanguage, t } = useLanguage();
    const { addToast } = useToast();
    
    useEffect(() => {
        getSubscriptionState().then(state => {
            setNotificationStatus(state.permission);
            setIsSubscribed(state.isSubscribed);
        });
    }, []);

    const handleNotificationToggle = async () => {
        setNotificationStatus('loading');
        if (isSubscribed) {
            await unsubscribeUserFromPush();
            setIsSubscribed(false);
            // A permissão continua 'granted', apenas a inscrição é removida
            setNotificationStatus(Notification.permission);
        } else {
            try {
                await subscribeUserToPush();
                setIsSubscribed(true);
                setNotificationStatus('granted');
            } catch (error) {
                console.error("Falha ao ativar notificações:", error instanceof Error ? error.message : error);
                // Atualiza o status caso o usuário negue a permissão no prompt
                setNotificationStatus(Notification.permission);
            }
        }
    };

    const getButtonState = () => {
        if (notificationStatus === 'loading') {
            return { text: t('notificationsLoading'), disabled: true, subtitle: 'Verificando status...' };
        }
        if (notificationStatus === 'denied') {
            return { text: t('notificationsBlocked'), disabled: true, subtitle: t('notificationsBlockedDesc') };
        }
        if (isSubscribed) {
            return { text: t('notificationActionDeactivate'), disabled: false, subtitle: t('notificationsOn') };
        }
        return { text: t('notificationActionActivate'), disabled: false, subtitle: t('notificationsOff') };
    };

    const buttonState = getButtonState();
    
    const handleInvisibleToggle = () => {
        if (!currentUserProfile?.isPremium) {
            addToast({ type: 'info', message: 'Modo Invisível é um recurso Premium. Faça upgrade para ativá-lo!' });
            return;
        }
        onToggleInvisibleMode();
    };
    
    const faceVerificationStatus = currentUserProfile?.face_verification_status || VerificationStatus.NOT_VERIFIED;
    const canVerify = faceVerificationStatus === VerificationStatus.NOT_VERIFIED || faceVerificationStatus === VerificationStatus.REJECTED;

    return (
        <div className="fixed inset-0 z-30 bg-slate-100 flex flex-col animate-slide-in-right">
            <header className="bg-white p-4 flex items-center shadow-sm sticky top-0 z-20">
                <button onClick={onClose} className="p-2 -ml-2 mr-2">
                    <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
                </button>
                <h1 className="text-xl font-bold text-slate-800">{t('settings')}</h1>
            </header>

            <main className="flex-grow overflow-y-auto p-4 pb-24">
                <Section title={t('account')}>
                    <SettingItem icon={<UserCircleIcon className="w-6 h-6" />} title={t('editProfile')} subtitle={t('editProfileDesc')} onClick={onEditProfile} />
                    <SettingItem
                        icon={<VerifiedBadgeIcon className="w-6 h-6" />}
                        title="Verificação de Identidade (Selfie)"
                        subtitle={
                            faceVerificationStatus === VerificationStatus.REJECTED 
                            ? "Sua verificação foi rejeitada. Tente novamente."
                            : "Garanta a segurança da comunidade e ganhe um selo."
                        }
                        onClick={canVerify ? onVerifyProfileRequest : undefined}
                        action={
                           canVerify ? (
                                <span className="text-sm font-bold text-sky-600">{t('verifyNow')}</span>
                           ) : (
                               <VerificationStatusBadge status={faceVerificationStatus} />
                           )
                        }
                    />
                    <SettingItem icon={<CreditCardIcon className="w-6 h-6" />} title={t('manageSubscription')} subtitle={currentUserProfile?.isPremium ? t('manageSubscriptionDescPremium') : t('manageSubscriptionDescFree')} onClick={() => addToast({type: 'info', message: "A gestão de assinaturas será implementada aqui."})} />
                </Section>
                
                <Section title={t('languageSettings')}>
                     <SettingItem 
                        icon={<GlobeIcon className="w-6 h-6" />} 
                        title={t('language')} 
                        subtitle={t('languageSubtitle')}
                        action={
                            <select 
                                value={language} 
                                onChange={(e) => setLanguage(e.target.value as 'pt' | 'en')}
                                className="border-slate-300 rounded-md text-sm p-1"
                            >
                                <option value="pt">{t('languagePortuguese')}</option>
                                <option value="en">{t('languageEnglish')}</option>
                            </select>
                        }
                    />
                </Section>

                <Section title={t('visibility')}>
                    <SettingItem
                        icon={<EyeSlashIcon className="w-6 h-6" />}
                        title={
                           <div className="flex items-center gap-2">
                                <span>{t('invisibleMode')}</span>
                                {!currentUserProfile?.isPremium && (
                                    <Tooltip text={t('invisibleModeTooltip')}>
                                        <InformationCircleIcon className="w-4 h-4 text-sky-500 cursor-help" />
                                    </Tooltip>
                                )}
                            </div>
                        }
                        subtitle={t('invisibleModeDesc')}
                        action={<Toggle checked={currentUserProfile?.isInvisibleMode || false} onChange={handleInvisibleToggle} disabled={!currentUserProfile?.isPremium} />}
                    />
                    <SettingItem
                        icon={<PauseIcon className="w-6 h-6" />}
                        title={t('pauseAccount')}
                        subtitle={currentUserProfile?.isPaused ? t('pauseAccountDescPaused') : t('pauseAccountDescActive')}
                        action={<Toggle checked={currentUserProfile?.isPaused || false} onChange={onTogglePauseAccount} />}
                    />
                </Section>
                
                <Section title={t('notifications')}>
                    <SettingItem
                        icon={<BellIcon className="w-6 h-6" />}
                        title={t('newAlerts')}
                        subtitle={buttonState.subtitle}
                        action={
                             <button
                                onClick={handleNotificationToggle}
                                disabled={buttonState.disabled}
                                className={`text-sm font-bold py-1 px-3 rounded-full ${buttonState.disabled ? 'bg-slate-200 text-slate-500' : 'bg-sky-500 text-white'}`}
                            >
                                {buttonState.text}
                            </button>
                        }
                    />
                </Section>
                
                 <Section title={t('legal')}>
                    <SettingItem icon={<ShieldCheckIcon className="w-6 h-6" />} title={t('privacyPolicy')} onClick={onShowPrivacyPolicy} />
                    <SettingItem icon={<BookOpenIcon className="w-6 h-6" />} title={t('termsOfUse')} onClick={onShowTermsOfUse} />
                    <SettingItem icon={<BookOpenIcon className="w-6 h-6" />} title={t('cookiePolicy')} onClick={onShowCookiePolicy} />
                </Section>
                
                <Section title={t('community')}>
                    <SettingItem icon={<BookOpenIcon className="w-6 h-6" />} title={t('communityRules')} onClick={onShowCommunityRules} />
                    <SettingItem icon={<ShieldCheckIcon className="w-6 h-6" />} title={t('safetyTips')} onClick={onShowSafetyTips} />
                </Section>

                 <Section title={t('support')}>
                    <SettingItem icon={<QuestionMarkCircleIcon className="w-6 h-6" />} title={t('helpAndSupport')} onClick={onShowHelpAndSupport} />
                </Section>
                
                 <Section title="Logout & Exclusão">
                    <SettingItem icon={<TrashIcon className="w-6 h-6 text-red-500" />} title={<span className="text-red-600">{t('deleteAccount')}</span>} onClick={onDeleteAccountRequest} />
                </Section>

                <div className="mt-8 text-center">
                    <button
                        onClick={onSignOut}
                        className="text-slate-500 font-semibold hover:text-red-600 transition-colors"
                    >
                        {t('signOut')}
                    </button>
                </div>
            </main>
        </div>
    );
};