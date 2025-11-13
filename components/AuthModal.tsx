import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { XIcon } from './icons/XIcon';
import { CheckBadgeIcon } from './icons/CheckBadgeIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { TranslationKeys } from '../lib/translations';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';

interface AuthModalProps {
  onClose: () => void;
}

type AuthView = 'sign_in' | 'sign_up' | 'forgot_password' | 'forgot_password_success' | 'signup_success';

// Função para traduzir erros comuns do Supabase para chaves de tradução
const translateSupabaseError = (message: string): TranslationKeys => {
  const lowerCaseMessage = message.toLowerCase();

  if (lowerCaseMessage.includes('user already registered')) {
    return 'errorUserAlreadyRegistered';
  }
  if (lowerCaseMessage.includes('email not confirmed')) {
    return 'errorEmailNotConfirmed';
  }
  if (lowerCaseMessage.includes('invalid login credentials')) {
    return 'errorInvalidLogin';
  }
  if (lowerCaseMessage.includes('invalid format')) {
    return 'errorInvalidEmail';
  }
  if (lowerCaseMessage.includes('weak password')) {
    return 'errorWeakPassword';
  }
  if (lowerCaseMessage.includes('should be at least 6 characters')) {
    return 'errorPasswordTooShort';
  }
  // Fallback para erros não mapeados
  return 'errorUnexpected';
};

