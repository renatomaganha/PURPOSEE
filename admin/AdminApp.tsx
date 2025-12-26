import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { UserManagement } from './components/UserManagement';
import { MarketingTools } from './components/MarketingTools';
import { Analytics } from './components/Analytics';
import { AffiliateManagement } from './components/AffiliateManagement';
import { ReportManagement } from './components/ReportManagement';
import { SupportManagement } from './components/SupportManagement';
import { UserProfile, Gender, RelationshipGoal, MaritalStatus, Denomination, ChurchFrequency, Affiliate, AffiliateStatus, UserActivity, ActivityType, Report, ReportStatus, AdminMessage, SupportTicket, SupportTicketStatus, Tag, VerificationStatus, FaceVerification } from './types';
import { UserDetailModal } from './components/UserDetailModal';
import { ReportDetailModal } from './components/ReportDetailModal';
import { ChatHistoryModal } from './components/ChatHistoryModal';
import { AdminLandingPage } from './components/AdminLandingPage';
import { AdminLoginModal } from './components/AdminLoginModal';
import { SupportTicketDetailModal } from './components/SupportTicketDetailModal';
import { TagManagement } from './components/TagManagement';
import { FaceVerificationManagement } from './components/FaceVerificationManagement';
import { VerificationDetailModal } from './components/VerificationDetailModal';


export type AdminView = 'dashboard' | 'users' | 'marketing' | 'analytics' | 'affiliates' | 'reports' | 'support' | 'tags' | 'face_verifications';

interface AdminAppProps {
    externalTags?: Tag[];
    onAddTagExternal?: (tag: Omit<Tag, 'id' | 'created_at'>) => Promise<void>;
    onUpdateTagExternal?: (tag: Tag) => Promise<void>;
    onDeleteTagExternal?: (id: string) => Promise<void>;
}

