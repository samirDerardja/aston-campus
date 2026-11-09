import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('coordinateur');
  const [email, setEmail] = useState('marc.lefevre@aston-campus.demo');
  const [password, setPassword] = useState('••••••••••••');

  const demoAccounts = [
    { role: 'coordinateur' as UserRole, name: 'Marc Lefèvre', title: 'Coordinateur Pédagogique', email: 'marc.lefevre@aston-campus.demo' },
    { role: 'direction' as UserRole, name: 'Claire Dubois', title: 'Direction Pédagogique', email: 'claire.dubois@aston-campus.demo' },
    { role: 'formateur' as UserRole, name: 'Thomas Moreau', title: 'Formateur Référent', email: 'thomas.moreau@aston-campus.demo' },
    { role: 'admin_technique' as UserRole, name: 'Alexandre Admin', title: 'Admin Technique', email: 'admin@aston-campus.demo' },
  ];

  const handleSelectDemo = (acc: typeof demoAccounts[0]) => {
    setSelectedRole(acc.role);
    setEmail(acc.email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(selectedRole);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
        <div className="p-8 text-center border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-xl mx-auto shadow-md mb-3">
            A
          </div>
          <h1 className="text-xl font-bold text-slate-900">Aston Campus</h1>
          <p className="text-xs text-slate-500 mt-1">Plateforme interne de coordination pédagogique</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Adresse email professionnelle</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Mot de passe</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="text-xs font-semibold text-slate-700 block mb-2">
              Comptes de test (Environnement de démonstration)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map(acc => (
                <button
                  type="button"
                  key={acc.role}
                  onClick={() => handleSelectDemo(acc)}
                  className={`p-2 rounded-lg border text-left text-[11px] transition ${
                    selectedRole === acc.role
                      ? 'border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <span className="block font-bold">{acc.name}</span>
                  <span className="text-[10px] text-slate-400">{acc.title}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm transition flex items-center justify-center space-x-2"
          >
            <span>Se connecter à Aston Campus</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Aston Informatique • Connexion sécurisée Supabase Auth & Audit RBAC
        </div>
      </div>
    </div>
  );
};

