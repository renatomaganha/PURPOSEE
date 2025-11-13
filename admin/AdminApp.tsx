import React, { useState, useEffect } from 'react';
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

// --- DADOS FICTÍCIOS CENTRALIZADOS ---

const mockUsersData: UserProfile[] = [
    { id: '1', name: 'Ana Clara', email: 'ana.clara@email.com', age: 27, location: 'Rio de Janeiro, RJ', latitude: -22.9068, longitude: -43.1729, isPremium: true, isVerified: true, face_verification_status: VerificationStatus.VERIFIED, status: 'active', created_at: '2024-07-01T10:00:00Z', photos: ['https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop', 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop'], gender: Gender.MULHER, relationshipGoal: RelationshipGoal.CASAMENTO, maritalStatus: MaritalStatus.SOLTEIRO, bio: 'Apaixonada por Jesus e por missões. Acredito que o amor é construído com base na amizade e no propósito.', interests: ['Voluntariado', 'Fotografia'], denomination: "Presbiteriana", churchFrequency: ChurchFrequency.SEMANALMENTE, keyValues: ['Missões', 'Serviço'], referred_by: 'aff_001' },
    { id: '2', name: 'Daniel Souza', email: 'daniel.souza@email.com', age: 29, location: 'São Paulo, SP', latitude: -23.5505, longitude: -46.6333, isPremium: true, isVerified: true, face_verification_status: VerificationStatus.VERIFIED, status: 'active', created_at: '2024-06-25T15:30:00Z', photos: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop'], gender: Gender.HOMEM, relationshipGoal: RelationshipGoal.CASAMENTO, maritalStatus: MaritalStatus.SOLTEIRO, bio: 'Servo de Deus, buscando uma mulher para somar na fé.', interests: ['Estudo Bíblico', 'Viagens'], denomination: "Batista", churchFrequency: ChurchFrequency.SEMANALMENTE, keyValues: ['Família', 'Oração'], referred_by: 'aff_002' },
    { id: '3', name: 'Beatriz Lima', email: 'beatriz.lima@email.com', age: 31, location: 'Belo Horizonte, MG', latitude: -19.9167, longitude: -43.9345, isPremium: false, isVerified: false, face_verification_status: VerificationStatus.PENDING, status: 'active', created_at: '2024-07-15T08:45:00Z', photos: ['https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop'], gender: Gender.MULHER, relationshipGoal: RelationshipGoal.AMIZADE_PROPOSITO, maritalStatus: MaritalStatus.SOLTEIRO, bio: 'Buscando um companheiro para compartilhar a vida, a fé e o pão de queijo.', interests: ['Culinária', 'Filmes'], denomination: "Metodista", churchFrequency: ChurchFrequency.QUINZENALMENTE, keyValues: ['Adoração', 'Fé'] },
    { id: '4', name: 'Lucas Ferreira', email: 'lucas.ferreira@email.com', age: 25, location: 'Curitiba, PR', latitude: -25.4284, longitude: -49.2733, isPremium: false, isVerified: true, face_verification_status: VerificationStatus.NOT_VERIFIED, status: 'suspended', created_at: '2024-05-10T20:00:00Z', photos: ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop'], gender: Gender.HOMEM, relationshipGoal: RelationshipGoal.NAO_SEI, maritalStatus: MaritalStatus.SOLTEIRO, bio: 'Apenas vivendo um dia de cada vez, com Deus no coração.', interests: ['Tecnologia', 'Caminhadas'], denomination: "Não Denominacional", churchFrequency: ChurchFrequency.OCASIONALMENTE, keyValues: ['Justiça', 'Saúde'], referred_by: 'aff_001' },
    { id: '5', name: 'Pedro Marques', email: 'pedro.marques@email.com', age: 35, location: 'Salvador, BA', latitude: -12.9777, longitude: -38.5016, isPremium: true, isVerified: false, face_verification_status: VerificationStatus.PENDING, status: 'active', created_at: '2024-07-22T11:00:00Z', photos: ['https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1974&auto=format&fit=crop'], gender: Gender.HOMEM, relationshipGoal: RelationshipGoal.CASAMENTO, maritalStatus: MaritalStatus.DIVORCIADO, bio: 'Recomeçando com fé. Pai de um menino abençoado e procurando uma nova história.', interests: ['Louvor', 'Instrumento Musical'], denomination: "Pentecostal", churchFrequency: ChurchFrequency.SEMANALMENTE, keyValues: ['Família', 'Fé'] },
    { id: '6', name: 'Reiss', email: '19reiss@gmail.com', age: 28, location: 'São Paulo, SP', isPremium: true, isVerified: true, face_verification_status: VerificationStatus.VERIFIED, status: 'active', created_at: new Date().toISOString(), photos: ['https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop'], gender: Gender.HOMEM, relationshipGoal: RelationshipGoal.AMIZADE_PROPOSITO, maritalStatus: MaritalStatus.SOLTEIRO, bio: 'Usuário premium. Conectando com pessoas de fé.', interests: ['Tecnologia', 'Música'], denomination: "Não Denominacional", churchFrequency: ChurchFrequency.QUINZENALMENTE, keyValues: ['Fé', 'Honestidade'] },
];

const mockActivitiesData: UserActivity[] = [
    { id: 'act_1', userId: '1', type: ActivityType.LIKE, timestamp: '2024-07-25T10:05:00Z', targetUserId: '2', targetUserName: 'Daniel Souza' },
    { id: 'act_2', userId: '1', type: ActivityType.MATCH, timestamp: '2024-07-25T10:06:00Z', targetUserId: '2', targetUserName: 'Daniel Souza' },
    { id: 'act_3', userId: '1', type: ActivityType.PROFILE_UPDATE, timestamp: '2024-07-24T18:30:00Z', details: 'Atualizou a biografia' },
    { id: 'act_4', userId: '2', type: ActivityType.LIKE, timestamp: '2024-07-25T10:04:00Z', targetUserId: '1', targetUserName: 'Ana Clara' },
    { id: 'act_5', userId: '2', type: ActivityType.PASS, timestamp: '2024-07-25T10:03:00Z', targetUserId: '3', targetUserName: 'Beatriz Lima' },
    { id: 'act_6', userId: '3', type: ActivityType.LOGIN, timestamp: '2024-07-25T09:00:00Z' },
    { id: 'act_7', userId: '4', type: ActivityType.MESSAGE_SENT, timestamp: '2024-07-23T11:00:00Z', targetUserId: '1', targetUserName: 'Ana Clara' },
];

const mockReportsData: Report[] = [
    { id: 'rep_1', reporter_id: '1', reported_id: '5', reason: 'Fotos Inapropriadas', details: 'A segunda foto do perfil parece ser de um filme e não dele.', status: ReportStatus.PENDING, created_at: '2024-07-24T10:00:00Z' },
    { id: 'rep_2', reporter_id: '3', reported_id: '2', reason: 'Assédio ou Ofensas', details: 'Ele foi muito rude na conversa e usou palavras ofensivas.', status: ReportStatus.PENDING, created_at: '2024-07-23T15:30:00Z', evidence_urls: ['https://images.unsplash.com/photo-1513097633094-140f0653501b?q=80&w=2070&auto=format&fit=crop'] },
    { id: 'rep_3', reporter_id: '2', reported_id: '1', reason: 'Perfil Falso/Spam', details: '', status: ReportStatus.PENDING, created_at: '2024-07-22T08:00:00Z' },
    { id: 'rep_4', reporter_id: '1', reported_id: '3', reason: 'Outro', details: 'Acho que a idade informada não está correta.', status: ReportStatus.RESOLVED, created_at: '2024-07-20T11:45:00Z' },
    { id: 'rep_5', reporter_id: '5', reported_id: '2', reason: 'Golpe/Fraude', details: 'Pediu dinheiro para "ajudar em uma emergência".', status: ReportStatus.REVIEWED, created_at: '2024-07-19T18:00:00Z' },
];

const mockMessagesData: AdminMessage[] = [
    { id: 'msg_1', sender_id: '1', receiver_id: '2', text: 'Oi Daniel, tudo bem? Vi que você também gosta de estudo bíblico, que legal!', created_at: '2024-07-25T10:07:00Z' },
    { id: 'msg_2', sender_id: '2', receiver_id: '1', text: 'Olá Ana, tudo ótimo e com você? Sim, é uma das minhas paixões. Qual livro você está estudando agora?', created_at: '2024-07-25T10:08:00Z' },
    { id: 'msg_3', sender_id: '1', receiver_id: '2', text: 'Estou meditando em Salmos. E você?', created_at: '2024-07-25T10:09:00Z' },
    { id: 'msg_4', sender_id: '3', receiver_id: '5', text: 'Olá Pedro, a paz do Senhor. Vi que você é de Salvador, terra linda!', created_at: '2024-07-26T11:00:00Z' },
];

const mockSupportTicketsData: SupportTicket[] = [
    { id: 'tkt_1', user_id: '3', user_name: 'Beatriz Lima', user_email: 'beatriz.lima@email.com', category: 'Problema Técnico', message: 'Meu app está fechando sozinho quando tento ver a lista de curtidas.', status: SupportTicketStatus.PENDING, created_at: '2024-07-26T14:00:00Z'},
    { id: 'tkt_2', user_id: '1', user_name: 'Ana Clara', user_email: 'ana.clara@email.com', category: 'Dúvida sobre Pagamento', message: 'Fiz a assinatura anual mas ainda não estou com os benefícios premium. Podem verificar?', status: SupportTicketStatus.PENDING, created_at: '2024-07-26T11:30:00Z'},
    { id: 'tkt_3', user_id: '5', user_name: 'Pedro Marques', user_email: 'pedro.marques@email.com', category: 'Sugestão', message: 'Seria legal ter um filtro por altura!', status: SupportTicketStatus.RESOLVED, created_at: '2024-07-25T09:00:00Z'},
    { id: 'tkt_4', user_id: '2', user_name: 'Daniel Souza', user_email: 'daniel.souza@email.com', category: 'Outro', message: 'Gostaria de saber como funciona o modo invisível com mais detalhes.', status: SupportTicketStatus.IN_PROGRESS, created_at: '2024-07-24T18:20:00Z'},
];

const mockTags: Tag[] = [
    { id: 'denom_1', category: 'denominations', name: 'Batista', created_at: new Date().toISOString() },
    { id: 'denom_2', category: 'denominations', name: 'Presbiteriana', created_at: new Date().toISOString() },
    { id: 'denom_3', category: 'denominations', name: 'Metodista', created_at: new Date().toISOString() },
    { id: 'denom_4', category: 'denominations', name: 'Pentecostal', created_at: new Date().toISOString() },
    { id: 'denom_5', category: 'denominations', name: 'Adventista', created_at: new Date().toISOString() },
    { id: 'denom_6', category: 'denominations', name: 'Católico', created_at: new Date().toISOString() },
    { id: 'denom_7', category: 'denominations', name: 'CCB', created_at: new Date().toISOString() },
    { id: 'denom_8', category: 'denominations', name: 'Cristão', created_at: new Date().toISOString() },
    { id: 'denom_9', category: 'denominations', name: 'Evangélico', created_at: new Date().toISOString() },
    { id: 'denom_10', category: 'denominations', name: 'Espirita', created_at: new Date().toISOString() },
    { id: 'denom_11', category: 'denominations', name: 'Judaísmo', created_at: new Date().toISOString() },
    { id: 'denom_12', category: 'denominations', name: 'Não Denominacional', created_at: new Date().toISOString() },

    { id: 'kv_1', category: 'keyValues', name: 'Família', created_at: new Date().toISOString() },
    { id: 'kv_2', category: 'keyValues', name: 'Oração', created_at: new Date().toISOString() },
    { id: 'kv_3', category: 'keyValues', name: 'Serviço', created_at: new Date().toISOString() },
    { id: 'kv_4', category: 'keyValues', name: 'Honestidade', created_at: new Date().toISOString() },
    { id: 'kv_5', category: 'keyValues', name: 'Comunhão', created_at: new Date().toISOString() },
    { id: 'kv_6', category: 'keyValues', name: 'Adoração', created_at: new Date().toISOString() },
    { id: 'kv_7', category: 'keyValues', name: 'Missões', created_at: new Date().toISOString() },
    { id: 'kv_8', category: 'keyValues', name: 'Fé', created_at: new Date().toISOString() },

    { id: 'int_1', category: 'interests', name: 'Leitura', created_at: new Date().toISOString() },
    { id: 'int_2', category: 'interests', name: 'Música', created_at: new Date().toISOString() },
    { id: 'int_3', category: 'interests', name: 'Viagens', created_at: new Date().toISOString() },
    { id: 'int_4', category: 'interests', name: 'Caminhadas', created_at: new Date().toISOString() },
    { id: 'int_5', category: 'interests', name: 'Fotografia', created_at: new Date().toISOString() },
    { id: 'int_6', category: 'interests', name: 'Culinária', created_at: new Date().toISOString() },
    { id: 'int_7', category: 'interests', name: 'Filmes', created_at: new Date().toISOString() },
    { id: 'int_8', category: 'interests', name: 'Voluntariado', created_at: new Date().toISOString() },
    { id: 'int_9', category: 'interests', name: 'Esportes', created_at: new Date().toISOString() },
    { id: 'int_10', category: 'interests', name: 'Estudo Bíblico', created_at: new Date().toISOString() },

    { id: 'lang_1', category: 'languages', name: 'Português', created_at: new Date().toISOString() },
    { id: 'lang_2', category: 'languages', name: 'Inglês', created_at: new Date().toISOString() },
    { id: 'lang_3', category: 'languages', name: 'Espanhol', created_at: new Date().toISOString() },
];

const mockFaceVerifications: FaceVerification[] = [
    { id: 'fv_1', user_id: '3', user_name: 'Beatriz Lima', profile_photo_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop', selfie_photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop', status: VerificationStatus.PENDING, created_at: '2024-07-28T10:00:00Z' },
    { id: 'fv_2', user_id: '5', user_name: 'Pedro Marques', profile_photo_url: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?q=80&w=1974&auto=format&fit=crop', selfie_photo_url: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=2069&auto=format&fit=crop', status: VerificationStatus.PENDING, created_at: '2024-07-28T11:30:00Z' },
    { id: 'fv_3', user_id: '1', user_name: 'Ana Clara', profile_photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop', selfie_photo_url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887&auto=format&fit=crop', status: VerificationStatus.VERIFIED, created_at: '2024-07-27T15:00:00Z', reviewed_by: 'Sistema Automático', reviewed_at: '2024-07-27T15:01:00Z' },
    { id: 'fv_4', user_id: '4', user_name: 'Lucas Ferreira', profile_photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop', selfie_photo_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1887&auto=format&fit=crop', status: VerificationStatus.REJECTED, created_at: '2024-07-26T18:00:00Z', reviewed_by: 'Sistema Automático', reviewed_at: '2024-07-26T18:01:00Z' },
];


export default function AdminApp() {
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [logoUrl] = useState<string | null>('https://ojsgrhaopwwqpoyayumb.supabase.co/storage/v1/object/public/logoo/PURPOSE.png');

    const ADMIN_EMAIL = 'renat0maganhaaa@gmail.com';

    useEffect(() => {
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user?.email?.toLowerCase() === ADMIN_EMAIL) {
                    setIsAdminAuthenticated(true);
                }
            } catch (e: any) {
                console.error("Admin: Exception during session/logo fetch:", e.message, e);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user?.email?.toLowerCase() === ADMIN_EMAIL) {
                setIsAdminAuthenticated(true);
                setIsLoginModalOpen(false); // Close modal on successful login
            } else {
                setIsAdminAuthenticated(false);
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
    };

    const [view, setView] = useState<AdminView>('dashboard');
    const [users, setUsers] = useState<UserProfile[]>(mockUsersData);
    const [reports, setReports] = useState<Report[]>(mockReportsData);
    const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(mockSupportTicketsData);
    const [faceVerifications, setFaceVerifications] = useState<FaceVerification[]>(mockFaceVerifications);
    const [activities] = useState<UserActivity[]>(mockActivitiesData);
    const [messages] = useState<AdminMessage[]>(mockMessagesData);
    const [tags, setTags] = useState<Tag[]>(mockTags);

    const [userDetail, setUserDetail] = useState<UserProfile | null>(null);
    const [reportDetail, setReportDetail] = useState<Report | null>(null);
    const [ticketDetail, setTicketDetail] = useState<SupportTicket | null>(null);
    const [verificationDetail, setVerificationDetail] = useState<FaceVerification | null>(null);
    const [chatToView, setChatToView] = useState<{ user1: UserProfile, user2: UserProfile } | null>(null);
    const [isPremiumSaleActive, setIsPremiumSaleActive] = useState(true); // Estado para o botão de venda

    const handleUserAction = (userId: string, action: 'warn' | 'suspend' | 'reactivate' | 'delete') => {
        if (action === 'delete') {
            if (confirm('Tem certeza de que deseja excluir este usuário permanentemente?')) {
                setUsers(prev => prev.filter(u => u.id !== userId));
                if (userDetail?.id === userId) setUserDetail(null);
                if (reportDetail?.reported_id === userId || reportDetail?.reporter_id === userId) setReportDetail(null);
            }
        } else if (action === 'suspend' || action === 'reactivate') {
             setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: action === 'suspend' ? 'suspended' : 'active' } : u));
        } else {
             alert(`Ação '${action}' executada para o usuário com ID: ${userId}. (Simulado)`);
        }
    };

    const handleUpdateReportStatus = (reportId: string, newStatus: ReportStatus) => {
        setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
        if (reportDetail?.id === reportId) {
            setReportDetail(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };
    
    const handleUpdateVerificationStatus = (verificationId: string, newStatus: VerificationStatus) => {
        // Atualiza a lista de verificações
        const updatedVerifications = faceVerifications.map(v => 
            v.id === verificationId ? { ...v, status: newStatus, reviewed_at: new Date().toISOString(), reviewed_by: 'Admin' } : v
        );
        setFaceVerifications(updatedVerifications);

        // Atualiza o perfil do usuário correspondente
        const verification = faceVerifications.find(v => v.id === verificationId);
        if (verification) {
            setUsers(prevUsers => prevUsers.map(u => 
                u.id === verification.user_id 
                ? { ...u, face_verification_status: newStatus, isVerified: newStatus === VerificationStatus.VERIFIED } 
                : u
            ));
        }

        // Fecha o modal de detalhes
        setVerificationDetail(null);
    };

    const handleUpdateTicketStatus = (ticketId: string, newStatus: SupportTicketStatus) => {
        setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus } : t));
        if (ticketDetail?.id === ticketId) {
            setTicketDetail(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    const handleAddTag = (newTag: Omit<Tag, 'id' | 'created_at'>) => {
        const tagToAdd: Tag = {
            ...newTag,
            id: `tag_${Date.now()}`,
            created_at: new Date().toISOString(),
        };
        setTags(prev => [tagToAdd, ...prev]);
    };

    const handleUpdateTag = (updatedTag: Tag) => {
        setTags(prev => prev.map(t => t.id === updatedTag.id ? updatedTag : t));
    };

    const handleDeleteTag = (tagId: string) => {
        setTags(prev => prev.filter(t => t.id !== tagId));
    };

    const handleViewUser = (userId: string | undefined) => {
        if (!userId) return;
        const userToView = users.find(u => u.id === userId);
        if (userToView) {
            setUserDetail(userToView);
        }
    };

    const handleViewChat = (user1: UserProfile, user2: UserProfile) => {
        setChatToView({ user1, user2 });
    };

    const pendingReportsCount = reports.filter(r => r.status === 'Pendente').length;
    const pendingTicketsCount = supportTickets.filter(t => t.status === SupportTicketStatus.PENDING).length;
    const pendingVerificationsCount = faceVerifications.filter(v => v.status === VerificationStatus.PENDING).length;

    if (isLoading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-800">
                <div className="w-8 h-8 border-4 border-t-white border-slate-600 rounded-full animate-spin"></div>
            </div>
        );
    }
    
    if (!isAdminAuthenticated) {
        return (
            <>
                <AdminLandingPage onEnter={() => setIsLoginModalOpen(true)} logoUrl={logoUrl} />
                {isLoginModalOpen && (
                    <AdminLoginModal
                        onClose={() => setIsLoginModalOpen(false)}
                        onLoginSuccess={() => { /* Handled by auth listener */ }}
                    />
                )}
            </>
        );
    }

    const renderContent = () => {
        switch (view) {
            case 'dashboard':
                return <Dashboard />;
            case 'users':
                return <UserManagement users={users} onViewDetails={setUserDetail} onAction={handleUserAction} />;
            case 'marketing':
                return <MarketingTools 
                            isPremiumSaleActive={isPremiumSaleActive} 
                            onPremiumSaleToggle={setIsPremiumSaleActive}
                        />;
            case 'analytics':
                return <Analytics />;
            case 'affiliates':
                return <AffiliateManagement />;
            case 'reports':
                return <ReportManagement reports={reports} users={users} onViewDetails={setReportDetail} />;
            case 'support':
                return <SupportManagement tickets={supportTickets} onViewDetails={setTicketDetail} />;
            case 'tags':
                return <TagManagement 
                            tags={tags}
                            onAddTag={handleAddTag}
                            onUpdateTag={handleUpdateTag}
                            onDeleteTag={handleDeleteTag}
                        />;
            case 'face_verifications':
                return <FaceVerificationManagement verifications={faceVerifications} onViewDetails={setVerificationDetail} />;
            default:
                return <Dashboard />;
        }
    };

    const selectedUserActivities = userDetail ? activities.filter(act => act.userId === userDetail.id) : [];

    return (
        <div className="flex h-screen bg-slate-100 text-slate-800">
            <Sidebar
                logoUrl={logoUrl}
                activeView={view}
                onNavigate={setView}
                pendingReportsCount={pendingReportsCount}
                pendingTicketsCount={pendingTicketsCount}
                pendingVerificationsCount={pendingVerificationsCount}
                onSignOut={handleSignOut}
            />
            <main className="flex-1 p-8 overflow-y-auto">
                {renderContent()}
            </main>

            {userDetail && (
                <UserDetailModal
                    user={userDetail}
                    activities={selectedUserActivities}
                    messages={messages}
                    onClose={() => setUserDetail(null)}
                    onAction={handleUserAction}
                    onViewChat={handleViewChat}
                />
            )}
            
            {reportDetail && (
                <ReportDetailModal
                    report={reportDetail}
                    reporter={users.find(u => u.id === reportDetail.reporter_id)}
                    reported={users.find(u => u.id === reportDetail.reported_id)}
                    onClose={() => setReportDetail(null)}
                    onUpdateStatus={handleUpdateReportStatus}
                    onAction={handleUserAction}
                    onViewUser={handleViewUser}
                />
            )}
            
            {verificationDetail && (
                <VerificationDetailModal
                    verification={verificationDetail}
                    onClose={() => setVerificationDetail(null)}
                    onUpdateStatus={handleUpdateVerificationStatus}
                />
            )}

            {ticketDetail && (
                <SupportTicketDetailModal
                    ticket={ticketDetail}
                    onClose={() => setTicketDetail(null)}
                    onUpdateStatus={handleUpdateTicketStatus}
                    onViewUser={handleViewUser}
                />
            )}

            {chatToView && (
                <ChatHistoryModal
                    user1={chatToView.user1}
                    user2={chatToView.user2}
                    messages={messages}
                    onClose={() => setChatToView(null)}
                />
            )}
        </div>
    );
}
