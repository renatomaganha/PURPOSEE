// FIX: Removed self-referential import which was causing declaration conflicts.

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
    email?: string;
    name: string;
    age: number;
    dob?: string;
    zodiacSign?: string;
    isAgeHidden?: boolean;
    isZodiacHidden?: boolean;
    height?: number;
    gender: Gender;
    seeking?: Gender[];
    location: string;
    latitude?: number;
    longitude?: number;
    photos: (string | null)[];
    privatePhoto?: string | null;
    video?: string | null;
    bio: string;
    
    // Faith
    denomination: Denomination;
    churchFrequency: ChurchFrequency;
    churchName?: string;
    favoriteVerse?: string;
    favoriteSong?: string;
    favoriteBook?: string;
    keyValues: string[];
    
    // Relationship
    relationshipGoal: RelationshipGoal;
    maritalStatus: MaritalStatus;
    partnerDescription?: string;
    
    // Other
    interests: string[];
    languages?: string[];
    isVerified: boolean;
    face_verification_status: VerificationStatus;
    isPremium: boolean;
    isInvisibleMode?: boolean;
    isPaused?: boolean;

    // Premium Features
    superLikesRemaining?: number;
    superLikeResetDate?: string;
    boostsRemaining?: number;
    boostResetDate?: string;
    boostIsActive?: boolean;
    boostExpiresAt?: string | null;
}

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

export type DeletionReason = 
    | "found_someone_on_app"
    | "found_someone_elsewhere"
    | "not_satisfied"
    | "taking_a_break"
    | "technical_issues"
    | "other";

export interface DeletionFeedback {
    userId: string;
    reason: DeletionReason;
    testimonial?: string;
    otherReasonDetails?: string;
    rating: number;
    generalFeedback?: string;
}

// FIX: Moved FilterState here to be centrally available.
export interface FilterState {
  ageRange: { min: number; max: number };
  distance: number;
  denominations: Denomination[];
  churchFrequencies: ChurchFrequency[];
  relationshipGoals: RelationshipGoal[];
  verifiedOnly?: boolean;
  churchName?: string;
}

export interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  text: string;
  created_at: string;
}

// FIX: Moved ReportReason here to be centrally available.
export type ReportReason = 'Perfil Falso/Spam' | 'Fotos Inapropriadas' | 'Assédio ou Ofensas' | 'Menor de Idade' | 'Golpe/Fraude' | 'Outro';

// Types for Tag Management
export type TagCategory = 'denominations' | 'keyValues' | 'interests' | 'languages';

export interface Tag {
  id: string;
  category: TagCategory;
  name: string;
  emoji?: string;
  created_at: string;
}

// Tipos para Verificação Facial
export enum VerificationStatus {
    NOT_VERIFIED = 'Não Verificado',
    PENDING = 'Pendente',
    VERIFIED = 'Verificado',
    REJECTED = 'Rejeitado',
}

export interface FaceVerification {
    id: string;
    user_id: string;
    profile_photo_url: string;
    selfie_photo_url: string;
    status: VerificationStatus;
    created_at: string;
    reviewed_at?: string;
}