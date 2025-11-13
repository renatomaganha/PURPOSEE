import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';
import { FaceSmileIcon } from './icons/FaceSmileIcon';
import { UserProfile, VerificationStatus } from '../types';
import { supabase } from '../lib/supabaseClient';
import { ArrowPathIcon } from './icons/ArrowPathIcon';
import { CameraIcon } from './icons/CameraIcon';
import { XIcon } from './icons/XIcon';
// FIX: Imported missing VideoCameraSolidIcon component.
import { VideoCameraSolidIcon } from './icons/VideoCameraSolidIcon';


interface FaceVerificationProps {
    userProfile: UserProfile;
    onBack: () => void;
    onComplete: (status: VerificationStatus) => Promise<void>;
}

type VerificationStep = 'instructions' | 'capture' | 'analyzing' | 'success' | 'failure';
type LivenessChallenge = 'center' | 'smile' | 'turn_right' | 'done';

const challengePrompts: Record<LivenessChallenge, string> = {
    center: "Centralize seu rosto no círculo",
    smile: "Agora, sorria!",
    turn_right: "Vire seu rosto para a direita",
    done: "Ótimo! Capturando..."
};

export const FaceVerification: React.FC<FaceVerificationProps> = ({ userProfile, onBack, onComplete }) => {
    const [step, setStep] = useState<VerificationStep>('instructions');
    const [challenge, setChallenge] = useState<LivenessChallenge>('center');
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    useEffect(() => {
        const startCamera = async () => {
            if (step === 'capture') {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 480, height: 640 } });
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error("Error accessing camera: ", err);
                    setError("Não foi possível acessar a câmera. Verifique as permissões do seu navegador e tente novamente.");
                    setStep('instructions');
                }
            }
        };

        startCamera();
        
        // Cleanup function to stop camera when component unmounts or step changes
        return () => stopCamera();
    }, [step, stopCamera]);


    const handleCapture = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                const video = videoRef.current;
                canvasRef.current.width = video.videoWidth;
                canvasRef.current.height = video.videoHeight;
                context.translate(video.videoWidth, 0);
                context.scale(-1, 1);
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.9);
                setImageSrc(dataUrl);
                stopCamera();
                setStep('analyzing');
            }
        }
    }, [stopCamera]);

    // Liveness challenge progression
    useEffect(() => {
        if (step !== 'capture' || challenge === 'done') return;

        // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> for browser compatibility.
        let timer: ReturnType<typeof setTimeout>;
        if (challenge === 'center') {
            timer = setTimeout(() => setChallenge('smile'), 2500);
        } else if (challenge === 'smile') {
            timer = setTimeout(() => setChallenge('turn_right'), 2500);
        } else if (challenge === 'turn_right') {
            timer = setTimeout(() => {
                setChallenge('done');
                handleCapture();
            }, 2000);
        }

        return () => { if (timer) clearTimeout(timer) };
    }, [step, challenge, handleCapture]);


    const handleSubmit = useCallback(async () => {
        if (!imageSrc || !userProfile.photos[0]) return;
        setError(null);
        
        try {
            // SIMULAÇÃO DE ANÁLISE E DECISÃO AUTOMÁTICA
            // Em um sistema real, você enviaria imageSrc e a foto de perfil para um backend
            // que usaria uma API de reconhecimento facial (ex: AWS Rekognition) para comparar.
            // Aqui, vamos simular o resultado com uma chance de 80% de sucesso.
            const isMatch = Math.random() < 0.8; 
            const finalStatus = isMatch ? VerificationStatus.VERIFIED : VerificationStatus.REJECTED;

            // 1. Upload da selfie para o Supabase Storage (independente do resultado)
            const response = await fetch(imageSrc);
            const blob = await response.blob();
            const fileName = `${userProfile.id}/selfie-${Date.now()}.jpg`;
            
            const { error: uploadError } = await supabase.storage
                .from('face-verifications')
                .upload(fileName, blob);
            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage
                .from('face-verifications')
                .getPublicUrl(fileName);
            if (!publicUrlData) throw new Error("Could not get selfie public URL.");

            // 2. Inserir o registro na tabela 'face_verifications' com o resultado automático
            const { error: insertError } = await supabase
                .from('face_verifications')
                .insert({
                    user_id: userProfile.id,
                    user_name: userProfile.name,
                    profile_photo_url: userProfile.photos[0],
                    selfie_photo_url: publicUrlData.publicUrl,
                    status: finalStatus,
                    reviewed_by: 'Sistema Automático'
                });
            if (insertError) throw insertError;
            
            // 3. Atualizar o perfil do usuário
            await onComplete(finalStatus);

            // 4. Mostrar a tela de resultado correta
            setStep(isMatch ? 'success' : 'failure');

        } catch (err: any) {
            console.error("Error submitting verification:", err);
            setError("Ocorreu um erro ao enviar sua verificação. Por favor, tente novamente.");
            setStep('failure'); // Mostra a tela de falha genérica
        }
    }, [imageSrc, userProfile, onComplete]);

    useEffect(() => {
        if (step === 'analyzing') {
            const timer = setTimeout(handleSubmit, 2500); // Simula o tempo de análise
            return () => clearTimeout(timer);
        }
    }, [step, handleSubmit]);

    const resetFlow = () => {
        setError(null);
        setImageSrc(null);
        setChallenge('center');
        setStep('capture');
    }

    const renderContent = () => {
        switch(step) {
            case 'instructions':
                return (
                    <>
                        <div className="relative w-48 h-48 mb-6">
                            <FaceSmileIcon className="w-full h-full text-sky-400" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center">
                                <VideoCameraSolidIcon className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Verificação de Autenticidade</h2>
                        <p className="max-w-md mb-8 text-slate-300">Vamos confirmar que é você. Siga as instruções na tela. O processo é rápido e automático.</p>
                        {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4">{error}</p>}
                        <button onClick={() => setStep('capture')} className="w-full max-w-xs bg-sky-500 font-bold py-3 rounded-full">Começar</button>
                    </>
                );

            case 'capture':
                return (
                    <div className="w-full max-w-sm mx-auto flex flex-col items-center">
                        <div className="relative w-72 h-72 rounded-full overflow-hidden mb-6 border-4 border-sky-400 bg-black">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]"></video>
                        </div>
                        <p className="font-bold text-lg h-12 flex items-center justify-center transition-opacity duration-500">
                           {challengePrompts[challenge]}
                        </p>
                    </div>
                );

            case 'analyzing':
                return (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-t-white border-white/50 rounded-full animate-spin mb-4"></div>
                        <h2 className="text-2xl font-bold">Analisando...</h2>
                        <p className="max-w-xs mt-2 text-slate-300">Estamos comparando sua selfie com a foto do seu perfil. Isso levará apenas um momento.</p>
                    </div>
                );
            
            case 'success':
                 return (
                     <div className="flex flex-col items-center">
                         <CheckBadgeIcon className="w-20 h-20 text-green-400 mb-4" />
                         <h2 className="text-2xl font-bold">Perfil Verificado!</h2>
                         <p className="max-w-xs mt-2 text-slate-300">Obrigado! Sua identidade foi confirmada e um selo de verificação foi adicionado ao seu perfil.</p>
                     </div>
                 );

            case 'failure':
                return (
                     <div className="flex flex-col items-center">
                         <XIcon className="w-20 h-20 text-red-400 mb-4" />
                         <h2 className="text-2xl font-bold">Verificação Falhou</h2>
                         <p className="max-w-xs mt-2 text-slate-300">
                             {error || "Não conseguimos confirmar a correspondência. Por favor, tente novamente em um local com melhor iluminação e sem acessórios no rosto."}
                         </p>
                         <button onClick={resetFlow} className="mt-8 w-full max-w-xs bg-sky-500 font-bold py-3 rounded-full flex items-center justify-center gap-2">
                            <ArrowPathIcon className="w-5 h-5"/>
                            Tentar Novamente
                         </button>
                     </div>
                 );
        }
    }

    return (
        <div className="fixed inset-0 z-40 bg-slate-900 text-white flex flex-col animate-slide-in-right">
            <header className="p-4 flex items-center sticky top-0 z-20">
                {step !== 'success' && step !== 'analyzing' && (
                     <button onClick={onBack} className="p-2 -ml-2 mr-2">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                )}
                <h1 className="text-xl font-bold">Verificação Facial</h1>
            </header>
            
            <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
                {renderContent()}
                <canvas ref={canvasRef} className="hidden"></canvas>
            </main>
        </div>
    );
};