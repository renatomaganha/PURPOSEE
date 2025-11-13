import React from 'react';
import { AdminView } from '../AdminApp';
import { HomeIcon } from '../icons/HomeIcon';
import { UsersIcon } from '../icons/UsersIcon';
import { MegaphoneIcon } from '../icons/MegaphoneIcon';
import { ChartBarIcon } from '../icons/ChartBarIcon';
import { LinkIcon } from '../icons/LinkIcon';
import { ShieldExclamationIcon } from '../icons/ShieldExclamationIcon';
import { TicketIcon } from '../icons/TicketIcon';
import { DynamicLogo } from '../../components/DynamicLogo';
import { ArrowRightOnRectangleIcon } from '../icons/ArrowRightOnRectangleIcon';
import { TagIcon } from '../icons/TagIcon';
import { FaceIdIcon } from '../icons/FaceIdIcon';

interface SidebarProps {
  logoUrl: string | null;
  activeView: AdminView;
  onNavigate: (view: AdminView) => void;
  pendingReportsCount: number;
  pendingTicketsCount: number;
  pendingVerificationsCount: number;
  onSignOut: () => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
    badgeCount?: number;
}> = ({ icon, label, isActive, onClick, badgeCount }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
            isActive 
                ? 'bg-sky-600 text-white' 
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }`}
    >
        {icon}
        <span className="ml-3">{label}</span>
        {badgeCount && badgeCount > 0 ? (
            <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {badgeCount}
            </span>
        ) : null}
    </button>
);


export const Sidebar: React.FC<SidebarProps> = ({ logoUrl, activeView, onNavigate, pendingReportsCount, pendingTicketsCount, pendingVerificationsCount, onSignOut }) => {
    return (
        <aside className="w-64 bg-slate-800 text-white flex flex-col flex-shrink-0">
            <div className="flex items-center justify-center h-20 border-b border-slate-700">
                <DynamicLogo logoUrl={logoUrl} className="w-12 h-12 object-contain drop-shadow-[0_0_5px_rgba(200,200,210,0.2)]" />
                <h1 className="text-xl font-bold ml-2">Admin</h1>
            </div>
            <nav className="flex-grow p-4 space-y-2">
                <NavItem 
                    icon={<HomeIcon className="w-5 h-5" />}
                    label="Dashboard"
                    isActive={activeView === 'dashboard'}
                    onClick={() => onNavigate('dashboard')}
                />
                 <NavItem 
                    icon={<UsersIcon className="w-5 h-5" />}
                    label="Usuários"
                    isActive={activeView === 'users'}
                    onClick={() => onNavigate('users')}
                />
                <NavItem 
                    icon={<FaceIdIcon className="w-5 h-5" />}
                    label="Verificações"
                    isActive={activeView === 'face_verifications'}
                    onClick={() => onNavigate('face_verifications')}
                    badgeCount={pendingVerificationsCount}
                />
                 <NavItem 
                    icon={<MegaphoneIcon className="w-5 h-5" />}
                    label="Marketing"
                    isActive={activeView === 'marketing'}
                    onClick={() => onNavigate('marketing')}
                />
                 <NavItem 
                    icon={<ChartBarIcon className="w-5 h-5" />}
                    label="Analytics"
                    isActive={activeView === 'analytics'}
                    onClick={() => onNavigate('analytics')}
                />
                 <NavItem 
                    icon={<LinkIcon className="w-5 h-5" />}
                    label="Afiliados"
                    isActive={activeView === 'affiliates'}
                    onClick={() => onNavigate('affiliates')}
                />
                 <NavItem 
                    icon={<ShieldExclamationIcon className="w-5 h-5" />}
                    label="Denúncias"
                    isActive={activeView === 'reports'}
                    onClick={() => onNavigate('reports')}
                    badgeCount={pendingReportsCount}
                />
                <NavItem 
                    icon={<TicketIcon className="w-5 h-5" />}
                    label="Suporte"
                    isActive={activeView === 'support'}
                    onClick={() => onNavigate('support')}
                    badgeCount={pendingTicketsCount}
                />
                 <NavItem 
                    icon={<TagIcon className="w-5 h-5" />}
                    label="Tags"
                    isActive={activeView === 'tags'}
                    onClick={() => onNavigate('tags')}
                />
            </nav>
            <div className="p-4 border-t border-slate-700">
                 <button
                    onClick={onSignOut}
                    className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span className="ml-3">Sair</span>
                </button>
            </div>
        </aside>
    );
};