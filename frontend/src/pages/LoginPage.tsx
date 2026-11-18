import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

type AuthMode = 'signin' | 'signup' | 'forgot-password';

export const LoginPage: React.FC = () => {
  const { login, refreshAuthSession } = useApp();
  const navigate = useNavigate();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('samirderardja10@gmail.com');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleQuickDemoAccess = () => {
    login('coordinateur');
    navigate('/');
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg(
        "Supabase n'est pas encore configuré. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY."
      );
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err?.message || "Impossible d'initialiser la connexion avec Google.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg(
        "Supabase n'est pas encore configuré. Renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY."
      );
      return;
    }

    if (!email.trim()) {
      setErrorMsg('Veuillez renseigner une adresse email valide.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'forgot-password') {
        let sent = false;
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
            redirectTo: `${window.location.origin}/?reset_password=true`,
          });
          if (error) throw error;
          sent = true;
          setSuccessMsg(
            'Email envoyé ! Cliquez sur le lien reçu dans votre messagerie pour réinitialiser votre mot de passe.'
          );
        } catch (supaErr: any) {
          const supaMsg = String(supaErr?.message || supaErr || '').toLowerCase();
          if (supaMsg.includes('error sending recovery email') || supaErr?.status === 500) {
            try {
              const res = await fetch(`${apiBase}/auth/request-password-reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim() }),
              });
              const data = await res.json();
              if (res.ok && data.success) {
                if (data.recoveryUrl) {
                  setSuccessMsg('Lien de récupération généré avec succès ! Redirection en cours...');
                  setTimeout(() => {
                    window.location.href = data.recoveryUrl;
                  }, 1200);
                  return;
                }
                setSuccessMsg('Email de réinitialisation envoyé avec succès via le serveur de secours !');
                sent = true;
                return;
              }
            } catch {}
          }
          if (!sent) throw supaErr;
        }
      } else if (mode === 'signup') {
        const cleanFullName = fullName.trim();
        const cleanEmail = email.trim();

        if (!cleanFullName || cleanFullName.length < 2) {
          throw new Error("Veuillez renseigner un nom complet d'au moins 2 caractères.");
        }
        if (password.length < 6) {
          throw new Error('Le mot de passe doit contenir au moins 6 caractères.');
        }

        // Vérification anti-doublons auprès du serveur
        try {
          const checkRes = await fetch(`${apiBase}/auth/check-availability`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: cleanEmail, username: cleanFullName }),
          });
          const checkData = await checkRes.json();
          if (checkRes.ok && !checkData.available) {
            throw new Error(checkData.error || "Cet email ou nom d'utilisateur est déjà utilisé.");
          }
        } catch (checkErr: any) {
          if (checkErr.message && !checkErr.message.includes('fetch')) {
            throw checkErr;
          }
        }

        const { error, data } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: { full_name: cleanFullName },
          },
        });
        if (error) throw error;

        if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
          throw new Error("Un compte existe déjà avec cette adresse email. Choisissez l'onglet Connexion.");
        }

        if (data.session) {
          setSuccessMsg('Compte créé et session active !');
          await refreshAuthSession();
          navigate('/');
        } else {
          setSuccessMsg('Compte créé ! Veuillez vérifier votre boîte email pour valider votre inscription.');
        }
      } else {
        // Connexion classique Email + Mot de passe
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        setSuccessMsg('Connexion réussie !');
        await refreshAuthSession();
        navigate('/');
      }
    } catch (err: any) {
      const raw = err?.message || err?.error_description || String(err || '');
      const lower = raw.toLowerCase();

      if (lower.includes('rate limit') || lower.includes('over_email_send_rate_limit')) {
        setErrorMsg(
          "Trop de demandes d'envoi d'email en peu de temps (limite anti-spam). Veuillez patienter quelques minutes avant de renouveler votre demande."
        );
      } else if (
        lower.includes('invalid login credentials') ||
        lower.includes('invalid_grant') ||
        lower.includes('invalid_credentials')
      ) {
        setErrorMsg("Adresse email ou mot de passe incorrect. Vérifiez vos identifiants ou cliquez sur 'Mot de passe oublié ?'.");
      } else if (lower.includes('email not confirmed')) {
        setErrorMsg("Votre adresse email n'a pas encore été validée. Consultez votre boîte de réception.");
      } else if (lower.includes('user already registered') || lower.includes('already exists')) {
        setErrorMsg("Un compte existe déjà avec cette adresse email. Choisissez l'onglet Connexion.");
      } else if (lower.includes('password should be at least')) {
        setErrorMsg('Le mot de passe doit comporter au moins 6 caractères.');
      } else if (lower.includes('user not found')) {
        setErrorMsg('Aucun compte trouvé avec cette adresse email.');
      } else if (
        lower.includes('error sending recovery email') ||
        lower.includes('smtp_config_required') ||
        err?.status === 500
      ) {
        setErrorMsg(
          "Impossible d'envoyer l'email de récupération (erreur 500 SMTP Supabase). Vérifiez les paramètres SMTP dans le Dashboard Supabase."
        );
      } else {
        setErrorMsg(raw || "Une erreur est survenue lors de l'authentification.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F8F9FB] flex items-center justify-center p-4 overflow-hidden font-sans">
      {/* Ambient Background Gradients Glassmorphism V2 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#00D084]/15 blur-3xl opacity-75"></div>
        <div className="absolute -top-40 right-10 w-[500px] h-[500px] rounded-full bg-indigo-500/12 blur-3xl opacity-70"></div>
        <div className="absolute bottom-10 left-1/3 w-[600px] h-[400px] rounded-full bg-emerald-400/10 blur-3xl opacity-60"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-white/85 backdrop-blur-2xl rounded-3xl shadow-[0_24px_60px_rgba(15,23,42,0.12)] overflow-hidden border border-white">
        {/* Header Aston Campus */}
        <div className="p-6 text-center border-b border-slate-100/80 bg-gradient-to-b from-white/90 to-slate-50/50">
          <div className="w-12 h-12 rounded-2xl bg-[#0F172A] flex items-center justify-center text-[#00D084] font-black text-xl mx-auto shadow-md mb-3">
            A
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Aston Campus</h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D084] animate-pulse" />
              SSL
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {mode === 'signup'
              ? 'Créez votre compte coordination Aston Campus'
              : mode === 'forgot-password'
              ? 'Réinitialisation de votre mot de passe'
              : 'Plateforme interne de coordination pédagogique'}
          </p>

          {/* Onglets de flux d'authentification */}
          <div className="mt-4 grid grid-cols-2 gap-1 p-1 bg-slate-100/80 rounded-2xl text-[11px] font-bold">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`py-2 rounded-xl transition ${
                mode === 'signin'
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`py-2 rounded-xl transition ${
                mode === 'signup'
                  ? 'bg-[#0F172A] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inscription
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00D084] mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Nom complet</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ex: Samir Derardja"
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Adresse email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="samirderardja10@gmail.com"
                className="w-full pl-10 pr-3 py-2.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
              />
            </div>
          </div>

          {(mode === 'signin' || mode === 'signup') && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">Mot de passe</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => switchMode('forgot-password')}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Mot de passe oublié ?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-extrabold py-3 rounded-2xl shadow-[0_4px_16px_rgba(15,23,42,0.2)] transition flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#00D084]" />
            ) : (
              <ArrowRight className="w-4 h-4 text-[#00D084]" />
            )}
            <span>
              {loading
                ? 'Traitement en cours...'
                : mode === 'signup'
                ? 'Créer mon compte Aston'
                : mode === 'forgot-password'
                ? 'Envoyer le lien de réinitialisation'
                : 'Se connecter à Aston Campus'}
            </span>
          </button>

          {mode === 'forgot-password' && (
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-900 pt-1"
            >
              ← Retour à la connexion
            </button>
          )}

          {/* Séparateur & Connexion Google OAuth */}
          {(mode === 'signin' || mode === 'signup') && (
            <>
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                  <span className="bg-white/90 px-2.5 text-slate-400">ou</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center justify-center gap-2 shadow-2xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z" />
                  <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z" />
                </svg>
                <span>Continuer avec Google</span>
              </button>
            </>
          )}

          {/* Identifiant principal Aston Campus */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00D084]" />
              <span>Samir Derardja</span>
            </span>
            <button
              type="button"
              onClick={handleQuickDemoAccess}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline"
            >
              Accès rapide démo →
            </button>
          </div>
        </form>

        <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium">
          Aston Informatique • Authentification sécurisée Supabase Auth & Audit RBAC
        </div>
      </div>
    </div>
  );
};
