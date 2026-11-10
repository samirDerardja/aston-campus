import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, Search, Mail, Phone, BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TrainersPage: React.FC = () => {
  const { trainers, promotions, actions } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredTrainers = trainers.filter(t => 
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    t.specialties.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">Formateurs & Intervenants</h1>
          <p className="text-xs text-slate-500 mt-1">
            Annuaire des formateurs référents et intervenants spécialisés du campus
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3.5 py-1.5 rounded-full bg-[#00D084]/15 text-emerald-800 font-bold border border-[#00D084]/30 backdrop-blur-md shadow-2xs text-xs font-mono">
            {trainers.length} formateurs actifs
          </span>
        </div>
      </div>

      {/* Barre de Recherche en verre */}
      <div className="glass-panel p-3.5 rounded-3xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par formateur, spécialité (Linux, Sécurité, No-Code)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white/70 hover:bg-white focus:bg-white border border-white/90 rounded-2xl outline-none focus:border-slate-800 transition shadow-2xs"
          />
        </div>
      </div>

      {/* Grille des Formateurs en verre translucide */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTrainers.map((trainer) => {
          const assignedPromos = promotions.filter(p => trainer.assignedPromotionIds.includes(p.id));
          const trainerActions = actions.filter(a => a.assigneeId === trainer.id);

          return (
            <div
              key={trainer.id}
              className="glass-card p-5 rounded-3xl flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#0F172A] text-white font-black flex items-center justify-center text-sm font-mono shadow-xs">
                    {trainer.firstName[0]}{trainer.lastName[0]}
                  </div>
                  {trainer.neveaReference && (
                    <span className="text-[10px] font-mono text-slate-700 bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-200/60 shadow-2xs">
                      Réf: {trainer.neveaReference}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition">{trainer.firstName} {trainer.lastName}</h3>
                <div className="space-y-1 mt-2 text-xs text-slate-500">
                  <div className="flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-[11px]">{trainer.email}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{trainer.phone}</span>
                  </div>
                </div>

                {/* Spécialités */}
                <div className="mt-4 pt-3 border-t border-white/60">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 font-mono">
                    Domaines d'expertise
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {trainer.specialties.map(spec => (
                      <span key={spec} className="text-[11px] bg-white/70 border border-white/90 text-slate-700 px-2.5 py-0.5 rounded-lg font-medium shadow-2xs">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Promotions Assignées */}
                <div className="mt-4 pt-3 border-t border-white/60 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 font-mono">
                    Promotions affectées ({assignedPromos.length})
                  </span>
                  <div className="space-y-1">
                    {assignedPromos.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => navigate(`/promotions/${p.id}`)}
                        className="text-slate-800 hover:text-emerald-600 font-semibold cursor-pointer flex items-center justify-between transition"
                      >
                        <span className="truncate">{p.name}</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/60 flex items-center justify-between text-xs text-slate-500">
                <span>{trainerActions.length} action{trainerActions.length > 1 ? 's' : ''} assignée{trainerActions.length > 1 ? 's' : ''}</span>
                <span className="text-emerald-600 font-bold">Actif</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrainersPage;
