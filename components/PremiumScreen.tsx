import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { UserProfile } from '../types';
import { BoltIcon } from './icons/BoltIcon';
import { HeartSparkleIcon } from './icons/HeartSparkleIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { FilterIcon } from './icons/FilterIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';
import { StarIcon } from './icons/StarIcon';
import { VerifiedBadgeIcon } from './icons/VerifiedBadgeIcon';
import { Tooltip } from './Tooltip';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { useToast } from '../contexts/ToastContext';


interface PremiumScreenProps {
    currentUserProfile: UserProfile | null;
    onEditProfile: () => void;
    onNavigateToSales: () => void;
    isPremiumSaleActive: boolean;
    onToggleInvisibleMode: () => void;
    onSignOut: () => void;
}

const calculateProfileCompletion = (profile: UserProfile | null): number => {
    if (!profile) return 0;
    
    const fields = [
        profile.photos && profile.photos.filter(p => p).length > 0,
        !!profile.name,
        !!profile.age,
        !!profile.height,
        !!profile.gender,
        !!profile.relationshipGoal,
        !!profile.maritalStatus,
        !!profile.bio,
        !!profile.location,
        !!profile.denomination,
        !!profile.churchFrequency,
        !!profile.churchName,
        !!profile.favoriteVerse,
        !!profile.favoriteSong,
        !!profile.favoriteBook,
        profile.keyValues && profile.keyValues.length > 0,
        profile.interests && profile.interests.length > 0,
    ];

    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
};

const PremiumBenefit: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}> = ({ icon, title, description, onClick }) => (
    <div onClick={onClick} className="bg-white p-4 rounded-lg shadow-md flex items-center cursor-pointer hover:shadow-lg transition-shadow">
        <div className="p-2 bg-sky-100 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <h3 className="font-bold">{title}</h3>
            <p className="text-sm text-slate-500">{description}</p>
        </div>
    </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <h2 className="px-4 pb-2 text-sm font-bold text-slate-500 uppercase">{title}</h2>
        <div className="space-y-2">{children}</div>
    </div>
);

