import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart3, Download, TrendingUp, CheckCircle, Clock, Users, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ReportingPage: React.FC = () => {
  const { actions, interviews, promotions, students } = useApp();

  // Indicateurs globaux
  const completedActions = actions.filter(a => a.status === 'completed').length;
  const inProgressActions = actions.filter(a => a.status === 'in_progress').length;
  const overdueActions = actions.filter(
    a => a.status !== 'completed' && a.status !== 'cancelled' && new Date(a.dueDate) < new Date()
  ).length;

  const resolutionRate = actions.length > 0 ? Math.round((completedActions / actions.length) * 100) : 0;

  // Données par promotion
  const promoStats = promotions.map(p => {
    const promoActions = actions.filter(a => a.promotionId === p.id);
    const promoDone = promoActions.filter(a => a.status === 'completed').length;
    return {
      name: p.code,
      actionsTotal: promoActions.length,
      actionsDone: promoDone,
    };
  });

  const handleExportCSV = () => {
    const headers = "Identifiant,Titre,Promotion,Responsable,Priorite,Statut,Echeance\n";
    const rows = actions.map(a => 
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
    <div className="space-y-6">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Reporting & Indicateurs</h1>
          <p className="text-xs text-slate-500">
            Synthèse globale de la coordination pédagogique (sans évaluation ni scoring individuel)
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center space-x-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Exporter le rapport CSV</span>
        </button>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Taux de résolution des actions</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block">{resolutionRate}%</span>
          <span className="text-[11px] text-emerald-600 font-medium">{completedActions} actions résolues</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Entretiens d'accompagnement</span>
          <span className="text-2xl font-bold text-indigo-600 mt-1 block">{interviews.length}</span>
          <span className="text-[11px] text-slate-400">Total réalisés & planifiés</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Actions actives en cours</span>
          <span className="text-2xl font-bold text-amber-600 mt-1 block">{inProgressActions}</span>
          <span className="text-[11px] text-slate-400">Suivi actif</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Actions en retard</span>
          <span className={`text-2xl font-bold mt-1 block ${overdueActions > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {overdueActions}
          </span>
          <span className="text-[11px] text-rose-500 font-medium">Priorité de relance</span>
        </div>
      </div>

      {/* Graphique Barres */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 mb-1">Volume d'actions par promotion</h2>
        <p className="text-xs text-slate-500 mb-6">Comparatif actions engagées vs actions clôturées</p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={promoStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="actionsTotal" name="Actions totales" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actionsDone" name="Actions résolues" fill="#635BFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

