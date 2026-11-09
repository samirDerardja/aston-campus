import React from 'react';
import { 
  GraduationCap, Users, UserCheck, AlertTriangle, Calendar, 
  CheckCircle2, Clock, ArrowRight, ShieldAlert, Sparkles, Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const DashboardPage: React.FC = () => {
  const { promotions, students, trainers, actions, interviews, events, currentUser } = useApp();
  const navigate = useNavigate();

  // Métriques
  const activePromos = promotions.filter(p => p.status === 'active');
  const overdueActions = actions.filter(
    a => a.status !== 'completed' && a.status !== 'cancelled' && new Date(a.dueDate) < new Date()
  );
  const completedActions = actions.filter(a => a.status === 'completed');
  const upcomingInterviews = interviews.filter(i => i.status === 'scheduled');

  // Données Graphique Répartition Actions
  const actionCounts = {
    todo: actions.filter(a => a.status === 'todo').length,
    in_progress: actions.filter(a => a.status === 'in_progress').length,
    waiting: actions.filter(a => a.status === 'waiting').length,
    completed: actions.filter(a => a.status === 'completed').length,
  };

  const chartData = [
    { name: 'À faire', value: actionCounts.todo, color: '#94A3B8' },
    { name: 'En cours', value: actionCounts.in_progress, color: '#635BFF' },
    { name: 'En attente', value: actionCounts.waiting, color: '#F79009' },
    { name: 'Terminées', value: actionCounts.completed, color: '#12B76A' },
  ];

  return (
    <div className="space-y-6">
      {/* Alerte contextuelle si actions en retard */}
      {overdueActions.length > 0 && (
        <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-900">
                {overdueActions.length} action{overdueActions.length > 1 ? 's' : ''} en retard nécessite{overdueActions.length > 1 ? 'nt' : ''} votre attention
              </p>
              <p className="text-xs text-rose-700">
                Notamment : "{overdueActions[0].title}" (Échéance dépassée le {overdueActions[0].dueDate})
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/actions')}
            className="text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg transition"
          >
            Résoudre l'action
          </button>
        </div>
      )}

      {/* Cartes Statistiques Principales (Cliquables vers listes filtrées) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <div 
          onClick={() => navigate('/promotions')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-subtle cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Promotions actives</span>
            <GraduationCap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{activePromos.length}</div>
          <span className="text-[11px] text-slate-400 font-medium">sur {promotions.length} au total</span>
        </div>

        <div 
          onClick={() => navigate('/apprenants')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-subtle cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Apprenants suivis</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{students.length}</div>
          <span className="text-[11px] text-slate-400 font-medium">100% en alternance</span>
        </div>

        <div 
          onClick={() => navigate('/formateurs')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-subtle cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Formateurs actifs</span>
            <UserCheck className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{trainers.length}</div>
          <span className="text-[11px] text-slate-400 font-medium">Référents & intervenants</span>
        </div>

        <div 
          onClick={() => navigate('/actions')}
          className={`bg-white p-4 rounded-xl border shadow-xs cursor-pointer transition ${
            overdueActions.length > 0 ? 'border-rose-300 hover:border-rose-500' : 'border-slate-200 hover:border-indigo-400'
          }`}
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Actions en retard</span>
            <Clock className={`w-4 h-4 ${overdueActions.length > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
          </div>
          <div className={`text-2xl font-bold ${overdueActions.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {overdueActions.length}
          </div>
          <span className="text-[11px] text-rose-500 font-medium">Priorité immédiate</span>
        </div>

        <div 
          onClick={() => navigate('/entretiens')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-subtle cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Entretiens prévus</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{upcomingInterviews.length}</div>
          <span className="text-[11px] text-slate-400 font-medium">Cette semaine</span>
        </div>

        <div 
          onClick={() => navigate('/actions')}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-subtle cursor-pointer transition"
        >
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Actions clôturées</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{completedActions.length}</div>
          <span className="text-[11px] text-slate-400 font-medium">Résolues avec succès</span>
        </div>
      </div>

      {/* Sections Principales : Priorités & Graphique de Suivi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mes priorités (2 colonnes) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Mes priorités de coordination</h2>
              <p className="text-xs text-slate-500">Actions urgentes, entretiens imminents et arbitrages en attente</p>
            </div>
            <button
              onClick={() => navigate('/actions')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1"
            >
              <span>Voir tout le Kanban</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {actions.filter(a => a.status !== 'completed' && a.status !== 'cancelled').slice(0, 4).map((action) => {
              const isOverdue = new Date(action.dueDate) < new Date();
              return (
                <div
                  key={action.id}
                  onClick={() => navigate('/actions')}
                  className={`p-3.5 rounded-lg border transition cursor-pointer flex items-center justify-between ${
                    isOverdue 
                      ? 'border-rose-200 bg-rose-50/40 hover:bg-rose-50' 
                      : 'border-slate-100 bg-slate-50/60 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="space-y-1 min-w-0 pr-3">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                        action.priority === 'urgent' ? 'bg-rose-100 text-rose-700 font-bold' :
                        action.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {action.priority}
                      </span>
                      <span className="text-xs font-semibold text-slate-900 truncate">{action.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{action.description}</p>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                      <span>Promo : {action.promotionName}</span>
                      <span>•</span>
                      <span>Assigné à : {action.assigneeName}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-xs font-medium block ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                      {isOverdue ? 'En retard (' + action.dueDate + ')' : 'Pour le ' + action.dueDate}
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider capitalize">
                      {action.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suivi des Actions (Donut Chart) */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-1">Répartition des actions</h2>
            <p className="text-xs text-slate-500 mb-4">Statuts des plans correctifs en cours</p>
            
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600 font-medium">{item.name} :</span>
                <span className="font-bold text-slate-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Événements à venir & Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Événements à venir */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Prochains rendez-vous pédagogiques</h2>
              <p className="text-xs text-slate-500">Séances Nevea, entretiens locaux et réunions de synchronisation</p>
            </div>
            <button
              onClick={() => navigate('/planning')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1"
            >
              <span>Consulter le planning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {events.slice(0, 3).map((evt) => (
              <div
                key={evt.id}
                onClick={() => navigate('/planning')}
                className="p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition cursor-pointer flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    {evt.isReadonly && (
                      <span className="text-[9px] font-bold bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded border border-sky-200">
                        NEVEA
                      </span>
                    )}
                    <span className="text-xs font-semibold text-slate-900">{evt.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{evt.promotionName} {evt.room && `• ${evt.room}`}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-slate-700 block">
                    {new Date(evt.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(evt.startTime).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dernières activités */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Activité récente & Traçabilité</h2>
              <p className="text-xs text-slate-500">Journal des synchronisations et comptes rendus enregistrés</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start space-x-3 p-2.5 rounded-lg bg-slate-50">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <div>
                <p className="font-semibold text-slate-900">Compte rendu d'entretien finalisé</p>
                <p className="text-slate-500 text-[11px]">Bilan semestriel enregistré pour Alexandre Martin (Promo TSRS).</p>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Il y a 3 heures • Marc Lefèvre</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2.5 rounded-lg bg-slate-50">
              <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
              <div>
                <p className="font-semibold text-slate-900">Décision convertie en action corrective</p>
                <p className="text-slate-500 text-[11px]">Action "Aménagement partiels blancs" générée depuis le comité TSRS.</p>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Hier à 17:30 • Marc Lefèvre</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2.5 rounded-lg bg-slate-50">
              <span className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
              <div>
                <p className="font-semibold text-slate-900">Passerelle Nevea prête</p>
                <p className="text-slate-500 text-[11px]">Assistant d'import CSV opérationnel pour le chargement des effectifs.</p>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">Système vérifié</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
