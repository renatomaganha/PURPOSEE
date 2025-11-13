export enum VerificationStatus {
    NOT_VERIFIED = 'Não Verificado',
    PENDING = 'Pendente',
    VERIFIED = 'Verificado',
    REJECTED = 'Rejeitado',
}


export interface DashboardStats {
    totalUsers: number;
    newUsersLastMonth: number;
    premiumSubscribers: number;
    totalRevenue: number;
}

export type Denomination = string;

export enum ChurchFrequency {
  SEMANALMENTE = "Semanalmente",
  QUINZENALMENTE = "Quinzenalmente",
  OCASIONALMENTE = "Ocasionalmente",
}

export enum Gender {
  HOMEM = "Homem",
  MULHER = "Mulher",
}

export enum RelationshipGoal {
    CASAMENTO = "Noivado/Casamento",
    AMIZADE_PROPOSITO = "Amizade com Propósito",
    AMIZADE_FE = "Amizade na Fé",
    NAO_SEI = "Ainda não sei (Deus no Controle)",
}

export enum MaritalStatus {
    SOLTEIRO = "Solteiro/a",
    DIVORCIADO = "Divorciado/a",
    VIUVO = "Viúvo/a",
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  age: number;
  location: string;
  latitude?: number;
  longitude?: number;
  isPremium?: boolean;
  isVerified?: boolean;
  face_verification_status?: VerificationStatus;
  status: 'active' | 'suspended';
  created_at?: string;
  gender: Gender;
  relationshipGoal: RelationshipGoal;
  maritalStatus: MaritalStatus;
  photos: string[];
  bio: string;
  interests: string[];
  denomination: Denomination;
  churchFrequency: ChurchFrequency;
  keyValues: string[];
  referred_by?: string; // ID do Afiliado
}

export enum CampaignType {
    TEXT = "Mensagem de Texto",
    POPUP = "Pop-up com Imagem",
}

export interface Campaign {
    id: string;
    name: string;
    type: CampaignType;
    target: string; // 'all', 'premium', etc.
    sentDate: string;
    reach: number;
    ctr: number; // Click-through rate as percentage
    imageUrl?: string;
    message: string;
}

export enum AffiliateStatus {
    ACTIVE = 'Ativo',
    INACTIVE = 'Inativo',
}

export interface Affiliate {
    id: string;
    name: string;
    referralCode: string;
    commissionRate: number; // Ex: 0.2 para 20%
    status: AffiliateStatus;
    created_at: string;
}

export interface ReferredUser {
    id: string; // ID da indicação
    affiliateId: string;
    userId: string;
    userName: string;
    joinDate: string;
    commissionEarned: number;
}


export enum ReportStatus {
    PENDING = 'Pendente',
    REVIEWED = 'Revisado',
    RESOLVED = 'Resolvido',
}

export interface Report {
    id: string;
    reporter_id: string;
    reported_id: string;
    reason: string;
    details?: string;
    status: ReportStatus;
    created_at: string;
    evidence_urls?: string[];
}

export enum ActivityType {
    LOGIN = 'Login',
    LIKE = 'Like',
    PASS = 'Pass',
    MATCH = 'Match',
    MESSAGE_SENT = 'Message Sent',
    PROFILE_UPDATE = 'Profile Update',
}

export interface UserActivity {
    id: string;
    userId: string;
    type: ActivityType;
    timestamp: string;
    targetUserId?: string;
    targetUserName?: string;
    details?: string;
}

export interface AdminMessage {
    id: string;
    sender_id: string;
    receiver_id: string;
    text: string;
    created_at: string;
}

// Tipos para a nova feature de Suporte
export type SupportTicketCategory = "Problema Técnico" | "Dúvida sobre Pagamento" | "Denunciar Comportamento" | "Sugestão" | "Outro";

export enum SupportTicketStatus {
    PENDING = 'Pendente',
    IN_PROGRESS = 'Em Análise',
    RESOLVED = 'Resolvido',
}

export interface SupportTicket {
    id: string;
    user_id: string;
    user_name: string;
    user_email: string;
    category: SupportTicketCategory;
    message: string;
    status: SupportTicketStatus;
    created_at: string;
}

// Tipos para a nova feature de Gestão de Tags
export type TagCategory = 'denominations' | 'keyValues' | 'interests' | 'languages';

export interface Tag {
  id: string;
  category: TagCategory;
  name: string;
  created_at: string;
}

// Tipos para Verificação Facial
export interface FaceVerification {
    id: string;
    user_id: string;
    user_name: string;
    profile_photo_url: string;
    selfie_photo_url: string;
    status: VerificationStatus;
    created_at: string;
    reviewed_at?: string;
    reviewed_by?: string;
}