export default function AdminApp({ 
    externalTags = [], 
    onAddTagExternal, 
    onUpdateTagExternal, 
    onDeleteTagExternal 
}: AdminAppProps) {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [logoUrl] = useState<string | null>('https://ojsgrhaopwwqpoyayumb.supabase.co/storage/v1/object/public/logoo/PURPOSEee%20copy.png');

    const ADMIN_EMAIL = 'renat0maganhaaa@gmail.com';

    // Estados Reais do Banco
    const [view, setView] = useState<AdminView>('dashboard');
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
    const [faceVerifications, setFaceVerifications] = useState<FaceVerification[]>([]);
    
    // Estados para o Modal de Detalhes do Usuário
    const [userDetail, setUserDetail] = useState<UserProfile | null>(null);
    const [selectedUserActivities, setSelectedUserActivities] = useState<UserActivity[]>([]);
    const [selectedUserMessages, setSelectedUserMessages] = useState<AdminMessage[]>([]);
    const [isFetchingUserDetails, setIsFetchingUserDetails] = useState(false);

    const [reportDetail, setReportDetail] = useState<Report | null>(null);
    const [ticketDetail, setTicketDetail] = useState<SupportTicket | null>(null);
    const [verificationDetail, setVerificationDetail] = useState<FaceVerification | null>(null);
    const [isPremiumSaleActive, setIsPremiumSaleActive] = useState(true);

    // Mapeamento manual para garantir que snake_case do DB vire camelCase do types.ts
    const mapDbToProfile = (u: any): UserProfile => ({
        id: u.id,
        name: u.name,
        email: u.email,
        age: u.age,
        location: u.location,
        latitude: u.latitude,
        longitude: u.longitude,
        isPremium: u.is_premium,
        isVerified: u.is_verified,
        face_verification_status: u.face_verification_status as VerificationStatus,
        status: u.is_paused ? 'suspended' : 'active',
        created_at: u.created_at,
        gender: u.gender as Gender,
        relationshipGoal: u.relationship_goal as RelationshipGoal,
        maritalStatus: u.marital_status as MaritalStatus,
        photos: u.photos || [],
        bio: u.bio || '',
        interests: u.interests || [],
        denomination: u.denomination || '',
        churchFrequency: u.church_frequency as ChurchFrequency,
        keyValues: u.key_values || [],
        referred_by: u.referred_by
    });

    // Carregamento de Dados Globais
    const fetchData = useCallback(async () => {
        if (!isAdminAuthenticated) return;
        setIsLoading(true);

        try {
            // Fetch Users
            const { data: usersData, error: uError } = await supabase.from('user_profiles').select('*').order('created_at', { ascending: false });
            if (uError) console.error("Admin: Erro ao buscar usuários:", uError);
            if (usersData) setUsers(usersData.map(mapDbToProfile));

            // Fetch Reports
            const { data: reportsData } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
            if (reportsData) setReports(reportsData);

            // Fetch Support
            const { data: supportData } = await supabase.from('support_tickets').select('*').order('created_at', { ascending: false });
            if (supportData) setSupportTickets(supportData);

            // Fetch Verifications
            const { data: verifData } = await supabase.from('face_verifications').select('*').order('created_at', { ascending: false });
            if (verifData) setFaceVerifications(verifData);
        } finally {
            setIsLoading(false);
        }
    }, [isAdminAuthenticated]);

    // Função para buscar detalhes específicos de um usuário
    const fetchUserDetails = async (user: UserProfile) => {
        setUserDetail(user);
        setIsFetchingUserDetails(true);
        
        try {
            // Buscar mensagens para auditoria
            const { data: messages } = await supabase
                .from('messages')
                .select('*')
                .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
                .order('created_at', { ascending: false });
            
            if (messages) setSelectedUserMessages(messages as AdminMessage[]);

            // Simular logs de atividade
            const activities: UserActivity[] = [];
            if (user.created_at) {
                activities.push({
                    id: 'reg',
                    userId: user.id,
                    type: ActivityType.LOGIN,
                    timestamp: user.created_at,
                    details: 'Conta criada.'
                });
            }
            setSelectedUserActivities(activities);

        } catch (err) {
            console.error("Erro ao buscar detalhes do usuário:", err);
        } finally {
            setIsFetchingUserDetails(false);
        }
    };

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user?.email?.toLowerCase() === ADMIN_EMAIL) {
                    setIsAdminAuthenticated(true);
                }
            } catch (e: any) {
                console.error("Admin: Erro ao verificar sessão:", e.message);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user?.email?.toLowerCase() === ADMIN_EMAIL) {
                setIsAdminAuthenticated(true);
                setIsLoginModalOpen(false);
            } else {
                setIsAdminAuthenticated(false);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (isAdminAuthenticated) fetchData();
    }, [isAdminAuthenticated, fetchData]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        setIsAdminAuthenticated(false);
    };

    // Ações de Usuário (FUNCIONALIDADES REAIS)
    const handleUserAction = async (userId: string, action: 'warn' | 'suspend' | 'reactivate' | 'delete') => {
        try {
            if (action === 'delete') {
                if (confirm('Deseja excluir este usuário permanentemente?')) {
                    const { error } = await supabase.from('user_profiles').delete().eq('id', userId);
                    if (error) throw error;
                    setUsers(prev => prev.filter(u => u.id !== userId));
                    setUserDetail(null);
                    alert('Usuário excluído.');
                }
            } else if (action === 'suspend' || action === 'reactivate') {
                const isPaused = action === 'suspend';
                const { error } = await supabase.from('user_profiles').update({ is_paused: isPaused }).eq('id', userId);
                if (error) throw error;
                
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: isPaused ? 'suspended' : 'active' } : u));
                if (userDetail?.id === userId) setUserDetail(prev => prev ? { ...prev, status: isPaused ? 'suspended' : 'active' } : null);
                
                alert(`Usuário ${isPaused ? 'suspenso' : 'reativado'}.`);
            } else if (action === 'warn') {
                const msg = prompt('Digite o aviso para o usuário:');
                if (msg) {
                    await supabase.from('messages').insert({
                        sender_id: 'SYSTEM_ADMIN',
                        receiver_id: userId,
                        text: `⚠️ AVISO: ${msg}`,
                    });
                    alert('Aviso enviado.');
                }
            }
        } catch (err: any) {
            alert(`Erro: ${err.message}`);
        }
    };

    const handleUpdateVerificationStatus = async (verificationId: string, newStatus: VerificationStatus) => {
        const verification = faceVerifications.find(v => v.id === verificationId);
        if (!verification) return;

        try {
            await supabase.from('face_verifications').update({ status: newStatus, reviewed_at: new Date().toISOString(), reviewed_by: 'Admin' }).eq('id', verificationId);
            await supabase.from('user_profiles').update({ is_verified: newStatus === VerificationStatus.VERIFIED }).eq('id', verification.user_id);

            setFaceVerifications(prev => prev.map(v => v.id === verificationId ? { ...v, status: newStatus } : v));
            setUsers(prev => prev.map(u => u.id === verification.user_id ? { ...u, isVerified: newStatus === VerificationStatus.VERIFIED } : u));
            setVerificationDetail(null);
            alert(`Status atualizado.`);
        } catch (error: any) {
            alert(`Erro: ${error.message}`);
        }
    };

    const handleUpdateReportStatus = async (reportId: string, newStatus: ReportStatus) => {
        try {
            await supabase.from('reports').update({ status: newStatus }).eq('id', reportId);
            setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
            setReportDetail(null);
        } catch (err: any) {
            alert(`Erro: ${err.message}`);
        }
    };

    const handleUpdateTicketStatus = async (ticketId: string, newStatus: SupportTicketStatus) => {
        try {
            await supabase.from('support_tickets').update({ status: newStatus }).eq('id', ticketId);
            setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
            setTicketDetail(null);
        } catch (err: any) {
            alert(`Erro: ${err.message}`);
        }
    };

    const renderContent = () => {
        switch (view) {
            case 'dashboard': return <Dashboard />;
            case 'users': return <UserManagement users={users} onViewDetails={fetchUserDetails} onAction={handleUserAction} />;
            case 'marketing': return <MarketingTools isPremiumSaleActive={isPremiumSaleActive} onPremiumSaleToggle={setIsPremiumSaleActive} />;
            case 'analytics': return <Analytics />;
            case 'affiliates': return <AffiliateManagement />;
            case 'reports': return <ReportManagement reports={reports} users={users} onViewDetails={setReportDetail} />;
            case 'support': return <SupportManagement tickets={supportTickets} onViewDetails={setTicketDetail} />;
            case 'tags': return <TagManagement tags={externalTags} onAddTag={onAddTagExternal!} onUpdateTag={onUpdateTagExternal!} onDeleteTag={onDeleteTagExternal!} />;
            case 'face_verifications': return <FaceVerificationManagement verifications={faceVerifications} onViewDetails={setVerificationDetail} />;
            default: return <Dashboard />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-100 text-slate-800 overflow-hidden">
            <Sidebar
                logoUrl={logoUrl}
                activeView={view}
                onNavigate={setView}
                pendingReportsCount={reports.filter(r => r.status === 'Pendente').length}
                pendingTicketsCount={supportTickets.filter(t => t.status === 'Pendente').length}
                pendingVerificationsCount={faceVerifications.filter(v => v.status === VerificationStatus.PENDING).length}
                onSignOut={handleSignOut}
            />
            <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-12 h-12 border-4 border-t-sky-500 border-slate-200 rounded-full animate-spin"></div>
                        <p className="mt-4 text-slate-500 font-semibold">Sincronizando banco de dados...</p>
                    </div>
                ) : renderContent()}
            </main>

            {userDetail && (
                <UserDetailModal 
                    user={userDetail} 
                    activities={selectedUserActivities} 
                    messages={selectedUserMessages} 
                    onClose={() => { setUserDetail(null); setSelectedUserMessages([]); setSelectedUserActivities([]); }} 
                    onAction={handleUserAction} 
                    onViewChat={() => {}} 
                    isLoading={isFetchingUserDetails}
                />
            )}
            
            {reportDetail && (
                <ReportDetailModal report={reportDetail} reporter={users.find(u => u.id === reportDetail.reporter_id)} reported={users.find(u => u.id === reportDetail.reported_id)} onClose={() => setReportDetail(null)} onUpdateStatus={handleUpdateReportStatus} onAction={handleUserAction} onViewUser={(id) => {}} />
            )}

            {ticketDetail && (
                <SupportTicketDetailModal ticket={ticketDetail} onClose={() => setTicketDetail(null)} onUpdateStatus={handleUpdateTicketStatus} onViewUser={(id) => {}} />
            )}

            {verificationDetail && (
                <VerificationDetailModal verification={verificationDetail} onClose={() => setVerificationDetail(null)} onUpdateStatus={handleUpdateVerificationStatus} />
            )}
        </div>
    );
}