import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckSquare, Plus, Search, Filter, LayoutGrid, List, 
  Clock, AlertTriangle, CheckCircle2, ChevronRight, X 
} from 'lucide-react';
import { ActionStatus, ActionPriority } from '../types';

export const ActionsPage: React.FC = () => {
  const { actions, promotions, students, trainers, updateActionStatus, addAction } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formulaire Nouvelle Action
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    promotionId: promotions[0]?.id || '',
    studentId: '',
    assigneeId: trainers[0]?.id || 'usr-coord-01',
    priority: 'medium' as ActionPriority,
    dueDate: '2026-11-20'
  });

  const columns: { id: ActionStatus; title: string; color: string }[] = [
    { id: 'todo', title: 'À faire', color: 'border-t-slate-400' },
    { id: 'in_progress', title: 'En cours', color: 'border-t-indigo-500' },
    { id: 'waiting', title: 'En attente', color: 'border-t-amber-500' },
    { id: 'completed', title: 'Terminées', color: 'border-t-emerald-500' },
    { id: 'cancelled', title: 'Annulées', color: 'border-t-rose-400' },
  ];

  const filteredActions = actions.filter(action => {
    const matchesSearch = 
      action.title.toLowerCase().includes(search.toLowerCase()) ||
      action.description.toLowerCase().includes(search.toLowerCase()) ||
      action.assigneeName.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || action.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.promotionId) return;

    addAction({
      title: formData.title,
      description: formData.description,
      promotionId: formData.promotionId,
      studentId: formData.studentId || undefined,
      assigneeId: formData.assigneeId,
      priority: formData.priority,
      dueDate: formData.dueDate
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Actions Correctives</h1>
          <p className="text-xs text-slate-500">
            Pilotage Kanban des plans d'action pédagogiques, alertes de retard et assignations
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md ${viewMode === 'kanban' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
              title="Vue Kanban"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md ${viewMode === 'table' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
              title="Vue Tableau"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle action</span>
          </button>
        </div>
      </div>

      {/* Barre de Recherche & Filtres */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par titre, responsable, détail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Toutes les priorités</option>
            <option value="urgent">Urgente</option>
            <option value="high">Haute</option>
            <option value="medium">Moyenne</option>
            <option value="low">Basse</option>
          </select>
        </div>
      </div>

      {/* VUE KANBAN */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {columns.map((col) => {
            const colActions = filteredActions.filter(a => a.status === col.id);
            return (
              <div 
                key={col.id} 
                className={`bg-slate-100/70 rounded-xl p-3 border border-slate-200/80 border-t-4 ${col.color} min-w-[240px] flex flex-col`}
              >
                <div className="flex items-center justify-between mb-3 px-1">
                  <span className="text-xs font-bold text-slate-800">{col.title}</span>
                  <span className="text-[11px] font-semibold bg-white border border-slate-200 px-1.5 py-0.2 rounded-full text-slate-600">
                    {colActions.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colActions.map((action) => {
                    const isOverdue = action.status !== 'completed' && action.status !== 'cancelled' && new Date(action.dueDate) < new Date();
                    return (
                      <div
                        key={action.id}
                        className={`bg-white p-3.5 rounded-lg border shadow-xs transition hover:shadow-subtle ${
                          isOverdue ? 'border-rose-300 ring-1 ring-rose-300' : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            action.priority === 'urgent' ? 'bg-rose-100 text-rose-700' :
                            action.priority === 'high' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {action.priority}
                          </span>

                          {/* Sélecteur de statut rapide */}
                          <select
                            value={action.status}
                            onChange={(e) => updateActionStatus(action.id, e.target.value as ActionStatus)}
                            className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1 py-0.5 text-slate-600 focus:outline-none"
                            title="Changer d'état Kanban"
                          >
                            <option value="todo">À faire</option>
                            <option value="in_progress">En cours</option>
                            <option value="waiting">En attente</option>
                            <option value="completed">Terminée</option>
                            <option value="cancelled">Annulée</option>
                          </select>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{action.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{action.description}</p>

                        <div className="mt-3 pt-2 border-t border-slate-100 text-[10px] space-y-1">
                          <div className="flex items-center justify-between text-slate-500">
                            <span>Resp: {action.assigneeName}</span>
                          </div>
                          <div className={`flex items-center justify-between font-semibold ${
                            isOverdue ? 'text-rose-600' : 'text-slate-600'
                          }`}>
                            <span className="flex items-center space-x-1">
                              {isOverdue && <AlertTriangle className="w-3 h-3 text-rose-500" />}
                              <span>{isOverdue ? 'En retard (' + action.dueDate + ')' : action.dueDate}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VUE TABLEAU */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Promotion</th>
                <th className="py-3 px-4">Responsable</th>
                <th className="py-3 px-4">Priorité</th>
                <th className="py-3 px-4">Échéance</th>
                <th className="py-3 px-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredActions.map((action) => {
                const isOverdue = action.status !== 'completed' && action.status !== 'cancelled' && new Date(action.dueDate) < new Date();
                return (
                  <tr key={action.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{action.title}</div>
                      <div className="text-[11px] text-slate-400">{action.description}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{action.promotionName}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{action.assigneeName}</td>
                    <td className="py-3 px-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        action.priority === 'urgent' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {action.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                        {action.dueDate}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={action.status}
                        onChange={(e) => updateActionStatus(action.id, e.target.value as ActionStatus)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 text-slate-700"
                      >
                        <option value="todo">À faire</option>
                        <option value="in_progress">En cours</option>
                        <option value="waiting">En attente</option>
                        <option value="completed">Terminée</option>
                        <option value="cancelled">Annulée</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL NOUVELLE ACTION */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Créer une action corrective</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Titre de l'action</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Planifier un atelier de soutien PowerShell"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description détaillée</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Objectif, livrables attendus..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Promotion</label>
                  <select
                    value={formData.promotionId}
                    onChange={(e) => setFormData({ ...formData, promotionId: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {promotions.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Responsable assigné</label>
                  <select
                    value={formData.assigneeId}
                    onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="usr-coord-01">Marc Lefèvre (Coordinateur)</option>
                    <option value="tr-01">Thomas Moreau (Formateur)</option>
                    <option value="tr-02">Julie Roux (Formatrice)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priorité</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as ActionPriority })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date d'échéance</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 shadow-xs"
                >
                  Créer l'action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
