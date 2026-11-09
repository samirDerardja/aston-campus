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
    <div className="space-y-6">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Formateurs & Intervenants</h1>
          <p className="text-xs text-slate-500">
            Annuaire des formateurs référents et intervenants spécialisés du campus
          </p>
        </div>
      </div>

      {/* Barre de Recherche */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par formateur, spécialité (Linux, Sécurité, No-Code)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Grille des Formateurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTrainers.map((trainer) => {
          const assignedPromos = promotions.filter(p => trainer.assignedPromotionIds.includes(p.id));
          const trainerActions = actions.filter(a => a.assigneeId === trainer.id);

          return (
            <div
              key={trainer.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-indigo-400 hover:shadow-subtle transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm">
                    {trainer.firstName[0]}{trainer.lastName[0]}
                  </div>
                  {trainer.neveaReference && (
                    <span className="text-[10px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                      Réf: {trainer.neveaReference}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900">{trainer.firstName} {trainer.lastName}</h3>
                <div className="space-y-1 mt-2 text-xs text-slate-500">
                  <div className="flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{trainer.email}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{trainer.phone}</span>
                  </div>
                </div>

                {/* Spécialités */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Domaines d'expertise
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {trainer.specialties.map(spec => (
                      <span key={spec} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Promotions Assignées */}
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Promotions affectées ({assignedPromos.length})
                  </span>
                  <div className="space-y-1">
                    {assignedPromos.map(p => (
                      <div 
                        key={p.id}
                        onClick={() => navigate(`/promotions/${p.id}`)}
                        className="text-indigo-600 hover:underline cursor-pointer flex items-center justify-between"
                      >
                        <span className="truncate">{p.name}</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{trainerActions.length} action{trainerActions.length > 1 ? 's' : ''} assignée{trainerActions.length > 1 ? 's' : ''}</span>
                <span className="text-emerald-600 font-medium">Actif</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

