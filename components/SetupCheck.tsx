import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface SetupCheckProps {
  children: React.ReactNode;
}

export const SetupCheck: React.FC<SetupCheckProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [setupErrors, setSetupErrors] = useState<string[]>([]);

  useEffect(() => {
    const checkSupabaseSetup = async () => {
      const errors: string[] = [];

      // Array of checks to run in parallel
      const checks = [
        // 1. Check for 'user_profiles' table
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }).then(({ error }) => {
          if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes("does not exist"))) {
            errors.push('A tabela "user_profiles" não foi encontrada.');
          }
        }),

        // 2. Check for 'profile-photos' bucket
        supabase.storage.from('profile-photos').list('', { limit: 1 }).then(({ error }) => {
          if (error && error.message.toLowerCase().includes('bucket not found')) {
            errors.push('O repositório (bucket) "profile-photos" não foi encontrado.');
          }
        }),
      
        // 3. Check for 'messages' table
        supabase.from('messages').select('id', { count: 'exact', head: true }).then(({ error }) => {
          if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes("does not exist"))) {
            errors.push('A tabela "messages" não foi encontrada.');
          }
        }),

        // 4. Check for 'campaigns' table (NEW)
        supabase.from('campaigns').select('id', { count: 'exact', head: true }).then(({ error }) => {
            if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes("does not exist"))) {
                errors.push('A tabela "campaigns" para ferramentas de marketing não foi encontrada.');
            }
        }),

        // 5. Check for 'marketing-assets' bucket (NEW)
        supabase.storage.from('marketing-assets').list('', { limit: 1 }).then(({ error }) => {
            if (error && error.message.toLowerCase().includes('bucket not found')) {
                errors.push('O repositório (bucket) "marketing-assets" não foi encontrado.');
            }
        }),

        // 6. Check for 'support_tickets' table
        supabase.from('support_tickets').select('id', { count: 'exact', head: true }).then(({ error }) => {
          if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes("does not exist"))) {
              errors.push('A tabela "support_tickets" não foi encontrada.');
          }
        }),
        
        // 7. Check for 'reports' table
        supabase.from('reports').select('id', { count: 'exact', head: true }).then(({ error }) => {
          if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes("does not exist"))) {
              errors.push('A tabela "reports" não foi encontrada.');
          }
        }),

        // 8. Check for 'face_verifications' table
        supabase.from('face_verifications').select('id', { count: 'exact', head: true }).then(({ error }) => {
            if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes("does not exist"))) {
                errors.push('A tabela "face_verifications" não foi encontrada.');
            }
        }),
      ];

      await Promise.all(checks);

      setSetupErrors(errors);
      setIsLoading(false);
    };

    checkSupabaseSetup();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-100 text-center p-4">
        <div className="w-8 h-8 border-4 border-t-sky-500 border-slate-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-600 font-semibold">Verificando configuração...</p>
      </div>
    );
  }

  if (setupErrors.length > 0) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-red-50 text-center p-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-red-700">Erro de Estrutura Supabase</h1>
          <div className="mt-6 text-left bg-white p-6 rounded-lg shadow-md border border-red-200">
            <ul className="list-disc list-inside space-y-2 text-slate-700 mb-4">
              {setupErrors.map((err, index) => <li key={index}>{err}</li>)}
            </ul>
            <p className="text-sm text-slate-600 border-t pt-4">
              Certifique-se de criar a tabela <strong>campaigns</strong> e o bucket <strong>marketing-assets</strong> como público no Supabase.
            </p>
          </div>
           <p className="mt-6 text-sm text-slate-500">Após configurar, atualize esta página.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};