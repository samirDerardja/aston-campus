import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Users, UserCheck, AlertTriangle, ArrowRight,
  Clock, Calendar, CheckCircle2, ChevronRight, MessageSquare,
  Sparkles, ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip 
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Donut chart data: 28 actions au total (luxury color palette: Emerald, Dark Slate, Rose, Pearl)
  const actionStatusData = [
    { name: 'En cours', value: 14, color: '#0F172A' },
    { name: 'À faire', value: 7, color: '#00D084' },
    { name: 'En retard', value: 7, color: '#F43F5E' },
    { name: 'Clôturées', value: 0, color: '#CBD5E1' },
  ];

  const appointments = [
    {
      id: 'apt-1',
      title: 'Synchronisation Dev Web',
      time: 'Demain • 14:00',
      type: 'sync',
      badge: 'Réunion d\'équipe',
      color: 'bg-slate-900/5 text-slate-800 border-slate-200/80',
    },
    {
      id: 'apt-2',
      title: 'Entretien individuel (Thomas Dubois)',
      time: '13 nov. • 10:00',
      type: 'interview',
      badge: 'Point pédagogique',
      color: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20',
    },
    {
      id: 'apt-3',
      title: 'Réunion pédagogique formateurs',
      time: '14 nov. • 09:30',
      type: 'meeting',
      badge: 'Conseil pédagogique',
      color: 'bg-indigo-500/10 text-indigo-800 border-indigo-500/20',
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. En-tête de bienvenue avec style luxe */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bonjour Samir 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Voici la situation pédagogique du campus Aston Informatique
          </p>
        </div>

        {/* Date badge en verre translucide */}
        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-[#00D084]" />
            <span>Mer. 11 nov. 2026</span>
          </div>
        </div>
      </div>

      {/* 2. 4 cartes statistiques en ligne avec glassmorphism translucide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Carte 1 : Promotions */}
        <div 
          onClick={() => navigate('/promotions')}
          className="glass-card p-5 rounded-2xl cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider font-mono">
            <span>PROMOTIONS</span>
            <div className="w-9 h-9 rounded-xl bg-slate-900/5 group-hover:bg-[#0F172A] text-slate-700 group-hover:text-white flex items-center justify-center transition-colors border border-white/80 shadow-2xs">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              5
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Cohortes actives en formation</p>
          </div>
        </div>

        {/* Carte 2 : Apprenants (+4) */}
        <div 
          onClick={() => navigate('/apprenants')}
          className="glass-card p-5 rounded-2xl cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider font-mono">
            <span>APPRENANTS</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 group-hover:bg-[#00D084] text-emerald-600 group-hover:text-white flex items-center justify-center transition-colors border border-emerald-500/20 shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              124
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-[#00D084]/15 border border-[#00D084]/30 px-2 py-0.5 rounded-full font-mono backdrop-blur-xs">
              +4
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Inscrits en alternance & initial</p>
        </div>

        {/* Carte 3 : Formateurs (+1) */}
        <div 
          onClick={() => navigate('/formateurs')}
          className="glass-card p-5 rounded-2xl cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider font-mono">
            <span>FORMATEURS</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 group-hover:bg-[#0F172A] text-indigo-600 group-hover:text-white flex items-center justify-center transition-colors border border-indigo-500/20 shadow-2xs">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              18
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-[#00D084]/15 border border-[#00D084]/30 px-2 py-0.5 rounded-full font-mono backdrop-blur-xs">
              +1
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Intervenants & coordinateurs</p>
        </div>

        {/* Carte 4 : Actions en retard (7) en rouge vif sur fond rosé translucide */}
        <div 
          onClick={() => navigate('/actions')}
          className="bg-rose-50/70 backdrop-blur-xl p-5 rounded-2xl border border-rose-200/70 shadow-[0_8px_30px_rgba(244,63,94,0.06)] hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-xs text-rose-600 font-bold uppercase tracking-wider font-mono">
            <span>ACTIONS EN RETARD</span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-[#F43F5E] flex items-center justify-center border border-rose-200 shadow-2xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-[#F43F5E] tracking-tight font-mono">
              7
            </span>
            <p className="text-[11px] text-rose-500 font-medium mt-1">Échéances dépassées à relancer</p>
          </div>
        </div>
      </div>

      {/* 3. Deux blocs centraux en verre translucide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bloc 1 : Actions par statut (Donut chart avec au centre "28 Actions") */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Actions par statut</h2>
              <p className="text-xs text-slate-500 mt-0.5">Répartition du plan d'accompagnement pédagogique</p>
            </div>
            <button 
              onClick={() => navigate('/actions')}
              className="text-xs font-bold text-slate-900 hover:text-[#00D084] transition"
            >
              Gérer ➔
            </button>
          </div>

          <div className="relative h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={actionStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={66}
                  outerRadius={94}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {actionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any) => [`${value} actions`, name]}
                  contentStyle={{ 
                    backgroundColor: '#0F172A', 
                    borderRadius: '12px', 
                    border: 'none', 
                    color: '#fff', 
                    fontSize: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centre du Donut : "28 Actions" */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 font-mono">28</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</span>
            </div>
          </div>

          {/* Légende détaillée en cartes de verre */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100/80">
            {actionStatusData.map((item) => (
              <div key={item.name} className="flex flex-col items-center p-2.5 rounded-xl bg-white/60 border border-white/90 shadow-2xs backdrop-blur-xs">
                <div className="flex items-center space-x-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-[11px] font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="text-base font-bold font-mono text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bloc 2 : Prochains rendez-vous en verre translucide */}
        <div className="glass-card rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Prochains rendez-vous</h2>
                <p className="text-xs text-slate-500 mt-0.5">Planning officiel des cours & séances du campus</p>
              </div>
              <button 
                onClick={() => navigate('/planning')}
                className="text-xs font-bold text-slate-900 hover:text-[#00D084] transition"
              >
                Planning complet ➔
              </button>
            </div>

            <div className="space-y-3">
              {appointments.map((apt) => (
                <div 
                  key={apt.id} 
                  className="p-3.5 rounded-2xl border border-white/90 bg-white/60 hover:bg-white/80 transition flex items-center justify-between shadow-2xs backdrop-blur-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-700 shadow-2xs">
                      <Clock className="w-4 h-4 text-[#0F172A]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{apt.title}</h4>
                      <p className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{apt.time}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-xs ${apt.color}`}>
                    {apt.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-500">
            <span>3 rendez-vous prévus cette semaine</span>
            <button 
              onClick={() => navigate('/synchronisations')}
              className="text-[#0F172A] font-bold hover:text-[#00D084] transition"
            >
              Voir les synchronisations
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bannière en bas en dégradé de luxe avec effet verre */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#F43F5E] p-6 rounded-3xl text-white shadow-[0_12px_40px_rgba(15,23,42,0.18)] border border-white/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Glow discret à l'intérieur */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>

        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
              À traiter en priorité : 7 actions en retard sur 28
            </h3>
            <p className="text-xs text-white/80 mt-0.5 max-w-xl">
              Ces actions pédagogiques nécessitent une relance immédiate auprès des coordinateurs et formateurs.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/actions')}
          className="self-start sm:self-auto bg-white hover:bg-slate-50 text-[#0F172A] font-extrabold text-xs px-5 py-3 rounded-2xl shadow-sm transition-all hover:scale-102 flex items-center space-x-2 shrink-0 relative z-10"
        >
          <span>Voir les actions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
