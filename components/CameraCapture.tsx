import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { CameraIcon } from './icons/CameraIcon';
import { ArrowPathIcon } from './icons/ArrowPathIcon';

interface CameraCaptureProps {
    onClose: () => void;
    onCapture: (dataUrl: string) => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onClose, onCapture }) => {
    const [step, setStep] = useState<'capture' | 'review'>('capture');
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

    const startCamera = useCallback(async () => {
        setError(null);
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera: ", err);
                setError("Não foi possível acessar a câmera. Verifique as permissões do seu navegador.");
            }
        } else {
            setError("Seu navegador não suporta acesso à câmera.");
        }
    }, []);

    useEffect(() => {
        if (step === 'capture') {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [step, startCamera, stopCamera]);

    const handleCaptureClick = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                const video = videoRef.current;
                canvasRef.current.width = video.videoWidth;
                canvasRef.current.height = video.videoHeight;
                // Flip the image horizontally for a mirror effect
                context.translate(video.videoWidth, 0);
                context.scale(-1, 1);
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                const dataUrl = canvasRef.current.toDataURL('image/jpeg');
                setImageSrc(dataUrl);
                setStep('review');
            }
        }
    };

    const handleUsePhoto = () => {
        if (imageSrc) {
            onCapture(imageSrc);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col animate-slide-in-right">
            <header className="p-4 flex items-center sticky top-0 z-20 flex-shrink-0">
                <button onClick={onClose} className="p-2 -ml-2 mr-2">
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">Tirar Foto</h1>
            </header>
            
            <main className="flex-grow flex flex-col items-center justify-center p-4 text-center">
                {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4">{error}</p>}

                <div className="relative w-full max-w-sm aspect-[3/4] rounded-xl overflow-hidden mb-6 bg-black flex items-center justify-center">
                    {step === 'capture' && <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]"></video>}
                    {step === 'review' && imageSrc && <img src={imageSrc} alt="Sua foto" className="w-full h-full object-cover" />}
                </div>

                {step === 'capture' && (
                    <button onClick={handleCaptureClick} className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-slate-700" aria-label="Tirar foto">
                        <CameraIcon className="w-8 h-8 text-slate-800" />
                    </button>
                )}

                {step === 'review' && (
                    <div className="w-full max-w-sm flex gap-4">
                        <button onClick={() => setStep('capture')} className="flex-1 bg-slate-600 font-bold py-3 rounded-full flex items-center justify-center gap-2">
                            <ArrowPathIcon className="w-5 h-5" />
                            Tirar Outra
                        </button>
                        <button onClick={handleUsePhoto} className="flex-1 bg-sky-500 font-bold py-3 rounded-full">
                            Usar Foto
                        </button>
                    </div>
                )}
                
                <canvas ref={canvasRef} className="hidden"></canvas>
            </main>
        </div>
    );
};