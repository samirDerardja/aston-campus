import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, Search, ChevronDown, CheckCircle2, Clock, 
  User, X, Calendar 
} from 'lucide-react';

export const InterviewsPage: React.FC = () => {
  const { interviews, addInterview } = useApp();

  const [filterPill, setFilterPill] = useState<'all' | 'upcoming' | 'completed' | 'postponed' | 'cancelled'>('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "Point d'étape",
    studentName: 'Thomas Dubois',
    scheduledAt: '13 nov. 2025 à 10:00',
    type: 'apprenant_individuel'
  });

  const pills = [
    { id: 'all', label: 'Tous (24)' },
    { id: 'upcoming', label: 'À venir (6)' },
    { id: 'completed', label: 'Réalisés (14)' },
    { id: 'postponed', label: 'Reportés (2)' },
    { id: 'cancelled', label: 'Annulés (2)' },
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addInterview({
      title: formData.title,
      type: 'apprenant_individuel',
      scheduledAt: new Date().toISOString(),
      promotionId: 'promo-dw-2025',
      location: 'Bureau Coordination B201'
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* En-tête avec bouton luxe */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Entretiens d'accompagnement
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Planifiez, suivez et consultez les comptes rendus pédagogiques et de suivi alternance
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-extrabold px-5 py-2.5 rounded-2xl shadow-[0_4px_16px_rgba(15,23,42,0.2)] transition-all hover:scale-102 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#00D084]" />
          <span>Nouvel entretien</span>
        </button>
      </div>

      {/* Rangée de Pills Horizontaux en verre translucide */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {pills.map((pill) => (
          <button
            key={pill.id}
            onClick={() => setFilterPill(pill.id as any)}
            className={`px-4 py-2 rounded-full text-xs transition-all ${
              filterPill === pill.id
                ? 'bg-[#0F172A] text-white shadow-[0_4px_14px_rgba(15,23,42,0.22)] font-bold'
                : 'glass-pill text-slate-600 hover:text-slate-900 hover:bg-white/90 font-medium'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Barre de Filtres Dropdowns & Recherche en verre */}
      <div className="glass-panel p-3.5 rounded-3xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un apprenant, formateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white/70 border border-white/90 rounded-2xl outline-none focus:border-slate-800 shadow-2xs transition"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative">
            <select className="appearance-none bg-white/80 text-xs text-slate-700 font-semibold pl-4 pr-9 py-2.5 rounded-2xl border border-white/90 shadow-2xs outline-none cursor-pointer hover:bg-white">
              <option>Promotion</option>
              <option>Développeur Web - 2025</option>
              <option>CDA - 2026</option>
              <option>BTS SIO - 2025</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select className="appearance-none bg-white/80 text-xs text-slate-700 font-semibold pl-4 pr-9 py-2.5 rounded-2xl border border-white/90 shadow-2xs outline-none cursor-pointer hover:bg-white">
              <option>Période</option>
              <option>Novembre 2026</option>
              <option>Octobre 2026</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table des Entretiens en verre translucide de luxe */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/40 border-b border-white/70 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
            <tr>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6">Apprenant / Formateur</th>
              <th className="py-4 px-6">Motif</th>
              <th className="py-4 px-6">Statut</th>
              <th className="py-4 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/50">
            {/* Ligne 1 */}
            <tr className="hover:bg-white/60 transition">
              <td className="py-4 px-6 text-slate-700 font-medium">
                12 nov. 2026 <span className="block text-[11px] text-slate-400 font-mono">14:00</span>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-xs">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Sophie Martin</span>
                    <span className="text-[10px] text-slate-400 font-mono">(Apprenante)</span>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-slate-800 font-medium">Suivi pédagogique</td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-700 border border-blue-500/20 backdrop-blur-xs">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span>À venir</span>
                </span>
              </td>
              <td className="py-4 px-4 text-right text-slate-400">⋮</td>
            </tr>

            {/* Ligne 2 */}
            <tr className="hover:bg-white/60 transition">
              <td className="py-4 px-6 text-slate-700 font-medium">
                13 nov. 2026 <span className="block text-[11px] text-slate-400 font-mono">10:00</span>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-xs">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Thomas Dubois</span>
                    <span className="text-[10px] text-slate-400 font-mono">(Apprenant)</span>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-slate-800 font-medium">Point d'étape</td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-700 border border-blue-500/20 backdrop-blur-xs">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span>À venir</span>
                </span>
              </td>
              <td className="py-4 px-4 text-right text-slate-400">⋮</td>
            </tr>

            {/* Ligne 3 */}
            <tr className="hover:bg-white/60 transition">
              <td className="py-4 px-6 text-slate-700 font-medium">
                05 nov. 2026 <span className="block text-[11px] text-slate-400 font-mono">15:00</span>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-xs">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Julien Petit</span>
                    <span className="text-[10px] text-slate-400 font-mono">(Formateur)</span>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-slate-800 font-medium">Point équipe</td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 backdrop-blur-xs">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Réalisé</span>
                </span>
              </td>
              <td className="py-4 px-4 text-right text-slate-400">⋮</td>
            </tr>

            {/* Ligne 4 */}
            <tr className="hover:bg-white/60 transition">
              <td className="py-4 px-6 text-slate-700 font-medium">
                20 oct. 2026 <span className="block text-[11px] text-slate-400 font-mono">11:00</span>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-xs">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Emma Leroy</span>
                    <span className="text-[10px] text-slate-400 font-mono">(Apprenante)</span>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-slate-800 font-medium">Difficultés</td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 backdrop-blur-xs">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Réalisé</span>
                </span>
              </td>
              <td className="py-4 px-4 text-right text-slate-400">⋮</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal Nouvel Entretien en verre translucide */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Planifier un entretien</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Motif de l'entretien</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Apprenant ou Formateur</label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date et heure</label>
                <input
                  type="text"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold shadow-xs transition"
                >
                  Planifier l'entretien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewsPage;
