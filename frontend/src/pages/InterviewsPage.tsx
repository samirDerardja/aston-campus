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
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Entretiens</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Planifiez, suivez et consultez les comptes rendus.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 bg-[#6E56CF] hover:bg-[#5E47BE] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvel entretien</span>
        </button>
      </div>

      {/* Rangée de Pills Horizontaux (exacte de la maquette) */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {pills.map((pill) => (
          <button
            key={pill.id}
            onClick={() => setFilterPill(pill.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              filterPill === pill.id
                ? 'bg-[#6E56CF] text-white shadow-sm font-semibold'
                : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Barre de Filtres Dropdowns & Recherche */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un apprenant, formateur..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-slate-200/90 rounded-xl outline-none focus:ring-1 focus:ring-purple-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative">
            <select className="appearance-none bg-white text-xs text-slate-700 font-medium pl-3.5 pr-8 py-2 rounded-xl border border-slate-200/90 shadow-2xs outline-none cursor-pointer hover:bg-slate-50">
              <option>Promotion</option>
              <option>Développeur Web - 2025</option>
              <option>TSRS - 2025</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select className="appearance-none bg-white text-xs text-slate-700 font-medium pl-3.5 pr-8 py-2 rounded-xl border border-slate-200/90 shadow-2xs outline-none cursor-pointer hover:bg-slate-50">
              <option>Période</option>
              <option>Novembre 2025</option>
              <option>Octobre 2025</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table des Entretiens (conforme pixel-perfect à l'image) */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF8FF]/60 border-b border-slate-100 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-6">Date</th>
              <th className="py-3 px-6">Apprenant / Formateur</th>
              <th className="py-3 px-6">Motif</th>
              <th className="py-3 px-6">Statut</th>
              <th className="py-3 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {/* Ligne 1 */}
            <tr className="hover:bg-slate-50/70 transition">
              <td className="py-4 px-6 text-slate-600 font-medium">
                12 nov. 2025 <span className="block text-[11px] text-slate-400">14:00</span>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-200">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Sophie Martin</span>
                    <span className="text-[10px] text-slate-400">(Apprenante)</span>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-slate-700 font-medium">Suivi pédagogique</td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span>À venir</span>
                </span>
              </td>
              <td className="py-4 px-4 text-right text-slate-400">⋮</td>
            </tr>

            {/* Ligne 2 */}
            <tr className="hover:bg-slate-50/70 transition">
              <td className="py-4 px-6 text-slate-600 font-medium">
                13 nov. 2025 <span className="block text-[11px] text-slate-400">10:00</span>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-200">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Thomas Dubois</span>
                    <span className="text-[10px] text-slate-400">(Apprenant)</span>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-slate-700 font-medium">Point d'étape</td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  <Clock className="w-3 h-3 text-blue-500" />
                  <span>À venir</span>
                </span>
              </td>
              <td className="py-4 px-4 text-right text-slate-400">⋮</td>
            </tr>

            {/* Ligne 3 */}
            <tr className="hover:bg-slate-50/70 transition">
              <td className="py-4 px-6 text-slate-600 font-medium">
                05 nov. 2025 <span className="block text-[11px] text-slate-400">15:00</span>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-200">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Julien Petit</span>
                    <span className="text-[10px] text-slate-400">(Formateur)</span>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-slate-700 font-medium">Point équipe</td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Réalisé</span>
                </span>
              </td>
              <td className="py-4 px-4 text-right text-slate-400">⋮</td>
            </tr>

            {/* Ligne 4 */}
            <tr className="hover:bg-slate-50/70 transition">
              <td className="py-4 px-6 text-slate-600 font-medium">
                20 oct. 2025 <span className="block text-[11px] text-slate-400">11:00</span>
              </td>
              <td className="py-4 px-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-200">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100" alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block">Emma Leroy</span>
                    <span className="text-[10px] text-slate-400">(Apprenante)</span>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 text-slate-700 font-medium">Difficultés</td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Réalisé</span>
                </span>
              </td>
              <td className="py-4 px-4 text-right text-slate-400">⋮</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Modal Nouvel Entretien */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Planifier un entretien</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Apprenant ou Formateur</label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date et heure</label>
                <input
                  type="text"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#6E56CF] text-white font-semibold hover:bg-[#5E47BE] shadow-xs"
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
