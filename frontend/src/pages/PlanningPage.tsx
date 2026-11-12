import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, ChevronRight, CheckCircle2, Lock, Calendar, Clock, MapPin, X, Plus, Trash2 } from 'lucide-react';

interface EventDetail {
  id?: string;
  title: string;
  promo: string;
  source: 'nevea' | 'aston';
  hours: string;
  room: string;
  trainer: string;
}

export const PlanningPage: React.FC = () => {
  const { events, promotions, addEvent, deleteEvent } = useApp();
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 2 * 3600000).toISOString().slice(0, 16),
    promotionId: '',
    room: 'Salle Coordination B201',
  });

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

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    addEvent({
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      promotionId: formData.promotionId || promotions[0]?.id,
      room: formData.room.trim() || 'Campus Aston',
    });
    setIsCreateOpen(false);
    setFormData({
      title: '',
      description: '',
      startTime: new Date().toISOString().slice(0, 16),
      endTime: new Date(Date.now() + 2 * 3600000).toISOString().slice(0, 16),
      promotionId: promotions[0]?.id || '',
      room: 'Salle Coordination B201',
    });
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (window.confirm(`Supprimer l'événement "${title}" ?`)) {
      deleteEvent(id);
      if (selectedEvent?.id === id) {
        setSelectedEvent(null);
      }
    }
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

        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#00D084]/15 border border-[#00D084]/30 text-xs text-emerald-800 font-bold shadow-2xs backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#00D084] animate-pulse"></span>
            <span>Planning officiel validé</span>
          </div>

          <button
            onClick={() => {
              setFormData(prev => ({ ...prev, promotionId: promotions[0]?.id || '' }));
              setIsCreateOpen(true);
            }}
            className="inline-flex items-center space-x-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-extrabold px-5 py-2.5 rounded-2xl shadow-[0_4px_16px_rgba(15,23,42,0.2)] transition-all hover:scale-102"
          >
            <Plus className="w-4 h-4 text-[#00D084]" />
            <span>Nouvel événement</span>
          </button>
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

      {/* Événements consolidés (Nevea lecture seule & Aston Local CRUD) */}
      <div className="glass-card rounded-3xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Événements & Créneaux enregistrés ({events.length})</h2>
            <p className="text-[11px] text-slate-500">
              Les événements locaux Aston Campus peuvent être ajoutés et supprimés ; les cours Nevea restent protégés en lecture seule.
            </p>
          </div>
        </div>

        {events.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4 text-center">Aucun événement enregistré.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {events.map((ev) => {
              const isNevea = ev.sourceType === 'nevea_readonly' || ev.isReadonly;
              const promo = promotions.find(p => p.id === ev.promotionId);
              const startStr = new Date(ev.startTime).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
              const startTimeStr = new Date(ev.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
              const endTimeStr = new Date(ev.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

              return (
                <div
                  key={ev.id}
                  onClick={() => handleEventClick({
                    id: ev.id,
                    title: ev.title,
                    promo: promo?.name || ev.promotionName || 'Campus Aston',
                    source: isNevea ? 'nevea' : 'aston',
                    hours: `${startStr} • ${startTimeStr} - ${endTimeStr}`,
                    room: ev.room || 'Campus Aston',
                    trainer: ev.trainerName || 'Équipe pédagogique',
                  })}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition hover:shadow-xs flex items-start justify-between gap-2 ${
                    isNevea
                      ? 'bg-blue-500/5 border-blue-500/20'
                      : 'bg-white/80 border-slate-200/80 hover:border-indigo-300'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center space-x-1.5 mb-1">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        isNevea ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {isNevea ? 'Nevea' : 'Aston Local'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{startStr} {startTimeStr}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate">{ev.title}</h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {promo?.name || ev.promotionName || 'Campus'} • {ev.room || 'Salle à définir'}
                    </p>
                  </div>
                  {isNevea ? (
                    <Lock className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-1" />
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(ev.id, ev.title);
                      }}
                      title="Supprimer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 shrink-0 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Créer un événement Aston Local */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Nouvel événement Aston Campus</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Titre de l'événement *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Atelier projet & Soutenance blanche"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Promotion</label>
                  <select
                    value={formData.promotionId}
                    onChange={(e) => setFormData({ ...formData, promotionId: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                  >
                    {promotions.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Salle / Lieu</label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Début</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fin</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold shadow-xs transition"
                >
                  Créer l'événement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

            <div className="pt-2 flex justify-end space-x-2">
              {selectedEvent.source === 'aston' && selectedEvent.id && (
                <button
                  onClick={() => handleDeleteEvent(selectedEvent.id!, selectedEvent.title)}
                  className="px-4 py-2.5 rounded-2xl bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs transition inline-flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer</span>
                </button>
              )}
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
