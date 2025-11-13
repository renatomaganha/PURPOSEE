import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { XIcon } from '../../components/icons/XIcon';
import { ArrowRightOnRectangleIcon } from '../icons/ArrowRightOnRectangleIcon';

interface AdminLoginModalProps {
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const ADMIN_EMAIL = 'renat0maganhaaa@gmail.com';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) {
            setError('Credenciais inválidas. Tente novamente.');
            setLoading(false);
            return;
        }

        if (data.user && data.user.email?.toLowerCase() === ADMIN_EMAIL) {
            // A mudança de estado será capturada pelo listener no AdminApp.tsx
            onLoginSuccess();
        } else {
            // Se o usuário está autenticado mas não é o admin, desconecta-o imediatamente.
            await supabase.auth.signOut();
            setError('Acesso negado. Esta conta não tem permissões de administrador.');
        }

        setLoading(false);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-slate-800 relative"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-center mb-6">Login de Administrador</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-600" htmlFor="email">E-mail</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="seu.email@exemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full mt-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-600" htmlFor="password">Senha</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full mt-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-6 bg-sky-600 text-white font-bold py-3 rounded-md hover:bg-sky-700 transition-colors disabled:bg-sky-400 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-t-white border-white/50 rounded-full animate-spin"></div>
                        ) : (
                            <>
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                Entrar
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