const SettingItem: React.FC<{
    icon: React.ReactNode;
    title: React.ReactNode;
    subtitle?: string;
    onClick?: () => void;
    action?: React.ReactNode;
}> = ({ icon, title, subtitle, onClick, action }) => (
    <div onClick={onClick} className={`flex items-center p-4 bg-white rounded-lg shadow-sm ${onClick ? 'cursor-pointer hover:bg-slate-50' : ''}`}>
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


export const PremiumScreen: React.FC<PremiumScreenProps> = ({ currentUserProfile, onEditProfile, onNavigateToSales, isPremiumSaleActive, onToggleInvisibleMode, onSignOut }) => {
    const { addToast } = useToast();

    const handleFeatureClick = () => {
        addToast({ type: 'info', message: 'Este é um recurso Premium! Clique em "Seja Premium" para saber mais.' });
        onNavigateToSales();
    };

    const handleInvisibleToggle = () => {
        if (!currentUserProfile?.isPremium) {
            addToast({ type: 'info', message: 'Modo Invisível é um recurso Premium. Faça upgrade para ativá-lo!' });
            return;
        }
        onToggleInvisibleMode();
    };

    const completionPercentage = calculateProfileCompletion(currentUserProfile);
    
    const benefits = [
        {
            icon: <BoltIcon className="w-6 h-6 text-sky-600" />,
            title: "1 Impulso por Semana",
            description: "Fique no topo das pesquisas por 60 minutos."
        },
        {
            icon: <HeartSparkleIcon className="w-6 h-6 text-sky-600" />,
            title: "4 Super Conexões por Semana",
            description: "Mostre que seu interesse é especial."
        },
         {
            icon: <PaperAirplaneIcon className="w-6 h-6 text-sky-600" />,
            title: "4 Mensagens Diretas por Semana",
            description: "Envie mensagens mesmo sem um match."
        },
        {
            icon: <FilterIcon className="w-6 h-6 text-sky-600" />,
            title: "Filtros Avançados",
            description: "Filtre por denominação, frequência e mais."
        },
        {
            icon: <EyeSlashIcon className="w-6 h-6 text-sky-600" />,
            title: "Modo Anônimo",
            description: "Seu perfil só será visto por quem você curtir."
        },
    ];

    return (
        <div className="p-4 bg-slate-100 text-slate-800 min-h-full">

            {/* Profile Banner */}
            {currentUserProfile && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div className="flex items-center">
                        <img src={currentUserProfile.photos[0]} alt={currentUserProfile.name} className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-sky-200" />
                        <div className="flex-grow">
                             <div className="flex items-center">
                                <h2 className="font-bold text-xl">{currentUserProfile.name}, <span className="font-light">{currentUserProfile.age}</span></h2>
                                {currentUserProfile.isVerified && <VerifiedBadgeIcon className="w-6 h-6 ml-2 text-sky-500" />}
                            </div>
                            <button onClick={onEditProfile} className="text-sm font-semibold text-sky-600 hover:underline">
                                Editar Perfil
                            </button>
                        </div>
                    </div>
                    {currentUserProfile.isInvisibleMode && (
                        <div className="mt-3 p-2 bg-slate-100 rounded-md flex items-center text-sm text-slate-600">
                            <EyeSlashIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                            <span>O Modo Invisível está <strong>ativado</strong>.</span>
                        </div>
                    )}
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                             <p className="text-sm font-semibold text-slate-600">Perfil Completo</p>
                             <span className="text-sm font-bold text-sky-700">{completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2.5">
                            <div className="bg-sky-600 h-2.5 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
                        </div>
                    </div>
                </div>
            )}
            
            <Section title="Controles de Visibilidade">
                <SettingItem
                    icon={<EyeSlashIcon className="w-6 h-6" />}
                    title={
                        <div className="flex items-center gap-2">
                            <span>Modo Invisível (Premium)</span>
                            {!currentUserProfile?.isPremium && (
                                <Tooltip text="Navegue com privacidade. Seu perfil só será visto pelas pessoas que você curtir.">
                                    <InformationCircleIcon className="w-4 h-4 text-sky-500 cursor-help" />
                                </Tooltip>
                            )}
                        </div>
                    }
                    subtitle="Seu perfil só será visto por quem você curtir."
                    action={<Toggle checked={currentUserProfile?.isInvisibleMode || false} onChange={handleInvisibleToggle} disabled={!currentUserProfile?.isPremium} />}
                />
            </Section>
            
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-4 rounded-lg shadow-md mb-6">
                <div className="flex items-center mb-2">
                    <StarIcon className="w-6 h-6 text-amber-300 mr-3" />
                    <h3 className="font-bold text-lg">Plano Básico</h3>
                </div>
                <p className="text-sm text-slate-300 mb-3">
                    Você tem limite de <strong>30 curtidas diárias</strong> e só pode ver quem te curtiu caso obtenha um match mútuo.
                </p>
                <p className="text-sm font-semibold text-white">
                    Não perca a oportunidade de encontrar sua conexão divina,{' '}
                    <button onClick={onNavigateToSales} className="underline font-bold hover:text-amber-300 transition">
                        seja um usuário premium!
                    </button>
                </p>
            </div>
            
            {isPremiumSaleActive && (
                 <div className="my-6">
                    <button
                        onClick={onNavigateToSales}
                        className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-center animate-pulse"
                    >
                        <span className="text-lg">✨ OFERTA ESPECIAL ATIVADA ✨</span>
                        <span className="block text-sm font-normal">Clique aqui e veja os descontos exclusivos!</span>
                    </button>
                </div>
            )}


            <div className="text-center mb-6">
                <SparklesIcon className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                <h1 className="text-2xl font-bold text-sky-800">Melhore a tua experiência</h1>
                <p className="text-slate-600 mt-1">Leve sua busca por uma conexão divina para o próximo nível.</p>
            </div>

            <div className="space-y-4">
                {benefits.map((benefit, index) => (
                    <PremiumBenefit
                        key={index}
                        icon={benefit.icon}
                        title={benefit.title}
                        description={benefit.description}
                        onClick={handleFeatureClick}
                    />
                ))}
            </div>

            <div className="mt-8">
                <button
                    onClick={onNavigateToSales}
                    className="w-full bg-amber-400 text-amber-900 font-bold py-3 px-6 rounded-full shadow-lg hover:bg-amber-500 transition-transform transform hover:scale-105"
                >
                    Seja Premium
                </button>
            </div>

            <div className="mt-8 text-center">
                 <button
                    onClick={onSignOut}
                    className="text-slate-500 font-semibold hover:text-red-600 transition-colors"
                >
                    Sair (Logout)
                </button>
            </div>
        </div>
    );
};