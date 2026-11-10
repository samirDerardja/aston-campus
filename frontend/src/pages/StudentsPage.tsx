import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Search, Filter, Briefcase, GraduationCap, ChevronRight,
  TrendingUp, Building2, CheckCircle2, AlertTriangle, ShieldCheck
} from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const { students, promotions } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedPromo, setSelectedPromo] = useState('all');

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.companyName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesPromo = selectedPromo === 'all' || s.promotionId === selectedPromo;
    return matchesSearch && matchesPromo;
  });

  const avgAttendance = Math.round(
    students.reduce((acc, s) => acc + s.attendanceRate, 0) / (students.length || 1)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Apprenants en alternance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Suivi individuel des étudiants, contrats entreprises et taux d'assiduité Qualiopi
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3.5 py-1.5 rounded-full bg-[#00D084]/15 text-emerald-800 font-bold border border-[#00D084]/30 backdrop-blur-md shadow-2xs">
            {students.length} alternants sous contrat
          </span>
        </div>
      </div>

      {/* 4 Summary metric strips en verre translucide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-4 rounded-2xl flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-900/5 text-slate-800 flex items-center justify-center shrink-0 border border-white/80 shadow-2xs">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 font-mono tabular-nums">{students.length}</span>
            <p className="text-[11px] text-slate-500 font-medium">Effectif total campus</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-2xs">
            <TrendingUp className="w-5 h-5 text-[#00D084]" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 font-mono tabular-nums">{avgAttendance}%</span>
            <p className="text-[11px] text-slate-500 font-medium">Assiduité moyenne globale</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-500/20 shadow-2xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 font-mono tabular-nums">100%</span>
            <p className="text-[11px] text-slate-500 font-medium">Tuteurs rattachés</p>
          </div>
        </div>

        <div className="glass-card p-4 rounded-2xl flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-black text-slate-900 font-mono tabular-nums">Conforme</span>
            <p className="text-[11px] text-slate-500 font-medium">Registre Qualiopi à jour</p>
          </div>
        </div>
      </div>

      {/* Barre de Recherche & Filtres en verre */}
      <div className="glass-panel p-3.5 rounded-3xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par apprenant, entreprise, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white/70 hover:bg-white focus:bg-white border border-white/90 rounded-2xl outline-none focus:border-slate-800 transition shadow-2xs"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedPromo}
            onChange={(e) => setSelectedPromo(e.target.value)}
            className="text-xs bg-white/80 border border-white/90 rounded-2xl px-3.5 py-2 font-semibold text-slate-700 outline-none focus:border-slate-800 cursor-pointer shadow-2xs hover:bg-white"
          >
            <option value="all">Toutes les promotions</option>
            {promotions.map(p => (
              <option key={p.id} value={p.id}>{p.code} — {p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table des Apprenants en verre translucide */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-white/40 border-b border-white/70 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
            <tr>
              <th className="py-4 px-5">Apprenant</th>
              <th className="py-4 px-5">Promotion</th>
              <th className="py-4 px-5">Entreprise d'accueil</th>
              <th className="py-4 px-5">Tuteur Entreprise</th>
              <th className="py-4 px-5">Assiduité</th>
              <th className="py-4 px-5">Statut</th>
              <th className="py-4 px-5 text-right">Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/50">
            {filteredStudents.map((s) => (
              <tr 
                key={s.id}
                onClick={() => navigate(`/apprenants/${s.id}`)}
                className="hover:bg-white/60 cursor-pointer transition group"
              >
                <td className="py-3.5 px-5">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold text-[10px] font-mono shrink-0 shadow-xs">
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 group-hover:text-emerald-600 transition">
                        {s.firstName} {s.lastName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{s.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-5 text-slate-700 font-mono text-[11px]">{s.promotionName}</td>
                <td className="py-3.5 px-5">
                  <div className="font-bold text-slate-800">{s.companyName}</div>
                  <div className="text-[10px] text-slate-400">Contrat d'alternance</div>
                </td>
                <td className="py-3.5 px-5 text-slate-600 font-medium">{s.companyTutor}</td>
                <td className="py-3.5 px-5 font-mono">
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    s.attendanceRate >= 90 
                      ? 'bg-[#00D084]/15 text-emerald-800 border border-[#00D084]/30' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200/80'
                  }`}>
                    {s.attendanceRate}%
                  </span>
                </td>
                <td className="py-3.5 px-5">
                  <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-mono">
                    {s.status}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right">
                  <span className="text-[#0F172A] font-bold group-hover:text-[#00D084] inline-flex items-center space-x-1 transition">
                    <span>Consulter</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentsPage;
