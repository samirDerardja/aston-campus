import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, CheckCircle2, Lock } from 'lucide-react';

export const PlanningPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const hours = ['8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h'];
  const days = [
    { name: 'Lun 10/11', key: 'mon' },
    { name: 'Mar 11/11', key: 'tue' },
    { name: 'Mer 12/11', key: 'wed' },
    { name: 'Jeu 13/11', key: 'thu' },
    { name: 'Ven 14/11', key: 'fri' }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Planning</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Calendrier des cours et événements (lecture seule — Nevea).
          </p>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-semibold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Synchronisé avec Nevea</span>
        </div>
      </div>

      {/* Barre de navigation temporelle (exacte de la maquette) */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Toggle Semaine / Mois */}
          <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 text-xs font-semibold">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'week' ? 'bg-[#6E56CF] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'month' ? 'bg-[#6E56CF] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mois
            </button>
          </div>
        </div>

        {/* Pagination de semaine */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-2xs">
            <button className="text-slate-400 hover:text-slate-700 p-0.5">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-800">10 - 16 nov. 2026</span>
            <button className="text-slate-400 hover:text-slate-700 p-0.5">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button className="px-3 py-1.5 bg-white border border-slate-200/90 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 shadow-2xs">
            Aujourd'hui
          </button>
        </div>
      </div>

      {/* Grille Calendrier (Heures x Jours) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] p-4 overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header des jours */}
          <div className="grid grid-cols-6 border-b border-slate-100 pb-3 text-center text-xs font-bold text-slate-700">
            <div className="text-slate-400 font-medium"></div>
            {days.map((d) => (
              <div key={d.key}>{d.name}</div>
            ))}
          </div>

          {/* Grille Horaire avec les blocs de cours Nevea et événements locaux */}
          <div className="relative divide-y divide-slate-100 text-xs">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-6 min-h-[46px] items-start py-1">
                <span className="text-[11px] font-mono text-slate-400 pr-3 text-right pt-0.5">{hour}</span>
                <div className="border-l border-slate-100 h-full relative"></div>
                <div className="border-l border-slate-100 h-full relative"></div>
                <div className="border-l border-slate-100 h-full relative"></div>
                <div className="border-l border-slate-100 h-full relative"></div>
                <div className="border-l border-slate-100 h-full relative"></div>
              </div>
            ))}

            {/* CRÉNEAUX POSITIONNÉS STRICTEMENT SELON LA MAQUETTE */}

            {/* Dév. Web DW2025 (Nevea - Violet) sur Lun, Mar, Ven */}
            <div 
              onClick={() => alert("Cours officiel issu de Nevea. Verrouillé en lecture seule.")}
              className="absolute top-[8px] left-[17.5%] w-[14.5%] h-[80px] bg-[#EDE9FE] border border-purple-200/80 rounded-xl p-2 cursor-pointer shadow-2xs hover:border-purple-400 transition"
            >
              <span className="text-[10px] font-bold text-purple-900 block leading-tight">Dév. Web</span>
              <span className="text-[9px] text-purple-700 font-mono">DW2025</span>
            </div>

            <div 
              onClick={() => alert("Cours officiel issu de Nevea. Verrouillé en lecture seule.")}
              className="absolute top-[8px] left-[34%] w-[14.5%] h-[80px] bg-[#EDE9FE] border border-purple-200/80 rounded-xl p-2 cursor-pointer shadow-2xs hover:border-purple-400 transition"
            >
              <span className="text-[10px] font-bold text-purple-900 block leading-tight">Dév. Web</span>
              <span className="text-[9px] text-purple-700 font-mono">DW2025</span>
            </div>

            <div 
              onClick={() => alert("Cours officiel issu de Nevea. Verrouillé en lecture seule.")}
              className="absolute top-[8px] left-[84%] w-[14.5%] h-[80px] bg-[#EDE9FE] border border-purple-200/80 rounded-xl p-2 cursor-pointer shadow-2xs hover:border-purple-400 transition"
            >
              <span className="text-[10px] font-bold text-purple-900 block leading-tight">Dév. Web</span>
              <span className="text-[9px] text-purple-700 font-mono">DW2025</span>
            </div>

            {/* Base de données DW2025 (Nevea - Vert) sur Lun, Mar, Ven */}
            <div 
              onClick={() => alert("Cours officiel issu de Nevea. Verrouillé en lecture seule.")}
              className="absolute top-[145px] left-[17.5%] w-[14.5%] h-[80px] bg-[#DCFCE7] border border-emerald-200/80 rounded-xl p-2 cursor-pointer shadow-2xs hover:border-emerald-400 transition"
            >
              <span className="text-[10px] font-bold text-emerald-900 block leading-tight">Base de données</span>
              <span className="text-[9px] text-emerald-700 font-mono">DW2025</span>
            </div>

            <div 
              onClick={() => alert("Cours officiel issu de Nevea. Verrouillé en lecture seule.")}
              className="absolute top-[145px] left-[34%] w-[14.5%] h-[80px] bg-[#DCFCE7] border border-emerald-200/80 rounded-xl p-2 cursor-pointer shadow-2xs hover:border-emerald-400 transition"
            >
              <span className="text-[10px] font-bold text-emerald-900 block leading-tight">Base de données</span>
              <span className="text-[9px] text-emerald-700 font-mono">DW2025</span>
            </div>

            <div 
              onClick={() => alert("Cours officiel issu de Nevea. Verrouillé en lecture seule.")}
              className="absolute top-[145px] left-[84%] w-[14.5%] h-[80px] bg-[#DCFCE7] border border-emerald-200/80 rounded-xl p-2 cursor-pointer shadow-2xs hover:border-emerald-400 transition"
            >
              <span className="text-[10px] font-bold text-emerald-900 block leading-tight">Base de données</span>
              <span className="text-[9px] text-emerald-700 font-mono">DW2025</span>
            </div>

            {/* Atelier projet DW2025 (Local Aston - Rose/Violet) */}
            <div 
              onClick={() => alert("Événement local Aston Campus. Modifiable.")}
              className="absolute top-[280px] left-[17.5%] w-[14.5%] h-[80px] bg-[#FCE7F3] border border-pink-200/80 rounded-xl p-2 cursor-pointer shadow-2xs hover:border-pink-400 transition"
            >
              <span className="text-[10px] font-bold text-pink-900 block leading-tight">Atelier projet</span>
              <span className="text-[9px] text-pink-700 font-mono">DW2025</span>
            </div>

            {/* Réunion équipe Aston Campus (Local Aston - Orange) */}
            <div 
              onClick={() => alert("Événement local Aston Campus. Modifiable.")}
              className="absolute top-[370px] left-[34%] w-[14.5%] h-[80px] bg-[#FEF3C7] border border-amber-200/80 rounded-xl p-2 cursor-pointer shadow-2xs hover:border-amber-400 transition"
            >
              <span className="text-[10px] font-bold text-amber-900 block leading-tight">Réunion équipe</span>
              <span className="text-[9px] text-amber-700">Aston Campus</span>
            </div>

            <div 
              onClick={() => alert("Événement local Aston Campus. Modifiable.")}
              className="absolute top-[370px] left-[84%] w-[14.5%] h-[80px] bg-[#FEF3C7] border border-amber-200/80 rounded-xl p-2 cursor-pointer shadow-2xs hover:border-amber-400 transition"
            >
              <span className="text-[10px] font-bold text-amber-900 block leading-tight">Réunion équipe</span>
              <span className="text-[9px] text-amber-700">Aston Campus</span>
            </div>

            {/* Entretien individuel (Local Aston - Bleu) */}
            <div 
              onClick={() => alert("Événement local Aston Campus. Modifiable.")}
              className="absolute top-[370px] left-[67.5%] w-[14.5%] h-[80px] bg-[#DBEAFE] border border-blue-200/80 rounded-xl p-2 cursor-pointer shadow-2xs hover:border-blue-400 transition"
            >
              <span className="text-[10px] font-bold text-blue-900 block leading-tight">Entretien</span>
              <span className="text-[9px] text-blue-700">individuel</span>
            </div>
          </div>
        </div>

        {/* Légende en bas de planning (exacte de la maquette) */}
        <div className="flex items-center space-x-6 pt-4 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]"></span>
            <span className="text-slate-600 font-medium">Cours (Nevea)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
            <span className="text-slate-600 font-medium">Événement Aston Campus</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
            <span className="text-slate-600 font-medium">Entretien</span>
          </div>
        </div>
      </div>
    </div>
  );
};
