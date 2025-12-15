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
      
        // 3. Check for 'messages' table (for chat)
        supabase.from('messages').select('id', { count: 'exact', head: true }).then(({ error }) => {
          if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes("does not exist"))) {
            errors.push('A tabela "messages" para o chat não foi encontrada.');
          }
        }),

        // 3.1 Check for MEDIA columns in 'messages' table
        supabase.from('messages').select('media_url, media_type, is_view_once, viewed_at').limit(1).then(({ error }) => {
            if (error && (error.code === '42703' || error.message.includes("column") || error.message.includes("does not exist"))) {
                errors.push('As colunas de mídia (media_url, media_type) não existem na tabela "messages". Execute o script de atualização.');
            }
        }),

        // 4. Check for 'support_tickets' table
        supabase.from('support_tickets').select('id', { count: 'exact', head: true }).then(({ error }) => {
          if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes("does not exist"))) {
              errors.push('A tabela "support_tickets" não foi encontrada.');
          }
        }),
        
        // 5. Check for 'branding' table
        supabase.from('branding').select('id', { count: 'exact', head: true }).then(({ error }) => {
          if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes("does not exist"))) {
              errors.push('A tabela "branding" para o logotipo não foi encontrada.');
          }
        }),
        
        // 6. Check for 'branding-assets' bucket
        supabase.storage.from('branding-assets').list('', { limit: 1 }).then(({ error }) => {
          if (error && error.message.toLowerCase().includes('bucket not found')) {
            errors.push('O repositório (bucket) "branding-assets" não foi encontrado.');
          }
        }),

        // 7. Check for 'reports' table
        supabase.from('reports').select('id', { count: 'exact', head: true }).then(({ error }) => {
          if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes("does not exist"))) {
              errors.push('A tabela "reports" para denúncias não foi encontrada.');
          }
        }),

        // 8. Check for 'report-evidence' bucket
        supabase.storage.from('report-evidence').list('', { limit: 1 }).then(({ error }) => {
            if (error && error.message.toLowerCase().includes('bucket not found')) {
                errors.push('O repositório (bucket) "report-evidence" não foi encontrado.');
            }
        }),

        // 9. Check for 'face_verifications' table
        supabase.from('face_verifications').select('id', { count: 'exact', head: true }).then(({ error }) => {
            if (error && (error.code === '42P01' || error.code === 'PGRST205' || error.message.includes("does not exist"))) {
                errors.push('A tabela "face_verifications" não foi encontrada.');
            }
        }),

        // 10. Check for 'face-verifications' bucket
        supabase.storage.from('face-verifications').list('', { limit: 1 }).then(({ error }) => {
            if (error && error.message.toLowerCase().includes('bucket not found')) {
                errors.push('O repositório (bucket) "face-verifications" não foi encontrado.');
            }
        }),

        // 11. Check for 'chat-media' bucket
        supabase.storage.from('chat-media').list('', { limit: 1 }).then(({ error }) => {
            if (error && error.message.toLowerCase().includes('bucket not found')) {
                errors.push('O repositório (bucket) "chat-media" não foi encontrado.');
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
          <h1 className="text-3xl font-bold text-red-700">Erro de Configuração do Supabase</h1>
          <p className="mt-4 text-red-600">
            Detectamos problemas na estrutura do seu banco de dados.
          </p>

          <div className="mt-6 text-left bg-white p-6 rounded-lg shadow-md border border-red-200">
            <h2 className="text-lg font-bold text-slate-800 mb-3">Problemas Encontrados:</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-700 mb-4">
              {setupErrors.map((err, index) => <li key={index}>{err}</li>)}
            </ul>
            
            <div className="mt-6 border-t pt-4">
                <h2 className="text-lg font-bold text-slate-800 mb-3">Como Corrigir:</h2>
                 <p className="text-sm text-slate-600 mb-4">
                   Encontre o arquivo <code className="bg-slate-200 px-1 rounded text-red-700 font-bold">supabase_media_update.sql</code> na lista de arquivos, copie o conteúdo e execute no <strong>SQL Editor</strong> do seu painel Supabase.
                 </p>
                 <p className="text-sm text-slate-600">
                    Se for a primeira vez instalando, use o <code className="bg-slate-200 px-1 rounded text-red-700">supabase_setup.sql</code>.
                 </p>
            </div>
          </div>
           <p className="mt-6 text-sm text-slate-500">Após executar o script no Supabase, <strong className="text-slate-700">atualize esta página</strong>.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};