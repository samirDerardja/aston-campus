import React, { useState } from 'react';
import { Search, GraduationCap, Users, UserCheck, CalendarCheck, CheckSquare, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, promotions, students, trainers } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (!isCommandPaletteOpen) return null;

  const filteredPromos = promotions.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.code.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredStudents = students.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
    s.companyName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredTrainers = trainers.filter(t => 
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 2);

  const handleSelect = (url: string) => {
    navigate(url);
    setCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-24 p-4 animate-in fade-in duration-100">
      <div 
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-slate-100 flex items-center space-x-2">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Tapez pour naviguer : promotions, apprenants, formateurs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm outline-none text-slate-800 placeholder-slate-400"
          />
          <button 
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100 text-xs">
          {/* Section Promotions */}
          {filteredPromos.length > 0 && (
            <div className="py-1">
              <span className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Promotions</span>
              {filteredPromos.map(p => (
                <div
                  key={p.id}
                  onClick={() => handleSelect(`/promotions/${p.id}`)}
                  className="flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-700"
                >
                  <GraduationCap className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="font-medium text-slate-900">{p.name}</span>
                  <span className="text-slate-400 text-[11px] font-mono">{p.code}</span>
                </div>
              ))}
            </div>
          )}

          {/* Section Apprenants */}
          {filteredStudents.length > 0 && (
            <div className="py-1">
              <span className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Apprenants</span>
              {filteredStudents.map(s => (
                <div
                  key={s.id}
                  onClick={() => handleSelect(`/apprenants/${s.id}`)}
                  className="flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-700"
                >
                  <Users className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-medium text-slate-900">{s.firstName} {s.lastName}</span>
                  <span className="text-slate-400 text-[11px]">({s.companyName})</span>
                </div>
              ))}
            </div>
          )}

          {/* Section Formateurs */}
          {filteredTrainers.length > 0 && (
            <div className="py-1">
              <span className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Formateurs</span>
              {filteredTrainers.map(t => (
                <div
                  key={t.id}
                  onClick={() => handleSelect('/formateurs')}
                  className="flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-700"
                >
                  <UserCheck className="w-4 h-4 text-violet-500 shrink-0" />
                  <span className="font-medium text-slate-900">{t.firstName} {t.lastName}</span>
                  <span className="text-slate-400 text-[11px] truncate">{t.specialties.join(', ')}</span>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Rapide */}
          <div className="py-1">
            <span className="px-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Accès direct</span>
            <div
              onClick={() => handleSelect('/actions')}
              className="flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-700"
            >
              <CheckSquare className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Tableau Kanban des actions correctives</span>
            </div>
            <div
              onClick={() => handleSelect('/entretiens')}
              className="flex items-center space-x-2.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 cursor-pointer text-slate-700"
            >
              <CalendarCheck className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Planifier ou consulter les entretiens</span>
            </div>
          </div>
        </div>

        <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Utilisez les flèches pour naviguer, Entrée pour valider</span>
          <kbd className="font-mono bg-white border border-slate-200 px-1 rounded">Échap pour fermer</kbd>
        </div>
      </div>
    </div>
  );
};

