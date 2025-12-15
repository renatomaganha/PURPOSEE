import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Gender, Denomination, ChurchFrequency, RelationshipGoal, MaritalStatus, Tag, VerificationStatus } from '../types';
import { PhotoIcon } from './icons/PhotoIcon';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useLanguage } from '../contexts/LanguageContext';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { PhotoUploadModal } from './PhotoUploadModal';
import { CameraCapture } from './CameraCapture';
import { FaceVerification } from './FaceVerification';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';
import { ArrowPathIcon } from './icons/ArrowPathIcon';
import { useToast } from '../contexts/ToastContext';


const allChurchFrequencies = Object.values(ChurchFrequency);
const allRelationshipGoals = Object.values(RelationshipGoal);
const allMaritalStatuses = Object.values(MaritalStatus);

const calculateAge = (dobString: string): number => {
    if (!dobString) return 0;
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const dbProfileToAppProfile = (dbData: any): Partial<UserProfile> => {
  if (!dbData) return {};
  return {
    id: dbData.id,
    name: dbData.name,
    age: dbData.age,
    dob: dbData.dob,
    gender: dbData.gender,
    seeking: dbData.seeking || [],
    location: dbData.location,
    latitude: dbData.latitude,
    longitude: dbData.longitude,
    photos: dbData.photos || Array(5).fill(null),
    privatePhoto: dbData.private_photo,
    video: dbData.video,
    bio: dbData.bio,
    denomination: dbData.denomination,
    churchFrequency: dbData.church_frequency,
    churchName: dbData.church_name,
    favoriteVerse: dbData.favorite_verse,
    favoriteSong: dbData.favorite_song,
    favoriteBook: dbData.favorite_book,
    keyValues: dbData.key_values || [],
    relationshipGoal: dbData.relationship_goal,
    maritalStatus: dbData.marital_status,
    partnerDescription: dbData.partner_description,
    interests: dbData.interests || [],
    languages: dbData.languages || [],
    isVerified: dbData.is_verified,
    face_verification_status: dbData.face_verification_status,
    isPremium: dbData.is_premium,
    isInvisibleMode: dbData.is_invisible_mode,
    isPaused: dbData.is_paused,
    height: dbData.height,
    zodiacSign: dbData.zodiac_sign,
    isAgeHidden: dbData.is_age_hidden,
    isZodiacHidden: dbData.is_zodiac_hidden,
    superLikesRemaining: dbData.super_likes_remaining,
    superLikeResetDate: dbData.super_like_reset_date,
    boostsRemaining: dbData.boosts_remaining,
    boostResetDate: dbData.boost_reset_date,
    boostIsActive: dbData.boost_is_active,
    boostExpiresAt: dbData.boost_expires_at,
  };
};

const appProfileToDbProfile = (appData: Partial<UserProfile>): any => {
    if (!appData) return {};
    return {
        id: appData.id,
        email: appData.email,
        name: appData.name,
        age: appData.age,
        dob: appData.dob,
        gender: appData.gender,
        seeking: appData.seeking,
        location: appData.location,
        latitude: appData.latitude,
        longitude: appData.longitude,
        photos: appData.photos,
        private_photo: appData.privatePhoto,
        video: appData.video,
        bio: appData.bio,
        denomination: appData.denomination,
        church_frequency: appData.churchFrequency,
        church_name: appData.churchName,
        favorite_verse: appData.favoriteVerse,
        favorite_song: appData.favoriteSong,
        favorite_book: appData.favoriteBook,
        key_values: appData.keyValues,
        relationship_goal: appData.relationshipGoal,
        marital_status: appData.maritalStatus,
        partner_description: appData.partnerDescription,
        interests: appData.interests,
        languages: appData.languages,
        is_verified: appData.isVerified,
        face_verification_status: appData.face_verification_status,
        is_premium: appData.isPremium,
        is_invisible_mode: appData.isInvisibleMode,
        is_paused: appData.isPaused,
        height: appData.height,
        zodiac_sign: appData.zodiacSign,
        is_age_hidden: appData.isAgeHidden,
        is_zodiac_hidden: appData.isZodiacHidden,
        super_likes_remaining: appData.superLikesRemaining,
        super_like_reset_date: appData.superLikeResetDate,
        boosts_remaining: appData.boostsRemaining,
        boost_reset_date: appData.boostResetDate,
        boost_is_active: appData.boostIsActive,
        boost_expires_at: appData.boostExpiresAt,
        updated_at: new Date().toISOString(),
    };
};

// Helper to convert data URL to File object
function dataURLtoFile(dataurl: string, filename: string): File {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) {
        throw new Error('Invalid data URL');
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}


const ProgressBar: React.FC<{ step: number; totalSteps: number }> = ({ step, totalSteps }) => (
    <div className="w-full bg-slate-200 rounded-full h-2.5 mb-8">
        <div className="bg-sky-600 h-2.5 rounded-full" style={{ width: `${(step / totalSteps) * 100}%` }}></div>
    </div>
);

interface CreateProfileProps {
    onProfileCreated: (profile: UserProfile, wasEditing?: boolean) => void;
    isEditing?: boolean;
    onClose?: () => void;
    denominations: Tag[];
    keyValues: Tag[];
    interests: Tag[];
    languages: Tag[];
}

const FormSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`w-full bg-white p-6 rounded-lg shadow-sm mb-6 ${className}`}>
        <h2 className="text-xl font-bold mb-4 border-b pb-2 text-slate-800">{title}</h2>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