export const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const [view, setView] = useState<AuthView>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [showResendLink, setShowResendLink] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { t } = useLanguage();

  const changeView = (newView: AuthView) => {
    setError(null);
    setInfoMessage(null);
    setName('');
    setPassword('');
    setShowResendLink(false);
    setView(newView);
  };

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfoMessage(null);
    setShowResendLink(false);

    let authResponse;
    if (view === 'sign_in') {
      authResponse = await supabase.auth.signInWithPassword({ email, password });
    } else {
      authResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          }
        }
      });
    }

    const { data, error: authError } = authResponse;

    if (authError) {
      const errorKey = translateSupabaseError(authError.message);
      setError(t(errorKey));
      if (errorKey === 'errorEmailNotConfirmed') {
        setShowResendLink(true);
      }
    } else {
      // Se a sessão for criada, o login/cadastro foi bem-sucedido.
      // O listener onAuthStateChange no AuthContext irá detectar a mudança 
      // e o componente App.tsx irá redirecionar o usuário.
      // Não precisamos fazer nada aqui, o modal será desmontado automaticamente.
      if (data.session) {
        // A CONEXÃO FOI BEM-SUCEDIDA. NÃO FAÇA NADA AQUI.
      }
      // Se foi um cadastro e NÃO há sessão, a confirmação por e-mail é necessária.
      else if (view === 'sign_up' && data.user && !data.session) {
        changeView('signup_success');
      }
    }
    setLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setInfoMessage(null);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });

    if (resetError) {
      setError(t(translateSupabaseError(resetError.message)));
    } else {
      setInfoMessage(t('passwordResetSent'));
      changeView('forgot_password_success');
    }
    setLoading(false);
  };

  const handleResendVerification = async () => {
    setIsResending(true);
    setError(null);
    setInfoMessage(null);

    const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
    });

    if (resendError) {
        setError(t('errorUnexpected'));
    } else {
        setInfoMessage(t('resendVerificationSuccess'));
        setShowResendLink(false); // Esconde o link após o reenvio para evitar spam
    }
    setIsResending(false);
  };
  
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowResendLink(false);
    setError(null);
    setEmail(e.target.value);
  }
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowResendLink(false);
    setError(null);
    setPassword(e.target.value);
  }

  const renderContent = () => {
    switch(view) {
      case 'signup_success':
        return (
          <div className="text-center">
            <CheckBadgeIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-center mb-2">{t('signupSuccessTitle')}</h2>
            <p className="text-sm text-slate-600 mb-6">{t('signupSuccessMessage')}</p>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-sky-600 text-white font-bold py-3 rounded-md hover:bg-sky-700 transition-colors"
            >
              {t('close')}
            </button>
          </div>
        );
      case 'forgot_password':
        return (
          <form onSubmit={handlePasswordReset}>
            <h2 className="text-2xl font-bold text-center mb-2">{t('recoverPassword')}</h2>
            <p className="text-sm text-center text-slate-600 mb-6">
              {t('recoverPasswordDesc')}
            </p>
            <div>
              <label className="text-sm font-semibold text-slate-600" htmlFor="email">{t('emailLabel')}</label>
              <input
                type="email"
                id="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={handleEmailChange}
                className="w-full mt-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none"
                required
              />
            </div>
            {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-sky-600 text-white font-bold py-3 rounded-md hover:bg-sky-700 transition-colors disabled:bg-sky-400"
            >
              {loading ? <div className="w-5 h-5 border-2 border-t-white border-white/50 rounded-full animate-spin mx-auto"></div> : t('sendLink')}
            </button>
            <div className="text-center mt-4">
              <button type="button" onClick={() => changeView('sign_in')} className="text-sm font-semibold text-sky-600 hover:underline">
                {t('backToLogin')}
              </button>
            </div>
          </form>
        );
      case 'forgot_password_success':
        return (
          <div className="text-center">
            <CheckBadgeIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-center mb-2">{t('checkYourEmail')}</h2>
            <p className="text-sm text-slate-600 mb-6">{infoMessage}</p>
            <button
              type="button"
              onClick={() => changeView('sign_in')}
              className="w-full bg-sky-600 text-white font-bold py-3 rounded-md hover:bg-sky-700 transition-colors"
            >
              {t('backToLogin')}
            </button>
          </div>
        );
      default:
        return (
          <>
            <div className="flex border-b border-slate-200 mb-6">
              <button onClick={() => changeView('sign_in')} className={`flex-1 pb-3 font-bold text-center ${view === 'sign_in' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-500'}`}>
                {t('signIn')}
              </button>
              <button onClick={() => changeView('sign_up')} className={`flex-1 pb-3 font-bold text-center ${view === 'sign_up' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-500'}`}>
                {t('signUp')}
              </button>
            </div>
            <form onSubmit={handleAuthAction}>
              <div className="space-y-4">
                {view === 'sign_up' && (
                  <div>
                    <label className="text-sm font-semibold text-slate-600" htmlFor="name">{t('nameLabel')}</label>
                    <input type="text" id="name" placeholder={t('yourNamePlaceholder')} value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none" required />
                  </div>
                )}
                <div>
                  <label className="text-sm font-semibold text-slate-600" htmlFor="email">{t('emailLabel')}</label>
                  <input type="email" id="email" placeholder="seu.email@exemplo.com" value={email} onChange={handleEmailChange} className="w-full mt-1 p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none" required />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-600" htmlFor="password">{t('passwordLabel')}</label>
                  <div className="relative mt-1">
                    <input
                      type={isPasswordVisible ? 'text' : 'password'}
                      id="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={handlePasswordChange}
                      className="w-full p-2 pr-10 border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                      aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {isPasswordVisible ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {view === 'sign_in' && (
                    <div className="text-right mt-2">
                      <button type="button" onClick={() => changeView('forgot_password')} className="text-sm font-semibold text-sky-600 hover:underline">
                        {t('forgotPassword')}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {infoMessage && <p className="mt-4 text-sm text-green-600 text-center">{infoMessage}</p>}
              {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
              {showResendLink && (
                  <div className="text-center mt-2">
                      <button 
                        type="button" 
                        onClick={handleResendVerification} 
                        disabled={isResending} 
                        className="text-sm font-semibold text-sky-600 hover:underline disabled:text-slate-400"
                      >
                          {isResending ? (t('sending') + '...') : t('resendVerificationEmail')}
                      </button>
                  </div>
              )}

              <button type="submit" disabled={loading} className="w-full mt-6 bg-sky-600 text-white font-bold py-3 rounded-md hover:bg-sky-700 transition-colors disabled:bg-sky-400">
                {loading ? <div className="w-5 h-5 border-2 border-t-white border-white/50 rounded-full animate-spin mx-auto"></div> : view === 'sign_in' ? t('signIn') : t('signUp')}
              </button>
            </form>
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8 text-slate-800 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <XIcon className="w-6 h-6" />
        </button>
        {renderContent()}
      </div>
    </div>
  );
};