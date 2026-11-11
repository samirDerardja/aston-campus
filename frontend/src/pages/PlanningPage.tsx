import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, CheckCircle2, Lock, Calendar, Clock, MapPin, X, Info } from 'lucide-react';

interface EventDetail {
  title: string;
  promo: string;
  source: 'nevea' | 'aston';
  hours: string;
  room: string;
  trainer: string;
}

export const PlanningPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);

  const hours = ['8h', '9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h'];
  const days = [
    { name: 'Lun 10/11', key: 'mon' },
    { name: 'Mar 11/11', key: 'tue' },
    { name: 'Mer 12/11', key: 'wed' },
    { name: 'Jeu 13/11', key: 'thu' },
    { name: 'Ven 14/11', key: 'fri' }
  ];

  const handleEventClick = (event: EventDetail) => {
    setSelectedEvent(event);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Planning consolidé
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Calendrier des cours officiels et événements de coordination Aston Campus
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#00D084]/15 border border-[#00D084]/30 text-xs text-emerald-800 font-bold shadow-2xs backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#00D084] animate-pulse"></span>
          <span>Planning officiel validé</span>
        </div>
      </div>

      {/* Barre de navigation temporelle en verre translucide */}
      <div className="glass-panel p-3 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Toggle Semaine / Mois */}
          <div className="flex bg-white/60 p-0.5 rounded-xl border border-white/80 text-xs font-semibold shadow-2xs">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                viewMode === 'week' 
                  ? 'bg-[#0F172A] text-white shadow-2xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                viewMode === 'month' 
                  ? 'bg-[#0F172A] text-white shadow-2xs font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mois
            </button>
          </div>
        </div>

        {/* Pagination de semaine */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-2 bg-white/80 px-3.5 py-1.5 rounded-xl border border-white/90 shadow-2xs">
            <button className="text-slate-400 hover:text-slate-700 p-0.5">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-800 font-mono">10 - 16 nov. 2026</span>
            <button className="text-slate-400 hover:text-slate-700 p-0.5">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button className="px-3.5 py-1.5 bg-white/80 border border-white/90 rounded-xl text-slate-800 font-bold hover:bg-white shadow-2xs transition">
            Aujourd'hui
          </button>
        </div>
      </div>

      {/* Grille Calendrier en verre translucide */}
      <div className="glass-card rounded-3xl p-5 overflow-x-auto">
        <div className="min-w-[700px]">
          {/* Header des jours */}
          <div className="grid grid-cols-6 border-b border-white/80 pb-3 text-center text-xs font-bold text-slate-700">
            <div className="text-slate-400 font-medium">Heure</div>
            {days.map((d) => (
              <div key={d.key}>{d.name}</div>
            ))}
          </div>

          {/* Grille Horaire avec les blocs de cours Nevea et événements locaux */}
          <div className="relative divide-y divide-white/60 text-xs">
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-6 min-h-[46px] items-start py-1">
                <span className="text-[11px] font-mono text-slate-400 pr-3 text-right pt-0.5">{hour}</span>
                <div className="border-l border-white/60 h-full relative"></div>
                <div className="border-l border-white/60 h-full relative"></div>
                <div className="border-l border-white/60 h-full relative"></div>
                <div className="border-l border-white/60 h-full relative"></div>
                <div className="border-l border-white/60 h-full relative"></div>
              </div>
            ))}

            {/* Créneaux positionnés en verre translucide */}
            {/* Dév. Web DW2025 (Nevea - Bleu Royal Glass) sur Lun, Mar, Ven */}
            <div 
              onClick={() => handleEventClick({
                title: 'Architecture & Dév. Web Frontend',
                promo: 'PROMO-DW-2025-01',
                source: 'nevea',
                hours: '08:30 - 12:00',
                room: 'Lab Tech 302',
                trainer: 'Julien Leroy (Formateur)'
              })}
              className="absolute top-[8px] left-[17.5%] w-[14.5%] h-[80px] bg-blue-500/10 backdrop-blur-md border border-blue-500/25 rounded-2xl p-2.5 cursor-pointer shadow-2xs hover:border-blue-500/50 transition-all hover:scale-101"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-950 block leading-tight">Dév. Web</span>
                <Lock className="w-2.5 h-2.5 text-blue-500" />
              </div>
              <span className="text-[9px] text-blue-800 font-mono">DW2025</span>
            </div>

            <div 
              onClick={() => handleEventClick({
                title: 'Architecture & Dév. Web Frontend',
                promo: 'PROMO-DW-2025-01',
                source: 'nevea',
                hours: '08:30 - 12:00',
                room: 'Lab Tech 302',
                trainer: 'Julien Leroy'
              })}
              className="absolute top-[8px] left-[34%] w-[14.5%] h-[80px] bg-blue-500/10 backdrop-blur-md border border-blue-500/25 rounded-2xl p-2.5 cursor-pointer shadow-2xs hover:border-blue-500/50 transition-all hover:scale-101"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-950 block leading-tight">Dév. Web</span>
                <Lock className="w-2.5 h-2.5 text-blue-500" />
              </div>
              <span className="text-[9px] text-blue-800 font-mono">DW2025</span>
            </div>

            <div 
              onClick={() => handleEventClick({
                title: 'Architecture & Dév. Web Frontend',
                promo: 'PROMO-DW-2025-01',
                source: 'nevea',
                hours: '08:30 - 12:00',
                room: 'Lab Tech 302',
                trainer: 'Julien Leroy'
              })}
              className="absolute top-[8px] left-[84%] w-[14.5%] h-[80px] bg-blue-500/10 backdrop-blur-md border border-blue-500/25 rounded-2xl p-2.5 cursor-pointer shadow-2xs hover:border-blue-500/50 transition-all hover:scale-101"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-950 block leading-tight">Dév. Web</span>
                <Lock className="w-2.5 h-2.5 text-blue-500" />
              </div>
              <span className="text-[9px] text-blue-800 font-mono">DW2025</span>
            </div>

            {/* Base de données DW2025 (Nevea - Émeraude Glass) sur Lun, Mar, Ven */}
            <div 
              onClick={() => handleEventClick({
                title: 'PostgreSQL & Modélisation relationnelle',
                promo: 'PROMO-DW-2025-01',
                source: 'nevea',
                hours: '13:30 - 17:00',
                room: 'Amphi Aston B',
                trainer: 'Claire Vasseur'
              })}
              className="absolute top-[145px] left-[17.5%] w-[14.5%] h-[80px] bg-[#00D084]/15 backdrop-blur-md border border-[#00D084]/30 rounded-2xl p-2.5 cursor-pointer shadow-2xs hover:border-[#00D084]/60 transition-all hover:scale-101"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-950 block leading-tight">Base de données</span>
                <Lock className="w-2.5 h-2.5 text-emerald-600" />
              </div>
              <span className="text-[9px] text-emerald-800 font-mono">DW2025</span>
            </div>

            <div 
              onClick={() => handleEventClick({
                title: 'PostgreSQL & Modélisation relationnelle',
                promo: 'PROMO-DW-2025-01',
                source: 'nevea',
                hours: '13:30 - 17:00',
                room: 'Amphi Aston B',
                trainer: 'Claire Vasseur'
              })}
              className="absolute top-[145px] left-[34%] w-[14.5%] h-[80px] bg-[#00D084]/15 backdrop-blur-md border border-[#00D084]/30 rounded-2xl p-2.5 cursor-pointer shadow-2xs hover:border-[#00D084]/60 transition-all hover:scale-101"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-950 block leading-tight">Base de données</span>
                <Lock className="w-2.5 h-2.5 text-emerald-600" />
              </div>
              <span className="text-[9px] text-emerald-800 font-mono">DW2025</span>
            </div>

            <div 
              onClick={() => handleEventClick({
                title: 'PostgreSQL & Modélisation relationnelle',
                promo: 'PROMO-DW-2025-01',
                source: 'nevea',
                hours: '13:30 - 17:00',
                room: 'Amphi Aston B',
                trainer: 'Claire Vasseur'
              })}
              className="absolute top-[145px] left-[84%] w-[14.5%] h-[80px] bg-[#00D084]/15 backdrop-blur-md border border-[#00D084]/30 rounded-2xl p-2.5 cursor-pointer shadow-2xs hover:border-[#00D084]/60 transition-all hover:scale-101"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-950 block leading-tight">Base de données</span>
                <Lock className="w-2.5 h-2.5 text-emerald-600" />
              </div>
              <span className="text-[9px] text-emerald-800 font-mono">DW2025</span>
            </div>

            {/* Atelier projet DW2025 (Local Aston - Indigo Glass) */}
            <div 
              onClick={() => handleEventClick({
                title: 'Atelier projet & Soutenance blanche',
                promo: 'PROMO-DW-2025-01',
                source: 'aston',
                hours: '14:00 - 16:30',
                room: 'Salle Projets 104',
                trainer: 'Samir Derardja (Coordination)'
              })}
              className="absolute top-[280px] left-[17.5%] w-[14.5%] h-[80px] bg-indigo-500/10 backdrop-blur-md border border-indigo-500/25 rounded-2xl p-2.5 cursor-pointer shadow-2xs hover:border-indigo-500/50 transition-all hover:scale-101"
            >
              <span className="text-[10px] font-bold text-indigo-950 block leading-tight">Atelier projet</span>
              <span className="text-[9px] text-indigo-800 font-mono">Aston Local</span>
            </div>

            {/* Réunion équipe Aston Campus (Local Aston - Ambre Glass) */}
            <div 
              onClick={() => handleEventClick({
                title: 'Point d\'étape & Synchronisation trimestrielle',
                promo: 'Coordination Campus',
                source: 'aston',
                hours: '16:00 - 17:30',
                room: 'Salle de réunion Direction',
                trainer: 'Équipe pédagogique'
              })}
              className="absolute top-[370px] left-[34%] w-[14.5%] h-[80px] bg-amber-500/10 backdrop-blur-md border border-amber-500/25 rounded-2xl p-2.5 cursor-pointer shadow-2xs hover:border-amber-500/50 transition-all hover:scale-101"
            >
              <span className="text-[10px] font-bold text-amber-950 block leading-tight">Réunion équipe</span>
              <span className="text-[9px] text-amber-800">Aston Campus</span>
            </div>

            {/* Entretien individuel (Local Aston - Bleu ciel Glass) */}
            <div 
              onClick={() => handleEventClick({
                title: 'Bilan individuel de mi-parcours alternance',
                promo: 'Thomas Dubois',
                source: 'aston',
                hours: '10:00 - 11:00',
                room: 'Bureau B201',
                trainer: 'Samir Derardja'
              })}
              className="absolute top-[370px] left-[67.5%] w-[14.5%] h-[80px] bg-sky-500/10 backdrop-blur-md border border-sky-500/25 rounded-2xl p-2.5 cursor-pointer shadow-2xs hover:border-sky-500/50 transition-all hover:scale-101"
            >
              <span className="text-[10px] font-bold text-sky-950 block leading-tight">Entretien</span>
              <span className="text-[9px] text-sky-800">Individuel</span>
            </div>
          </div>
        </div>

        {/* Légende en bas de planning */}
        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/60 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span className="text-slate-600 font-medium">Cours officiel du cursus (Protégé)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00D084]"></span>
            <span className="text-slate-600 font-medium">TP & Ateliers pratiques</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-slate-600 font-medium">Synchronisation Campus Aston</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
            <span className="text-slate-600 font-medium">Atelier & Projets</span>
          </div>
        </div>
      </div>

      {/* Event Details Drawer/Modal en verre translucide */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase font-mono ${
                  selectedEvent.source === 'nevea' 
                    ? 'bg-blue-500/10 text-blue-700 border border-blue-500/20' 
                    : 'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                }`}>
                  {selectedEvent.source === 'nevea' ? 'COURS OFFICIEL (LECTURE SEULE)' : 'ASTON LOCAL'}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-2">
                  {selectedEvent.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Horaires : <strong className="text-slate-900 font-mono">{selectedEvent.hours}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Lieu : <strong className="text-slate-900">{selectedEvent.room}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Promotion : <strong className="text-slate-900 font-mono">{selectedEvent.promo}</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-slate-400" />
                <span>Intervenant : <strong className="text-slate-900">{selectedEvent.trainer}</strong></span>
              </div>
            </div>

            {selectedEvent.source === 'nevea' && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 flex items-start space-x-2">
                <Lock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                <span>Ce cours fait partie du programme officiel validé et est protégé en lecture seule.</span>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2.5 rounded-2xl bg-[#0F172A] text-white font-bold text-xs hover:bg-[#1E293B] transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanningPage;
