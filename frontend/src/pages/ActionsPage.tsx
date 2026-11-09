import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, ChevronDown, CheckCircle2, Clock, 
  AlertCircle, X 
} from 'lucide-react';
import { ActionStatus, ActionPriority } from '../types';

export const ActionsPage: React.FC = () => {
  const { actions, addAction, updateActionStatus } = useApp();

  const [selectedPromo, setSelectedPromo] = useState('all');
  const [selectedAssignee, setSelectedAssignee] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formulaire Nouvelle Action
  const [formData, setFormData] = useState({
    title: '',
    studentName: 'Sophie Martin',
    dueDate: '2025-11-25',
    priority: 'high' as ActionPriority,
    status: 'todo' as ActionStatus
  });

  const columns = [
    {
      id: 'todo' as ActionStatus,
      title: 'À faire',
      count: 7,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50/70',
      borderColor: 'border-rose-100',
      icon: AlertCircle
    },
    {
      id: 'in_progress' as ActionStatus,
      title: 'En cours',
      count: 14,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50/70',
      borderColor: 'border-blue-100',
      icon: Clock
    },
    {
      id: 'completed' as ActionStatus,
      title: 'Clôturées',
      count: 12,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50/70',
      borderColor: 'border-emerald-100',
      icon: CheckCircle2
    }
  ];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    addAction({
      title: formData.title,
      description: `Action de coordination pour ${formData.studentName}`,
      promotionId: 'promo-dw-2025',
      assigneeId: 'tr-01',
      priority: formData.priority,
      dueDate: formData.dueDate
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Actions correctives</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivez les actions et leur avancement.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 bg-[#6E56CF] hover:bg-[#5E47BE] text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle action</span>
        </button>
      </div>

      {/* Barre de Filtres Dropdowns (conforme à la maquette) */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <select
            value={selectedPromo}
            onChange={(e) => setSelectedPromo(e.target.value)}
            className="appearance-none bg-white text-xs text-slate-700 font-medium pl-3.5 pr-8 py-2 rounded-xl border border-slate-200/90 shadow-2xs outline-none cursor-pointer hover:bg-slate-50 transition"
          >
            <option value="all">Toutes les promotions</option>
            <option value="dw">Développeur Web - 2025</option>
            <option value="tsrs">Technicien Systèmes & Réseaux</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="appearance-none bg-white text-xs text-slate-700 font-medium pl-3.5 pr-8 py-2 rounded-xl border border-slate-200/90 shadow-2xs outline-none cursor-pointer hover:bg-slate-50 transition"
          >
            <option value="all">Tous les responsables</option>
            <option value="samir">Samir Derardja</option>
            <option value="thomas">Thomas Moreau</option>
            <option value="lea">Léa Moreau</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="appearance-none bg-white text-xs text-slate-700 font-medium pl-3.5 pr-8 py-2 rounded-xl border border-slate-200/90 shadow-2xs outline-none cursor-pointer hover:bg-slate-50 transition"
          >
            <option value="all">Tous les statuts</option>
            <option value="todo">À faire</option>
            <option value="in_progress">En cours</option>
            <option value="completed">Clôturées</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Colonnes Kanban (3 Colonnes de l'image) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {columns.map((col) => {
          const colActions = actions.filter(a => {
            if (col.id === 'todo') return a.status === 'todo';
            if (col.id === 'in_progress') return a.status === 'in_progress' || a.status === 'waiting';
            return a.status === 'completed';
          });

          return (
            <div 
              key={col.id} 
              className="bg-[#F8F9FD] rounded-2xl p-4 border border-slate-200/60 flex flex-col justify-between min-h-[500px]"
            >
              <div>
                {/* Header de la colonne */}
                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      col.id === 'todo' ? 'bg-rose-500' :
                      col.id === 'in_progress' ? 'bg-blue-500' : 'bg-emerald-500'
                    }`}></span>
                    <span className="text-xs font-bold text-slate-900">{col.title}</span>
                  </div>
                  <span className={`text-xs font-bold ${col.color}`}>
                    ({col.count})
                  </span>
                </div>

                {/* Cartes de la colonne */}
                <div className="space-y-3">
                  {colActions.map((action) => (
                    <div
                      key={action.id}
                      className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-[0_1px_4px_rgba(0,0,0,0.02)] hover:shadow-md transition"
                    >
                      <h4 className="text-xs font-bold text-slate-900">{action.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{action.studentName || 'Sophie Martin'}</p>
                      
                      <p className="text-[10px] text-slate-400 mt-1">
                        {col.id === 'completed' 
                          ? `Clôturée le ${action.dueDate}` 
                          : `Échéance : ${action.dueDate}`}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        {col.id === 'completed' ? (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Clôturée
                          </span>
                        ) : (
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            action.priority === 'high' || action.priority === 'urgent'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {action.priority === 'high' || action.priority === 'urgent' ? 'Haute' : 'Moyenne'}
                          </span>
                        )}

                        <div className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-slate-200">
                          <img 
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50" 
                            alt="Responsable"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bouton bas "+ Ajouter une action" */}
              <button
                onClick={() => {
                  setFormData({ ...formData, status: col.id });
                  setIsModalOpen(true);
                }}
                className="w-full mt-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-purple-600 hover:bg-white transition border border-dashed border-slate-200"
              >
                + Ajouter une action
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Créer une Action */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Nouvelle action corrective</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Titre de l'action</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Soutien en algorithmique"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Apprenant concerné</label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priorité</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as ActionPriority })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="high">Haute</option>
                    <option value="medium">Moyenne</option>
                    <option value="low">Basse</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Échéance</label>
                  <input
                    type="text"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>
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
                  Enregistrer l'action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
