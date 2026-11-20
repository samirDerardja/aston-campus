import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, Download, TrendingUp, CheckCircle2, Clock, 
  Users, AlertTriangle, GraduationCap, ShieldCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

export const ReportingPage: React.FC = () => {
  const { actions, interviews, promotions, students } = useApp();
  const [selectedPromo, setSelectedPromo] = useState<string>('all');

  const filteredActions = selectedPromo === 'all'
    ? actions
    : actions.filter(a => a.promotionId === selectedPromo);

  const filteredInterviews = selectedPromo === 'all'
    ? interviews
    : interviews.filter(i => i.promotionId === selectedPromo);

  const filteredStudents = selectedPromo === 'all'
    ? students
    : students.filter(s => s.promotionId === selectedPromo);

  // Indicateurs globaux calculés dynamiquement
  const now = new Date();
  const completedActions = filteredActions.filter(a => a.status === 'completed').length;
  const overdueActions = filteredActions.filter(
    a => a.status !== 'completed' && a.status !== 'cancelled' && new Date(a.dueDate) < now
  ).length;
  const totalActions = filteredActions.length;
  const resolutionRate = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : null;

  const realizedInterviews = filteredInterviews.filter(i => i.status === 'completed').length;
  const totalInterviews = filteredInterviews.length;

  const avgAttendance = filteredStudents.length > 0
    ? Math.round(filteredStudents.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / filteredStudents.length)
    : null;

  // Données par promotion calculées depuis le contexte
  const targetPromotions = selectedPromo === 'all'
    ? promotions
    : promotions.filter(p => p.id === selectedPromo);

  const promoStats = targetPromotions.map(p => {
    const pActions = actions.filter(a => a.promotionId === p.id);
    const pDone = pActions.filter(a => a.status === 'completed').length;
    const pStudents = students.filter(s => s.promotionId === p.id);
    const pAttendance = pStudents.length > 0
      ? Math.round(pStudents.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / pStudents.length)
      : 0;
    return {
      name: p.code || p.name,
      actionsTotal: pActions.length,
      actionsDone: pDone,
      assiduite: pAttendance,
    };
  });

  const handleExportCSV = () => {
    const headers = "Identifiant,Titre,Promotion,Responsable,Priorite,Statut,Echeance\n";
    const rows = filteredActions.map(a => 
      `"${a.id}","${a.title}","${a.promotionName}","${a.assigneeName}","${a.priority}","${a.status}","${a.dueDate}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `rapport_coordination_aston_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Reporting & Indicateurs Pédagogiques
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Synthèse d'accompagnement académique et conformité Qualiopi du campus Aston Informatique
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedPromo}
            onChange={(e) => setSelectedPromo(e.target.value)}
            className="bg-white/80 text-xs text-slate-700 font-semibold px-4 py-2.5 rounded-2xl border border-white/90 shadow-2xs outline-none cursor-pointer"
          >
            <option value="all">Toutes les promotions ({promotions.length})</option>
            {promotions.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center space-x-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-extrabold px-5 py-2.5 rounded-2xl shadow-[0_4px_16px_rgba(15,23,42,0.2)] transition-all hover:scale-102"
          >
            <Download className="w-3.5 h-3.5 text-[#00D084]" />
            <span>Exporter le rapport CSV</span>
          </button>
        </div>
      </div>

      {/* 4 Cartes KPI en verre translucide de luxe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-3xl">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider font-mono">
            <span>RÉSOLUTION ACTIONS</span>
            <div className="w-8 h-8 rounded-xl bg-slate-900/5 text-slate-900 flex items-center justify-center border border-white/80 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-[#00D084]" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">
              {resolutionRate !== null ? `${resolutionRate}%` : '—'}
            </span>
            <p className="text-[11px] text-emerald-600 font-bold mt-1">
              {totalActions > 0
                ? `${completedActions} actions résolues sur ${totalActions}`
                : 'Données insuffisantes'}
            </p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider font-mono">
            <span>ENTRETIENS RÉALISÉS</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center border border-blue-500/20 shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 font-mono">{realizedInterviews}</span>
            <p className="text-[11px] text-slate-400 mt-1">
              {totalInterviews > 0
                ? `Sur ${totalInterviews} entretiens planifiés`
                : 'Données insuffisantes'}
            </p>
          </div>
        </div>

        <div className="glass-card p-5 rounded-3xl">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider font-mono">
            <span>ASSIDUITÉ MOYENNE</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center border border-emerald-500/20 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-[#00D084]" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-emerald-600 font-mono">
              {avgAttendance !== null ? `${avgAttendance}%` : '—'}
            </span>
            <p className="text-[11px] text-slate-400 mt-1">
              {avgAttendance !== null
                ? `Calculé sur ${filteredStudents.length} apprenant(s)`
                : 'Données insuffisantes'}
            </p>
          </div>
        </div>

        <div className="bg-rose-50/70 backdrop-blur-xl p-5 rounded-3xl border border-rose-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-rose-600 font-bold uppercase tracking-wider font-mono">
            <span>ACTIONS EN RETARD</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-[#F43F5E] flex items-center justify-center border border-rose-200 shadow-2xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-[#F43F5E] font-mono">{overdueActions}</span>
            <p className="text-[11px] text-rose-500 font-medium mt-1">À traiter en priorité absolue</p>
          </div>
        </div>
      </div>

      {/* Graphique Barres Recharts en verre translucide */}
      <div className="glass-card rounded-3xl p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Volume d'actions par promotion</h2>
          <p className="text-xs text-slate-500 mt-0.5">Comparatif actions engagées vs actions résolues</p>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={promoStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  borderRadius: '12px', 
                  border: 'none', 
                  color: '#fff', 
                  fontSize: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.2)' 
                }}
              />
              <Bar dataKey="actionsTotal" name="Actions engagées" fill="#E2E8F0" radius={[6, 6, 0, 0]} />
              <Bar dataKey="actionsDone" name="Actions résolues" fill="#00D084" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-center space-x-6 pt-2 text-xs font-semibold text-slate-600">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-md bg-[#E2E8F0]"></span>
            <span>Actions engagées</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-md bg-[#00D084]"></span>
            <span>Actions résolues</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingPage;
