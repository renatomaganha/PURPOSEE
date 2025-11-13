import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { VideoCameraSolidIcon } from './icons/VideoCameraSolidIcon';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';

interface SelfieVerificationProps {
    onBack: () => void;
    onComplete: (selfie: string) => void;
}

export const SelfieVerification: React.FC<SelfieVerificationProps> = ({ onBack, onComplete }) => {
    const [step, setStep] = useState<'instructions' | 'capture' | 'review' | 'submitting' | 'success'>('instructions');
    const [imageSrc, setImageSrc] = useState<string | null>(null);
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
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error("Error accessing camera: ", err);
                    alert("Não foi possível acessar a câmera. Verifique as permissões do seu navegador.");
                    onBack();
                }
            }
        };

        if (step === 'capture') {
            startCamera();
        } else {
            stopCamera();
        }

        return () => stopCamera();
    }, [step, onBack, stopCamera]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
                const dataUrl = canvasRef.current.toDataURL('image/jpeg');
                setImageSrc(dataUrl);
                stopCamera(); // Stop camera after capture for review
                setStep('review');
            }
        }
    };

    const handleSubmit = () => {
        if (imageSrc) {
            setStep('submitting');
            setTimeout(() => { // Simulate API call
                setStep('success');
                setTimeout(() => onComplete(imageSrc), 2000);
            }, 1500);
        }
    };

    return (
        <div className="h-screen w-full bg-slate-900 text-white flex flex-col">
            <header className="p-4 flex items-center sticky top-0 z-20">
                <button onClick={onBack} className="p-2 -ml-2 mr-2">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Verificação por Selfie</h1>
            </header>
            
            <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
                {step === 'instructions' && (
                    <>
                        <VideoCameraSolidIcon className="w-24 h-24 mb-6" />
                        <h2 className="text-2xl font-bold mb-4">Prepare-se para a Selfie</h2>
                        <p className="max-w-md mb-8">Vamos tirar uma foto rápida para confirmar que é você mesmo(a). Centralize seu rosto na moldura e certifique-se de que a iluminação está boa.</p>
                        <button onClick={() => setStep('capture')} className="w-full max-w-xs bg-sky-500 font-bold py-3 rounded-full">Estou Pronto(a)</button>
                    </>
                )}
                
                {step === 'capture' && (
                    <div className="w-full max-w-sm mx-auto flex flex-col items-center">
                        <div className="relative w-64 h-80 rounded-xl overflow-hidden mb-6 border-4 border-sky-400">
                             <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]"></video>
                        </div>
                        <button onClick={handleCapture} className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg"></button>
                    </div>
                )}
                
                {step === 'review' && imageSrc && (
                     <div className="w-full max-w-sm mx-auto flex flex-col items-center">
                        <img src={imageSrc} alt="Sua selfie" className="w-64 h-80 rounded-xl object-cover mb-6 border-4 border-white" />
                         <p className="mb-4">A foto ficou boa?</p>
                         <div className="w-full flex gap-4">
                             <button onClick={() => setStep('capture')} className="flex-1 bg-slate-600 font-bold py-3 rounded-full">Tirar Outra</button>
                             <button onClick={handleSubmit} className="flex-1 bg-green-500 font-bold py-3 rounded-full">Enviar Foto</button>
                         </div>
                    </div>
                )}
                
                 {(step === 'submitting' || step === 'success') && (
                     <div className="flex flex-col items-center">
                         {step === 'submitting' && <div className="w-16 h-16 border-4 border-t-white border-white/50 rounded-full animate-spin mb-4"></div>}
                         {step === 'success' && <CheckBadgeIcon className="w-20 h-20 text-green-400 mb-4" />}
                         <h2 className="text-2xl font-bold">
                             {step === 'submitting' ? 'Analisando...' : 'Verificação Enviada!'}
                         </h2>
                         <p className="max-w-xs mt-2 text-slate-300">
                             {step === 'submitting' ? 'Estamos processando sua selfie.' : 'Nossa equipe irá revisar sua foto em breve. Você receberá uma notificação.'}
                         </p>
                     </div>
                 )}
                
                <canvas ref={canvasRef} className="hidden"></canvas>
            </main>
        </div>
    );
};