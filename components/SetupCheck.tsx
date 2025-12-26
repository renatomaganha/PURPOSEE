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
          if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes("does not exist") || error.message.includes("schema cache"))) {
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
          if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes("does not exist") || error.message.includes("schema cache"))) {
            errors.push('A tabela "messages" não foi encontrada.');
          }
        }),

        // 4. Check for 'campaigns' table
        supabase.from('campaigns').select('id', { count: 'exact', head: true }).then(({ error }) => {
            if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes("does not exist") || error.message.includes("schema cache"))) {
                errors.push('A tabela "campaigns" (Marketing) não foi encontrada.');
            }
        }),

        // 5. Check for 'marketing-assets' bucket
        supabase.storage.from('marketing-assets').list('', { limit: 1 }).then(({ error }) => {
            if (error && error.message.toLowerCase().includes('bucket not found')) {
                errors.push('O repositório (bucket) "marketing-assets" (Marketing) não foi encontrado.');
            }
        }),

        // 6. Check for 'support_tickets' table
        supabase.from('support_tickets').select('id', { count: 'exact', head: true }).then(({ error }) => {
          if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes("does not exist") || error.message.includes("schema cache"))) {
              errors.push('A tabela "support_tickets" não foi encontrada.');
          }
        }),
        
        // 7. Check for 'reports' table
        supabase.from('reports').select('id', { count: 'exact', head: true }).then(({ error }) => {
          if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes("does not exist") || error.message.includes("schema cache"))) {
              errors.push('A tabela "reports" não foi encontrada.');
          }
        }),

        // 8. Check for 'face_verifications' table
        supabase.from('face_verifications').select('id', { count: 'exact', head: true }).then(({ error }) => {
            if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes("does not exist") || error.message.includes("schema cache"))) {
                errors.push('A tabela "face_verifications" não foi encontrada.');
            }
        }),

        // 9. Check for 'tags' table
        supabase.from('tags').select('id', { count: 'exact', head: true }).then(({ error }) => {
            if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes("does not exist") || error.message.includes("schema cache"))) {
                errors.push('A tabela "tags" não foi encontrada.');
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
        <p className="mt-4 text-slate-600 font-semibold">Verificando estrutura de dados...</p>
      </div>
    );
  }

  if (setupErrors.length > 0) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-red-50 text-center p-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-red-700">Configuração Pendente</h1>
          <div className="mt-6 text-left bg-white p-6 rounded-lg shadow-md border border-red-200">
            <p className="font-bold text-slate-800 mb-2">Execute os comandos SQL no Supabase para habilitar todas as funções:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-700 mb-4 text-sm">
              {setupErrors.map((err, index) => <li key={index}>{err}</li>)}
            </ul>
            <div className="text-sm text-slate-600 border-t pt-4 space-y-1">
              <p>1. Crie a tabela <strong>tags</strong> (id, category, name, emoji, created_at).</p>
              <p>2. Crie a tabela <strong>campaigns</strong> e o bucket <strong>marketing-assets</strong>.</p>
              <p>3. Crie a tabela <strong>face_verifications</strong>.</p>
            </div>
          </div>
           <button 
             onClick={() => window.location.reload()}
             className="mt-6 bg-sky-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-sky-700 transition-all"
           >
             Já configurei, atualizar agora
           </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};