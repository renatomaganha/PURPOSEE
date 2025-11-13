import React from 'react';
import { DynamicLogo } from '../../components/DynamicLogo';

interface AdminLandingPageProps {
  logoUrl: string | null;
  onEnter: () => void;
}

export const AdminLandingPage: React.FC<AdminLandingPageProps> = ({ logoUrl, onEnter }) => {
  return (
    <div className="h-screen w-screen bg-slate-800 text-white flex flex-col items-center justify-center text-center p-6">
      <DynamicLogo logoUrl={logoUrl} className="w-24 h-24 drop-shadow-[0_0_8px_rgba(200,200,210,0.2)]" />
      <h1 className="text-4xl font-bold mt-4">Painel Administrativo</h1>
      <p className="mt-2 text-lg text-slate-300">PURPOSE MATCH</p>
      <p className="mt-8 max-w-md text-slate-400">
        Bem-vindo(a) à área de gerenciamento. Por favor, faça login para acessar os dados e ferramentas da plataforma.
      </p>
      <button
        onClick={onEnter}
        className="mt-8 bg-sky-600 font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-sky-700 transition-transform transform hover:scale-105"
      >
        Fazer Login
      </button>
    </div>
  );
};