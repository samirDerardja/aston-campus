import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, Clock, Lock, Sparkles, Filter, 
  ChevronLeft, ChevronRight, MapPin, User, Plus 
} from 'lucide-react';

export const PlanningPage: React.FC = () => {
  const { events, promotions, trainers } = useApp();

  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [selectedPromo, setSelectedPromo] = useState('all');
  const [selectedTrainer, setSelectedTrainer] = useState('all');

  const filteredEvents = events.filter(e => {
    const matchesPromo = selectedPromo === 'all' || e.promotionId === selectedPromo;
    return matchesPromo;
  });

  return (
    <div className="space-y-6">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Planning Pédagogique</h1>
          <p className="text-xs text-slate-500">
            Cours officiels Nevea (lecture seule garantie) et événements locaux Aston Campus
          </p>
        </div>

        {/* Vues jour / semaine / mois */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-md font-medium ${viewMode === 'day' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
            >
              Jour
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-md font-medium ${viewMode === 'week' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
            >
              Semaine
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-md font-medium ${viewMode === 'month' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
            >
              Mois
            </button>
          </div>
        </div>
      </div>

      {/* Barre de Filtres & Légende */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedPromo}
              onChange={(e) => setSelectedPromo(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">Toutes les promotions</option>
              {promotions.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Légende Nevea vs Local */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-sky-500 flex items-center justify-center text-[8px] text-white">
              <Lock className="w-2 h-2" />
            </span>
            <span className="text-slate-600 font-medium">Cours Nevea (Lecture seule)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-indigo-500"></span>
            <span className="text-slate-600 font-medium">Événements locaux Aston (Modifiables)</span>
          </div>
        </div>
      </div>

      {/* Vue Calendrier Interactive */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-base font-bold text-slate-900">Novembre 2026 — Semaine 46</h2>
          </div>
          <div className="flex items-center space-x-1 text-slate-500">
            <button className="p-1.5 hover:bg-slate-100 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
            <button className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-md text-slate-700">Aujourd'hui</button>
            <button className="p-1.5 hover:bg-slate-100 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Grille des Jours de la Semaine */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {['Lundi 09 Nov', 'Mardi 10 Nov', 'Mercredi 11 Nov', 'Jeudi 12 Nov', 'Vendredi 13 Nov'].map((dayName, idx) => {
            const dayEvents = filteredEvents.filter(e => {
              const date = new Date(e.startTime);
              return date.getDate() === 9 + idx;
            });

            return (
              <div key={dayName} className="border border-slate-200/80 rounded-xl bg-slate-50/50 p-3 min-h-[360px] flex flex-col">
                <div className="font-semibold text-xs text-slate-700 border-b border-slate-200/80 pb-2 mb-3">
                  {dayName}
                </div>

                <div className="space-y-2.5 flex-1">
                  {dayEvents.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-[11px] text-slate-400 italic">
                      Aucune séance
                    </div>
                  ) : (
                    dayEvents.map(evt => (
                      <div
                        key={evt.id}
                        onClick={() => {
                          if (evt.isReadonly) {
                            alert("Ce cours officiel provient de Nevea. Par règle stricte, il est en lecture seule et ne peut être altéré depuis Aston Campus.");
                          } else {
                            alert(`Événement local : "${evt.title}". Vous pouvez éditer cet événement car vous en avez la gestion.`);
                          }
                        }}
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition shadow-xs ${
                          evt.isReadonly 
                            ? 'bg-sky-50 border-sky-200 hover:border-sky-400' 
                            : 'bg-indigo-50 border-indigo-200 hover:border-indigo-400'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded flex items-center space-x-1 ${
                            evt.isReadonly ? 'bg-sky-200 text-sky-900' : 'bg-indigo-200 text-indigo-900'
                          }`}>
                            {evt.isReadonly && <Lock className="w-2.5 h-2.5 mr-0.5" />}
                            <span>{evt.isReadonly ? 'Nevea' : 'Local'}</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {new Date(evt.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-[11px] leading-tight">{evt.title}</h4>
                        <p className="text-[10px] text-slate-500 mt-1">{evt.promotionName}</p>
                        
                        {evt.room && (
                          <div className="flex items-center space-x-1 text-[10px] text-slate-600 mt-2">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{evt.room}</span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
