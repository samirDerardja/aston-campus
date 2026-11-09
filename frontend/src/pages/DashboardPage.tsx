import React from 'react';
import { 
  Users, UserCheck, GraduationCap, Calendar, 
  ArrowRight, Target, Clock, Laptop
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Données exactes de la maquette (Total 28 actions : 14 en cours, 7 à faire, 7 en retard, 0 clôturées)
  const chartData = [
    { name: 'En cours', value: 14, color: '#7C3AED' },
    { name: 'À faire', value: 7, color: '#F59E0B' },
    { name: 'En retard', value: 7, color: '#F43F5E' },
    { name: 'Clôturées', value: 0, color: '#10B981' },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* En-tête de bienvenue */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <span>Bonjour Samir</span>
            <span>👋</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Voici la situation pédagogique du campus Aston Informatique
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-2xs text-xs text-slate-600 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Mer. 11 nov. 2026</span>
        </div>
      </div>

      {/* Rangée 1 : Les 4 Cartes Statistiques KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1 : Promotions */}
        <div 
          onClick={() => navigate('/promotions')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center mb-3">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-none">5</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Promotions <span className="text-[10px] text-slate-400 font-normal">(+0)</span>
            </div>
          </div>
        </div>

        {/* Card 2 : Apprenants */}
        <div 
          onClick={() => navigate('/apprenants')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-none">124</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Apprenants <span className="text-[10px] text-emerald-600 font-medium">(+4)</span>
            </div>
          </div>
        </div>

        {/* Card 3 : Formateurs */}
        <div 
          onClick={() => navigate('/formateurs')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 leading-none">18</div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              Formateurs <span className="text-[10px] text-blue-600 font-medium">(+1)</span>
            </div>
          </div>
        </div>

        {/* Card 4 : Actions en retard (Alerte Rose/Rouge) */}
        <div 
          onClick={() => navigate('/actions')}
          className="bg-gradient-to-br from-[#FFF5F5] to-[#FFF0F2] p-5 rounded-2xl border border-rose-200/70 shadow-[0_2px_10px_rgba(244,63,94,0.04)] hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-600 leading-none">7</div>
            <div className="text-xs text-rose-600 font-semibold mt-1">
              Actions en retard
            </div>
          </div>
        </div>
      </div>

      {/* Rangée 2 : Actions par statut (Donut) & Prochains rendez-vous */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Actions par statut */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <h2 className="text-sm font-bold text-slate-900 mb-2">Actions par statut</h2>

          <div className="flex items-center justify-between py-2">
            {/* Donut chart circulaire */}
            <div className="relative w-40 h-40 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-900 leading-none">28</span>
                <span className="text-[10px] text-slate-400 font-medium mt-0.5">Actions</span>
              </div>
            </div>

            {/* Légende détaillée */}
            <div className="space-y-2.5 text-xs pr-4">
              <div className="flex items-center justify-between w-36">
                <span className="flex items-center space-x-2 text-slate-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#7C3AED]"></span>
                  <span>En cours</span>
                </span>
                <span className="font-bold text-slate-800">14</span>
              </div>
              <div className="flex items-center justify-between w-36">
                <span className="flex items-center space-x-2 text-slate-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                  <span>À faire</span>
                </span>
                <span className="font-bold text-slate-800">7</span>
              </div>
              <div className="flex items-center justify-between w-36">
                <span className="flex items-center space-x-2 text-slate-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#F43F5E]"></span>
                  <span>En retard</span>
                </span>
                <span className="font-bold text-rose-600">7</span>
              </div>
              <div className="flex items-center justify-between w-36">
                <span className="flex items-center space-x-2 text-slate-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                  <span>Clôturées</span>
                </span>
                <span className="font-bold text-slate-800">0</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prochains rendez-vous */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-900">Prochains rendez-vous</h2>
            <button 
              onClick={() => navigate('/planning')}
              className="text-xs text-purple-600 font-medium hover:text-purple-700 flex items-center space-x-0.5"
            >
              <span>Voir tout</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Rdv 1 */}
            <div 
              onClick={() => navigate('/synchronisations')}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 transition cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Synchronisation Dev Web</h4>
                  <p className="text-[11px] text-slate-500">Demain • 14:00</p>
                </div>
              </div>
              <div className="flex -space-x-1.5 overflow-hidden">
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60" alt="" />
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60" alt="" />
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=60" alt="" />
              </div>
            </div>

            {/* Rdv 2 */}
            <div 
              onClick={() => navigate('/entretiens')}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 transition cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Entretien individuel</h4>
                  <p className="text-[11px] text-slate-500">13 nov. • 10:00</p>
                </div>
              </div>
              <div className="flex -space-x-1.5 overflow-hidden">
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60" alt="" />
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60" alt="" />
              </div>
            </div>

            {/* Rdv 3 */}
            <div 
              onClick={() => navigate('/synchronisations')}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 transition cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Réunion pédagogique</h4>
                  <p className="text-[11px] text-slate-500">14 nov. • 09:30</p>
                </div>
              </div>
              <div className="flex -space-x-1.5 overflow-hidden">
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60" alt="" />
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60" alt="" />
                <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rangée 3 : Bannière Dégradée "À traiter en priorité" (Style exact de la maquette) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#F43F5E] via-[#8B5CF6] to-[#6366F1] p-6 text-white shadow-lg shadow-purple-500/15 flex items-center justify-between">
        <div className="flex items-center space-x-4 z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 ring-1 ring-white/30">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">À traiter en priorité</h3>
            <p className="text-xs text-white/90 mt-0.5">7 actions en retard sur 28</p>
          </div>
        </div>

        <div className="flex items-center space-x-6 z-10">
          <button
            onClick={() => navigate('/actions')}
            className="bg-white hover:bg-slate-50 text-purple-700 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition flex items-center space-x-1.5"
          >
            <span>Voir les actions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Élément graphique laptop en 3D / icône lumineuse */}
          <div className="hidden lg:flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-inner">
            <Laptop className="w-8 h-8 text-white/90" />
          </div>
        </div>

        {/* Effet lumineux d'arrière-plan */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>
    </div>
  );
};
