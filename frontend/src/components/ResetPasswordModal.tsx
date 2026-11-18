import React, { useState } from 'react';
import { X, Lock, KeyRound, CheckCircle2, AlertCircle, Loader2, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (newPassword.length < 6) {
      setErrorMsg('Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Les deux mots de passe ne correspondent pas.');
      return;
    }

    if (!supabase) {
      setErrorMsg("Supabase n'est pas configuré.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setSuccessMsg('Votre mot de passe a été mis à jour avec succès !');
      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch {}

      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1500);
    } catch (err: any) {
      const raw = err?.message || String(err || '');
      const lower = raw.toLowerCase();

      if (lower.includes('rate limit') || lower.includes('over_email_send_rate_limit')) {
        setErrorMsg('Trop de requêtes en peu de temps. Veuillez patienter quelques minutes avant de réessayer.');
      } else if (lower.includes('same password') || lower.includes('should be different')) {
        setErrorMsg("Le nouveau mot de passe doit être différent de l'ancien.");
      } else if (lower.includes('expired') || lower.includes('invalid') || lower.includes('session')) {
        setErrorMsg("Ce lien de réinitialisation a expiré ou est invalide. Veuillez refaire une demande depuis l'écran de connexion.");
      } else {
        setErrorMsg(raw || 'Impossible de mettre à jour le mot de passe.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-[#0F172A] text-[#00D084] shadow-xs">
              <KeyRound className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Nouveau mot de passe
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            Saisissez votre nouveau mot de passe ci-dessous pour sécuriser votre compte Aston Campus.
          </p>

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

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nouveau mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-800"
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

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Répétez le mot de passe"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold py-2.5 rounded-xl shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4 text-[#00D084]" />}
              <span>{loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;
