import React from 'react';
import { DynamicLogo } from './DynamicLogo';

interface LoadingScreenProps {
  logoUrl: string | null;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ logoUrl }) => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-sky-600 text-white">
      <DynamicLogo logoUrl={logoUrl} className="w-28 h-28 mb-4 animate-pulse drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]" />
      <h1 className="text-2xl font-bold">Carregando...</h1>
    </div>
  );
};