export const CreateProfile: React.FC<CreateProfileProps> = ({ 
    onProfileCreated, 
    isEditing = false, 
    onClose,
    denominations,
    keyValues,
    interests,
    languages,
}) => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const { addToast } = useToast();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [uploadingStatus, setUploadingStatus] = useState<{[key: string]: boolean}>({});
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    
    const [initialProfileData, setInitialProfileData] = useState<Partial<UserProfile> | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState<{ type: 'public' | 'private', index?: number } | null>(null);


    const [profileData, setProfileData] = useState<Partial<UserProfile>>({
        name: '',
        location: '',
        dob: '',
        photos: [null, null, null, null, null],
        gender: Gender.MULHER,
        seeking: [Gender.HOMEM], // Default seeking
        denomination: "Não Denominacional",
        churchFrequency: ChurchFrequency.OCASIONALMENTE,
        relationshipGoal: RelationshipGoal.NAO_SEI,
        maritalStatus: MaritalStatus.SOLTEIRO,
        interests: [],
        keyValues: [],
        languages: [],
        isVerified: false,
        face_verification_status: VerificationStatus.NOT_VERIFIED,
    });

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const { data, error: fetchError } = await supabase
                        .from('user_profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();

                    if (fetchError && fetchError.code !== 'PGRST116') {
                        const errorMessage = fetchError.message.toLowerCase();
                        if (errorMessage.includes('failed to fetch')) {
                            setError('Erro de conexão. Verifique sua internet e desative bloqueadores de anúncio (Ad-blockers).');
                        } else {
                            console.error("Erro ao buscar perfil existente:", "Message:", fetchError.message, "Details:", fetchError.details, "Code:", fetchError.code);
                            setError('Não foi possível carregar os dados do seu perfil. Tente recarregar a página.');
                        }
                    }

                    if (data) {
                        const appData = dbProfileToAppProfile(data);
                        const existingPhotos = appData.photos || [];
                        const paddedPhotos = [...existingPhotos, ...Array(5 - existingPhotos.length).fill(null)];
                        const fullProfileData = { ...appData, photos: paddedPhotos };
                        setProfileData(fullProfileData);
                        if(isEditing) {
                            setInitialProfileData(fullProfileData);
                        }
                    }
                } catch (e: any) {
                    console.error("Erro catastrófico ao buscar perfil:", e.message, e);
                     if (e instanceof TypeError && e.message.toLowerCase().includes('failed to fetch')) {
                        setError('Erro de conexão. Verifique sua internet e desative bloqueadores de anúncio (Ad-blockers).');
                    } else {
                        setError('Não foi possível conectar ao banco de dados.');
                    }
                }
            }
            setIsLoading(false);
        };

        fetchProfile();
    }, [user, isEditing]);
    
    // Efeito para verificar se o formulário foi alterado (apenas no modo de edição)
    useEffect(() => {
        if (isEditing && initialProfileData) {
            const hasChanged = JSON.stringify(profileData) !== JSON.stringify(initialProfileData);
            setIsDirty(hasChanged);
        }
    }, [profileData, initialProfileData, isEditing]);
    
    const handlePhotoUpload = async (file: File, type: 'public' | 'private', index?: number) => {
        if (!user) return;

        const uploadKey = type === 'private' ? 'private' : `public_${index}`;
        setUploadingStatus(prev => ({ ...prev, [uploadKey]: true }));
        setError(null);

        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        try {
            const { error: uploadError } = await supabase.storage
                .from('profile-photos')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
                .from('profile-photos')
                .getPublicUrl(fileName);
            
            if (publicUrlData) {
                const cacheBustedUrl = `${publicUrlData.publicUrl}?t=${new Date().getTime()}`;
                setProfileData(prev => {
                    if (type === 'public' && index !== undefined) {
                        const newPhotos = [...(prev.photos || Array(5).fill(null))];
                        newPhotos[index] = cacheBustedUrl;
                        return { ...prev, photos: newPhotos };
                    } else {
                        return { ...prev, privatePhoto: cacheBustedUrl };
                    }
                });
            }
        } catch (error: any) {
            console.error('Error uploading photo:', "Message:", error.message, "Details:", error.details, "Code:", error.code);
            setError(error.message === 'Bucket not found' 
                ? 'Erro de configuração: O repositório de fotos "profile-photos" não foi encontrado. Verifique o Supabase Storage.'
                : 'Falha ao enviar a foto. Tente novamente.');
        } finally {
             setUploadingStatus(prev => ({ ...prev, [uploadKey]: false }));
        }
    };

    const openUploadOptions = (type: 'public' | 'private', index?: number) => {
        setEditingPhoto({ type, index });
        setIsUploadModalOpen(true);
    };

    const handleChooseFromGallery = () => {
        setIsUploadModalOpen(false);
        fileInputRef.current?.click();
    };

    const handleTakePhoto = () => {
        setIsUploadModalOpen(false);
        setIsCameraOpen(true);
    };
    
    const handleCameraCapture = (dataUrl: string) => {
        setIsCameraOpen(false);
        if (editingPhoto) {
            const file = dataURLtoFile(dataUrl, `photo-${Date.now()}.jpg`);
            handlePhotoUpload(file, editingPhoto.type, editingPhoto.index);
        }
    };
    
    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && editingPhoto) {
            handlePhotoUpload(e.target.files[0], editingPhoto.type, editingPhoto.index);
        }
        e.target.value = ''; // Reset file input to allow re-uploading the same file
        setEditingPhoto(null);
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setLocationError(t('locationNotSupported'));
            return;
        }

        setIsGettingLocation(true);
        setLocationError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const locationString = t('locationObtained');
                setProfileData(prev => ({
                    ...prev,
                    latitude,
                    longitude,
                    location: locationString,
                }));
                 setIsGettingLocation(false);
            },
            (err) => {
                console.error("Geolocation error:", err.message);
                setIsGettingLocation(false);
                if (err.code === err.PERMISSION_DENIED) {
                    setLocationError(t('locationPermissionDenied'));
                } else {
                    setLocationError(t('locationError'));
                }
            }
        );
    };

    const handleNext = () => {
        setError(null);
        
        if (step === 1) {
            if (!profileData.name || !profileData.name.trim()) {
                setError('Por favor, informe seu nome.');
                return;
            }
            if (!profileData.dob) {
                setError('Por favor, informe sua data de nascimento.');
                return;
            }
            if (calculateAge(profileData.dob) < 18) {
                setError('Você deve ter pelo menos 18 anos para usar o app.');
                return;
            }
            if (!profileData.location || !profileData.location.trim()) {
                setError('Por favor, informe sua localização.');
                return;
            }
        }
        
        setStep(prev => prev + 1);
    };
    const handleBack = () => { setError(null); setStep(prev => prev - 1) };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        // Refactored change handler
        setProfileData(prev => {
            const newState = { ...prev };

            if (name === 'height' && type === 'tel') {
                const sanitized = value.replace(/[^0-9]/g, '');
                (newState as any)[name] = sanitized ? Number(sanitized) : undefined;
            } else if (name === 'gender') {
                const newGender = value as Gender;
                newState.gender = newGender;
                newState.seeking = newGender === Gender.HOMEM ? [Gender.MULHER] : [Gender.HOMEM];
            } else {
                (newState as any)[name] = value;
            }
            
            return newState;
        });
    };

    const handleToggleList = (listName: 'interests' | 'keyValues' | 'languages', value: string) => {
        const list = profileData[listName] as string[] || [];

        // Logic to enforce limits when adding an item
        if (!list.includes(value)) {
            if (listName === 'interests' && list.length >= 3) {
                addToast({ type: 'info', message: 'Você pode selecionar no máximo 3 interesses.' });
                return;
            }
            if (listName === 'keyValues' && list.length >= 3) {
                addToast({ type: 'info', message: 'Você pode selecionar no máximo 3 valores de fé.' });
                return;
            }
        }
        
        const newList = list.includes(value) ? list.filter(item => item !== value) : [...list, value];
        setProfileData({ ...profileData, [listName]: newList });
    };

    const handleSubmit = async () => {
        if (!user) {
            setError("Erro de autenticação. Por favor, faça login novamente.");
            return;
        }
        
        setError(null);
        setIsSubmitting(true);

        const finalProfile = {
            id: user.id,
            email: user.email, // Garante que o email seja enviado
            age: profileData.dob ? calculateAge(profileData.dob) : 0,
            ...profileData,
        };

        const dbData = appProfileToDbProfile(finalProfile);

        const { data, error: upsertError } = await supabase
            .from('user_profiles')
            .upsert(dbData, { onConflict: 'id' })
            .select()
            .single();

        setIsSubmitting(false);

        if (upsertError) {
            console.error("Error saving profile:", upsertError);
            setError(`Ocorreu um erro ao salvar seu perfil: ${upsertError.message}`);
        } else {
            onProfileCreated(dbProfileToAppProfile(data) as UserProfile, isEditing);
        }
    };
    
     const startVerification = () => {
        if (!profileData.photos?.[0]) {
            setError('É necessário adicionar sua foto de perfil principal (a primeira) antes de verificar.');
            setStep(2); // Leva o usuário de volta para a etapa de fotos
            return;
        }
        setError(null);
        setIsVerifying(true);
    };

    const totalSteps = 5;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-100 p-4 flex flex-col justify-center items-center">
                 <div className="w-8 h-8 border-4 border-t-sky-500 border-slate-200 rounded-full animate-spin"></div>
                 <p className="mt-4 text-slate-500">{t('loadingProgress')}</p>
            </div>
        );
    }
    
    if (isVerifying) {
        const profileForVerification = {
            id: user!.id,
            name: profileData.name || '',
            photos: profileData.photos || [null],
            age: profileData.age || 0,
            gender: profileData.gender || Gender.MULHER,
            location: profileData.location || '',
            bio: profileData.bio || '',
            denomination: profileData.denomination || '',
            churchFrequency: profileData.churchFrequency || ChurchFrequency.OCASIONALMENTE,
            keyValues: profileData.keyValues || [],
            relationshipGoal: profileData.relationshipGoal || RelationshipGoal.NAO_SEI,
            maritalStatus: profileData.maritalStatus || MaritalStatus.SOLTEIRO,
            interests: profileData.interests || [],
            isVerified: profileData.isVerified || false,
            face_verification_status: profileData.face_verification_status || VerificationStatus.NOT_VERIFIED,
            isPremium: profileData.isPremium || false,
        } as UserProfile;

        return <FaceVerification 
            userProfile={profileForVerification}
            onBack={() => setIsVerifying(false)} 
            onComplete={async (status: VerificationStatus) => {
                setProfileData(prev => ({ 
                    ...prev, 
                    face_verification_status: status,
                    isVerified: status === VerificationStatus.VERIFIED
                }));
                setIsVerifying(false);
            }} 
        />;
    }

    const PhotoUploader: React.FC<{
        photo: string | null;
        isUploading: boolean;
        onClick: () => void;
    }> = ({ photo, isUploading, onClick }) => (
        <button type="button" onClick={onClick} className="cursor-pointer aspect-square bg-slate-200 rounded-lg flex items-center justify-center relative overflow-hidden">
            {photo && <img src={photo} alt="Foto de perfil" className="w-full h-full object-cover" />}
            {isUploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-t-white border-white/50 rounded-full animate-spin"></div>
                </div>
            )}
            {!photo && !isUploading && <PhotoIcon className="w-8 h-8 text-slate-400" />}
        </button>
    );

    if (isEditing) {
        return (
            <>
                <div className="fixed inset-0 z-40 bg-slate-100 flex flex-col animate-slide-in-right">
                    <header className="bg-white p-4 flex items-center justify-between shadow-sm sticky top-0 z-10 flex-shrink-0">
                        <button onClick={onClose} className="p-2 -ml-2">
                            <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
                        </button>
                        <h1 className="text-xl font-bold text-slate-800">{t('editProfile')}</h1>
                        <button
                            onClick={handleSubmit}
                            disabled={!isDirty || isSubmitting}
                            className="font-semibold text-sky-600 disabled:text-slate-400 text-lg px-2"
                        >
                            {isSubmitting ? t('saving') : t('save')}
                        </button>
                    </header>
                    <main className="flex-grow overflow-y-auto p-4 w-full max-w-2xl mx-auto">
                        {error && <p className="text-red-600 bg-red-50 p-3 rounded-md text-sm text-center mb-4">{error}</p>}
                        
                        <FormSection title={t('yourPhotos')}>
                             <p className="text-sm text-slate-500 -mt-2 mb-4">{t('addOnePhoto')}</p>
                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                {profileData.photos?.map((photo, index) => (
                                    <PhotoUploader
                                        key={`public_${index}`}
                                        photo={photo}
                                        isUploading={uploadingStatus[`public_${index}`]}
                                        onClick={() => openUploadOptions('public', index)}
                                    />
                                ))}
                            </div>
                        </FormSection>

                        <FormSection title={t('basicInfo')}>
                            <div>
                                <label className="font-semibold text-sm text-slate-600">{t('yourName')}</label>
                                <input type="text" name="name" placeholder={t('yourNamePlaceholder')} onChange={handleChange} value={profileData.name || ''} className="w-full mt-1 p-2 border rounded" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                 <div>
                                    <label className="font-semibold text-sm text-slate-600">{t('dob')}</label>
                                    <input type="date" name="dob" onChange={handleChange} value={profileData.dob || ''} className="w-full mt-1 p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="font-semibold text-sm text-slate-600">{t('height')}</label>
                                    <input type="tel" inputMode="numeric" name="height" placeholder={t('heightPlaceholder')} onChange={handleChange} value={profileData.height || ''} className="w-full mt-1 p-2 border rounded" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="font-semibold text-sm text-slate-600">{t('iam')}</label>
                                    <select name="gender" onChange={handleChange} value={profileData.gender} className="w-full mt-1 p-2 border rounded">
                                        <option value={Gender.HOMEM}>{t('man')}</option>
                                        <option value={Gender.MULHER}>{t('woman')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="font-semibold text-sm text-slate-600">{t('seeking')}</label>
                                    <input type="text" value={ profileData.seeking?.[0] === Gender.HOMEM ? t('man') : t('woman')} className="w-full mt-1 p-2 border rounded bg-slate-100 text-slate-500 cursor-not-allowed" readOnly />
                                </div>
                            </div>
                            <div>
                                <label className="font-semibold text-sm text-slate-600">{t('location')}</label>
                                <div className="flex items-center gap-2 mt-1">
                                    <input type="text" name="location" placeholder={isGettingLocation ? t('gettingLocation') : t('locationPlaceholder')} onChange={handleChange} value={profileData.location || ''} className="w-full p-2 border rounded" disabled={isGettingLocation} />
                                    <button type="button" onClick={handleGetLocation} disabled={isGettingLocation} className="p-2 bg-sky-100 text-sky-700 rounded-md hover:bg-sky-200 disabled:opacity-50" aria-label={t('useCurrentLocation')}>
                                        {isGettingLocation ? <div className="w-6 h-6 border-2 border-t-sky-500 border-sky-200 rounded-full animate-spin"></div> : <LocationMarkerIcon className="w-6 h-6" />}
                                    </button>
                                </div>
                                {locationError && <p className="text-red-500 text-xs mt-1">{locationError}</p>}
                            </div>
                        </FormSection>

                        <FormSection title={t('aboutYou')}>
                             <div>
                                <label className="font-semibold text-sm text-slate-600">{t('yourBio')}</label>
                                <textarea name="bio" rows={5} placeholder={t('yourBioPlaceholder')} onChange={handleChange} value={profileData.bio || ''} className="w-full mt-1 p-2 border rounded"></textarea>
                            </div>
                             <div>
                                <label className="font-semibold text-sm text-slate-600">{t('interestsPrompt')}</label>
                                 <div className="flex flex-wrap mt-2">
                                    {interests.map(i => (
                                        <button key={i.id} type="button" onClick={() => handleToggleList('interests', i.name)} className={`text-sm m-1 px-3 py-1.5 rounded-full flex items-center gap-2 ${profileData.interests?.includes(i.name) ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                            {i.emoji && <span>{i.emoji}</span>}
                                            <span>{i.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="font-semibold text-sm text-slate-600">{t('languages')}</label>
                                 <div className="flex flex-wrap mt-2">
                                    {languages.map(l => (
                                        <button key={l.id} type="button" onClick={() => handleToggleList('languages', l.name)} className={`text-sm m-1 px-3 py-1.5 rounded-full flex items-center gap-2 ${profileData.languages?.includes(l.name) ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                            {l.emoji && <span>{l.emoji}</span>}
                                            <span>{l.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </FormSection>
                        
                         <FormSection title={t('faithAndValues')}>
                            <div>
                                <label className="font-semibold text-sm text-slate-600">{t('yourDenomination')}</label>
                                <select name="denomination" onChange={handleChange} value={profileData.denomination} className="w-full mt-1 p-2 border rounded">
                                    {denominations.map(d => <option key={d.id} value={d.name}>{d.emoji} {d.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="font-semibold text-sm text-slate-600">Nome da Igreja <span className="font-normal text-slate-400">(Opcional)</span></label>
                                <input type="text" name="churchName" placeholder="Ex: Igreja da Cidade" onChange={handleChange} value={profileData.churchName || ''} className="w-full mt-1 p-2 border rounded" />
                            </div>
                            <div>
                                <label className="font-semibold text-sm text-slate-600">Louvor / Música Favorita</label>
                                <input type="text" name="favoriteSong" placeholder="Ex: Ousado Amor" onChange={handleChange} value={profileData.favoriteSong || ''} className="w-full mt-1 p-2 border rounded" />
                            </div>
                             <div>
                                <label className="font-semibold text-sm text-slate-600">Versículo Favorito</label>
                                <input type="text" name="favoriteVerse" placeholder="Ex: Filipenses 4:13" onChange={handleChange} value={profileData.favoriteVerse || ''} className="w-full mt-1 p-2 border rounded" />
                            </div>
                            <div>
                                <label className="font-semibold text-sm text-slate-600">Livro Favorito</label>
                                <input type="text" name="favoriteBook" placeholder="Ex: As Crônicas de Nárnia" onChange={handleChange} value={profileData.favoriteBook || ''} className="w-full mt-1 p-2 border rounded" />
                            </div>
                            <div>
                                <label className="font-semibold text-sm text-slate-600">{t('faithValuesPrompt')}</label>
                                 <div className="flex flex-wrap mt-2">
                                    {keyValues.map(v => (
                                        <button key={v.id} type="button" onClick={() => handleToggleList('keyValues', v.name)} className={`text-sm m-1 px-3 py-1.5 rounded-full flex items-center gap-2 ${profileData.keyValues?.includes(v.name) ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                            {v.emoji && <span>{v.emoji}</span>}
                                            <span>{v.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </FormSection>

                    </main>
                </div>
                {isUploadModalOpen && (
                    <PhotoUploadModal 
                        onClose={() => setIsUploadModalOpen(false)}
                        onTakePhoto={handleTakePhoto}
                        onChooseFromGallery={handleChooseFromGallery}
                    />
                )}
                {isCameraOpen && (
                    <CameraCapture
                        onClose={() => setIsCameraOpen(false)}
                        onCapture={handleCameraCapture}
                    />
                )}
                 <input ref={fileInputRef} type="file" className="hidden" accept="image/png, image/jpeg" onChange={onFileSelect} />
            </>
        );
    }


    // Original return for initial creation
    const formContent = (
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
            {error && <p className="text-red-600 bg-red-50 p-3 rounded-md text-sm text-center mb-4">{error}</p>}
            <ProgressBar step={step} totalSteps={totalSteps} />
            
            {step > 1 && (
                <button onClick={handleBack} className="text-sm font-semibold text-sky-600 mb-4">&larr; {t('back')}</button>
            )}

            {step === 1 && (
                <div>
                    <h1 className="text-2xl font-bold mb-4">{t('basicInfo')}</h1>
                    <div className="space-y-4">
                        <div>
                            <label className="font-semibold">{t('yourName')}</label>
                            <input type="text" name="name" placeholder={t('yourNamePlaceholder')} onChange={handleChange} value={profileData.name || ''} className="w-full mt-1 p-2 border rounded" />
                        </div>
                         <div>
                            <label className="font-semibold">{t('dob')}</label>
                            <input type="date" name="dob" onChange={handleChange} value={profileData.dob || ''} className="w-full mt-1 p-2 border rounded" />
                        </div>
                        <div>
                            <label className="font-semibold">{t('iam')}</label>
                            <select name="gender" onChange={handleChange} value={profileData.gender} className="w-full mt-1 p-2 border rounded">
                                <option value={Gender.HOMEM}>{t('man')}</option>
                                <option value={Gender.MULHER}>{t('woman')}</option>
                            </select>
                        </div>
                         <div>
                            <label className="font-semibold">{t('seeking')}</label>
                            <input
                                type="text"
                                value={
                                    profileData.seeking?.[0] === Gender.HOMEM
                                    ? t('man')
                                    : profileData.seeking?.[0] === Gender.MULHER
                                    ? t('woman')
                                    : ''
                                }
                                className="w-full mt-1 p-2 border rounded bg-slate-100 text-slate-500 cursor-not-allowed"
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="font-semibold">{t('location')}</label>
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type="text"
                                    name="location"
                                    placeholder={isGettingLocation ? t('gettingLocation') : t('locationPlaceholder')}
                                    onChange={handleChange}
                                    value={profileData.location || ''}
                                    className="w-full p-2 border rounded"
                                    disabled={isGettingLocation}
                                />
                                <button
                                    type="button"
                                    onClick={handleGetLocation}
                                    disabled={isGettingLocation}
                                    className="p-2 bg-sky-100 text-sky-700 rounded-md hover:bg-sky-200 disabled:opacity-50"
                                    aria-label={t('useCurrentLocation')}
                                >
                                    {isGettingLocation ? (
                                        <div className="w-6 h-6 border-2 border-t-sky-500 border-sky-200 rounded-full animate-spin"></div>
                                    ) : (
                                        <LocationMarkerIcon className="w-6 h-6" />
                                    )}
                                </button>
                            </div>
                             {locationError && <p className="text-red-500 text-xs mt-1">{locationError}</p>}
                        </div>
                        <button onClick={handleNext} className="w-full bg-sky-600 text-white font-bold py-3 rounded-lg">{t('continue')}</button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h1 className="text-2xl font-bold mb-4">{t('yourPhotos')}</h1>
                    <p className="text-sm text-slate-500 mb-4">{t('addOnePhoto')}</p>
                    <div className="grid grid-cols-3 gap-2">
                        {profileData.photos?.map((photo, index) => (
                            <PhotoUploader
                                key={`public_${index}`}
                                photo={photo}
                                isUploading={uploadingStatus[`public_${index}`]}
                                onClick={() => openUploadOptions('public', index)}
                            />
                        ))}
                    </div>

                    <button onClick={handleNext} className="w-full bg-sky-600 text-white font-bold py-3 rounded-lg mt-6">{t('continue')}</button>
                </div>
            )}
            
            {step === 3 && (
                <div>
                    <h1 className="text-2xl font-bold mb-4">{t('faithAndValues')}</h1>
                     <div className="space-y-4">
                        <div>
                            <label className="font-semibold">{t('yourDenomination')}</label>
                            <select name="denomination" onChange={handleChange} value={profileData.denomination} className="w-full mt-1 p-2 border rounded">
                                {denominations.map(d => <option key={d.id} value={d.name}>{d.emoji} {d.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="font-semibold">{t('faithValuesPrompt')}</label>
                             <div className="flex flex-wrap mt-2">
                                {keyValues.map(v => (
                                    <button key={v.id} type="button" onClick={() => handleToggleList('keyValues', v.name)} className={`text-sm m-1 px-3 py-1.5 rounded-full flex items-center gap-2 ${profileData.keyValues?.includes(v.name) ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                        {v.emoji && <span>{v.emoji}</span>}
                                        <span>{v.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                         <button onClick={handleNext} className="w-full bg-sky-600 text-white font-bold py-3 rounded-lg">{t('continue')}</button>
                    </div>
                </div>
            )}
            
            {step === 4 && (
                <div>
                    <h1 className="text-2xl font-bold mb-4">{t('aboutYou')}</h1>
                     <div className="space-y-4">
                        <div>
                            <label className="font-semibold">{t('yourBio')}</label>
                            <textarea name="bio" rows={4} placeholder={t('yourBioPlaceholder')} onChange={handleChange} value={profileData.bio || ''} className="w-full mt-1 p-2 border rounded"></textarea>
                        </div>
                         <div>
                            <label className="font-semibold">{t('interestsPrompt')}</label>
                             <div className="flex flex-wrap mt-2">
                                {interests.map(i => (
                                    <button key={i.id} type="button" onClick={() => handleToggleList('interests', i.name)} className={`text-sm m-1 px-3 py-1.5 rounded-full flex items-center gap-2 ${profileData.interests?.includes(i.name) ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                        {i.emoji && <span>{i.emoji}</span>}
                                        <span>{i.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="font-semibold">{t('languages')}</label>
                             <div className="flex flex-wrap mt-2">
                                {languages.map(l => (
                                    <button key={l.id} type="button" onClick={() => handleToggleList('languages', l.name)} className={`text-sm m-1 px-3 py-1.5 rounded-full flex items-center gap-2 ${profileData.languages?.includes(l.name) ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                        {l.emoji && <span>{l.emoji}</span>}
                                        <span>{l.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                         <button onClick={handleNext} className="w-full bg-sky-600 text-white font-bold py-3 rounded-lg">{t('continueToVerification')}</button>
                    </div>
                </div>
            )}

            {step === 5 && (
                <div>
                     <h1 className="text-2xl font-bold mb-4 text-center">Verificação de Perfil</h1>
                    
                    {profileData.face_verification_status === VerificationStatus.VERIFIED ? (
                        <div className="text-center p-4 bg-green-50 text-green-800 rounded-lg">
                            <CheckBadgeIcon className="w-12 h-12 mx-auto text-green-500 mb-2"/>
                            <h3 className="font-bold">Perfil Verificado!</h3>
                            <p className="text-sm mt-1">Você concluiu todas as etapas com sucesso.</p>
                        </div>
                    ) : profileData.face_verification_status === VerificationStatus.REJECTED ? (
                        <div className="text-center p-4 bg-red-50 text-red-800 rounded-lg">
                            <h3 className="font-bold">Verificação Rejeitada</h3>
                            <p className="text-sm mt-1">Não foi possível confirmar sua identidade. Tente novamente em um local bem iluminado.</p>
                             <button onClick={startVerification} className="mt-4 w-full bg-sky-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2">
                                <ArrowPathIcon className="w-5 h-5"/>
                                Tentar Novamente
                            </button>
                        </div>
                    ) : profileData.face_verification_status === VerificationStatus.PENDING ? (
                         <div className="text-center p-4 bg-amber-50 text-amber-800 rounded-lg">
                            <h3 className="font-bold">Verificação em Análise</h3>
                            <p className="text-sm mt-1">Sua verificação está sendo analisada. Você pode finalizar o cadastro e será notificado quando o processo for concluído.</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-sm text-slate-600 mb-6">{t('selfieVerificationDesc')}</p>
                            <button onClick={startVerification} className="w-full bg-sky-600 text-white font-bold py-3 rounded-lg">
                                {t('startVerification')}
                            </button>
                        </div>
                    )}

                    <button 
                        onClick={handleSubmit} 
                        disabled={isSubmitting || profileData.face_verification_status !== VerificationStatus.VERIFIED} 
                        className="w-full bg-green-600 text-white font-bold py-3 rounded-lg disabled:bg-green-300 disabled:cursor-not-allowed mt-6"
                    >
                        {isSubmitting ? t('saving') : t('saveAndFinish')}
                    </button>
                     {profileData.face_verification_status !== VerificationStatus.VERIFIED && (
                         <p className="text-xs text-center text-slate-500 mt-2">Você deve ser verificado para finalizar o cadastro.</p>
                     )}
                </div>
            )}
        </div>
    );
};