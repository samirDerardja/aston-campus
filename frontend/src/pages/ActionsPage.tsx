import React, { useState } from 'react';
import { 
  Search, Plus, Calendar, CheckCircle2, ArrowRight, X, 
  GripVertical, Sparkles, RotateCcw, Pencil, Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActionItem, ActionPriority, ActionStatus } from '../types';

export const ActionsPage: React.FC = () => {
  const { 
    promotions, actions, addAction, updateAction, 
    updateActionStatus, deleteAction 
  } = useApp();

  const [selectedPromo, setSelectedPromo] = useState('all');
  const [selectedResponsible, setSelectedResponsible] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActionId, setEditingActionId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPromoId, setNewPromoId] = useState(promotions[0]?.id || '33333333-0000-0000-0000-000000000001');
  const [newResponsible, setNewResponsible] = useState('Samir Derardja');
  const [newPriority, setNewPriority] = useState<ActionPriority>('high');
  const [newDueDate, setNewDueDate] = useState('2026-11-20');

  const [draggedActionId, setDraggedActionId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<'todo' | 'in_progress' | 'completed' | null>(null);

  const priorityLabel = (p: ActionPriority) => {
    if (p === 'urgent' || p === 'high') return 'Haute';
    if (p === 'medium') return 'Moyenne';
    return 'Basse';
  };

  const getInitials = (name?: string) => {
    if (!name) return 'SD';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredActions = actions.filter((a) => {
    const promoLabel = a.promotionName || '';
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                          promoLabel.toLowerCase().includes(search.toLowerCase()) ||
                          (a.studentName || '').toLowerCase().includes(search.toLowerCase());
    const matchesPromo = selectedPromo === 'all' || a.promotionId === selectedPromo || promoLabel.includes(selectedPromo);
    const matchesResp = selectedResponsible === 'all' || a.assigneeName === selectedResponsible;
    const matchesPriority = selectedPriority === 'all' || priorityLabel(a.priority) === selectedPriority;
    return matchesSearch && matchesPromo && matchesResp && matchesPriority;
  });

  const todoActions = filteredActions.filter((a) => a.status === 'todo');
  const inProgressActions = filteredActions.filter((a) => a.status === 'in_progress' || a.status === 'waiting');
  const completedActions = filteredActions.filter((a) => a.status === 'completed');

  const moveAction = (id: string, newStatus: ActionStatus) => {
    updateActionStatus(id, newStatus);
  };

  const openCreateModal = () => {
    setEditingActionId(null);
    setNewTitle('');
    setNewDescription('');
    setNewPromoId(promotions[0]?.id || '');
    setNewResponsible('Samir Derardja');
    setNewPriority('high');
    setNewDueDate('2026-11-20');
    setIsModalOpen(true);
  };

  const openEditModal = (act: ActionItem) => {
    setEditingActionId(act.id);
    setNewTitle(act.title);
    setNewDescription(act.description || '');
    setNewPromoId(act.promotionId || promotions[0]?.id || '');
    setNewResponsible(act.assigneeName || 'Samir Derardja');
    setNewPriority(act.priority);
    setNewDueDate(act.dueDate || '2026-11-20');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Supprimer l'action "${title}" ?`)) {
      await deleteAction(id);
    }
  };

  const handleSaveAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const promo = promotions.find(p => p.id === newPromoId);

    if (editingActionId) {
      await updateAction(editingActionId, {
        title: newTitle.trim(),
        description: newDescription.trim(),
        promotionId: newPromoId,
        promotionName: promo ? promo.name : 'Promotion',
        assigneeName: newResponsible,
        priority: newPriority,
        dueDate: newDueDate,
      });
    } else {
      addAction({
        title: newTitle.trim(),
        description: newDescription.trim() || `Suivi pédagogique (${promo?.name || 'Campus'})`,
        promotionId: newPromoId,
        assigneeId: 'usr-samir-01',
        priority: newPriority,
        dueDate: newDueDate,
      });
    }

    setIsModalOpen(false);
  };

  const renderCard = (act: ActionItem, col: 'todo' | 'in_progress' | 'completed') => {
    const prioText = priorityLabel(act.priority);
    const isCompleted = col === 'completed';

    return (
      <div
        key={act.id}
        draggable={true}
        onDragStart={(e) => {
          setDraggedActionId(act.id);
          e.dataTransfer.setData('text/plain', act.id);
          e.dataTransfer.effectAllowed = 'move';
        }}
        onDragEnd={() => {
          setDraggedActionId(null);
          setDragOverColumn(null);
        }}
        className={`${isCompleted ? 'bg-white/70 backdrop-blur-md border-white/80 opacity-90 hover:opacity-100' : 'glass-card'} p-4 rounded-2xl border space-y-3 cursor-grab active:cursor-grabbing transition-all duration-150 select-none group/card ${
          draggedActionId === act.id
            ? 'opacity-30 scale-95 border-2 border-dashed border-slate-800 rotate-1 shadow-lg'
            : 'hover:-translate-y-0.5 hover:shadow-md'
        }`}
      >
        <div className="flex items-start justify-between">
          {isCompleted ? (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
              Terminée
            </span>
          ) : (
            <span
              className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md font-mono ${
                prioText === 'Haute'
                  ? 'bg-rose-50 text-[#F43F5E] border border-rose-200/80'
                  : prioText === 'Moyenne'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {prioText}
            </span>
          )}

          <div className="flex items-center space-x-1 text-slate-400">
            <span className="text-[11px] font-mono flex items-center space-x-1 mr-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              <span>{act.dueDate}</span>
            </span>
            <button
              type="button"
              onClick={() => openEditModal(act)}
              title="Modifier l'action"
              className="p-1 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition"
            >
              <Pencil className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => handleDelete(act.id, act.title)}
              title="Supprimer l'action"
              className="p-1 rounded-md hover:bg-rose-50 hover:text-rose-600 transition"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover/card:text-slate-700 transition cursor-grab" />
          </div>
        </div>

        <div>
          <h4 className={`text-xs font-bold leading-snug ${isCompleted ? 'text-slate-700 line-through decoration-slate-400' : 'text-slate-900'}`}>
            {act.title}
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {act.promotionName || 'Campus Aston'} {act.studentName ? `• ${act.studentName}` : ''}
          </p>
        </div>

        {act.description && !isCompleted && (
          <p className="text-[11px] text-slate-600 bg-white/70 p-2.5 rounded-xl border border-white/90 shadow-2xs line-clamp-2">
            {act.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-white/60">
          <div className="flex items-center space-x-2">
            <div className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center font-mono shadow-2xs ${
              isCompleted ? 'bg-slate-200 text-slate-700' : 'bg-[#0F172A] text-white'
            }`}>
              {getInitials(act.assigneeName)}
            </div>
            <span className="text-[11px] font-medium text-slate-600">{act.assigneeName || 'Samir Derardja'}</span>
          </div>

          {col === 'todo' && (
            <button
              onClick={() => moveAction(act.id, 'in_progress')}
              className="text-[11px] font-bold text-[#00A86B] hover:text-[#00D084] flex items-center space-x-0.5 transition"
            >
              <span>Lancer</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
          {col === 'in_progress' && (
            <button
              onClick={() => moveAction(act.id, 'completed')}
              className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-0.5 transition"
            >
              <span>Clôturer</span>
              <CheckCircle2 className="w-3 h-3" />
            </button>
          )}
          {col === 'completed' && (
            <button
              onClick={() => moveAction(act.id, 'in_progress')}
              title="Rouvrir et repasser En cours"
              className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 flex items-center space-x-1 transition"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Rouvrir</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* En-tête avec bouton de création de luxe */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
              Actions Correctives
            </h1>
            <span className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold font-mono">
              <Sparkles className="w-3 h-3 text-[#00D084]" />
              <span>Glisser-Déposer actif</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pilotage pédagogique • Glissez-déposez les cartes entre les colonnes pour changer leur statut en temps réel
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-extrabold text-xs shadow-[0_4px_16px_rgba(15,23,42,0.2)] transition-all hover:scale-102 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-[#00D084]" />
          <span>Nouvelle action</span>
        </button>
      </div>

      {/* Barre de filtres en verre translucide */}
      <div className="glass-panel p-3.5 rounded-3xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une action, un apprenant, une promo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/70 hover:bg-white focus:bg-white text-xs pl-9 pr-3.5 py-2.5 rounded-2xl border border-white/90 outline-none focus:border-slate-800 transition shadow-2xs placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <select
            value={selectedPromo}
            onChange={(e) => setSelectedPromo(e.target.value)}
            className="bg-white/80 border border-white/90 rounded-2xl px-3.5 py-2 font-semibold text-slate-700 text-xs outline-none cursor-pointer hover:bg-white shadow-2xs"
          >
            <option value="all">Toutes les promotions</option>
            {promotions.map(p => (
              <option key={p.id} value={p.id}>{p.code} • {p.name}</option>
            ))}
          </select>

          <select
            value={selectedResponsible}
            onChange={(e) => setSelectedResponsible(e.target.value)}
            className="bg-white/80 border border-white/90 rounded-2xl px-3.5 py-2 font-semibold text-slate-700 text-xs outline-none cursor-pointer hover:bg-white shadow-2xs"
          >
            <option value="all">Tous les responsables</option>
            <option value="Samir Derardja">Samir Derardja</option>
            <option value="Claire Dubois">Claire Dubois</option>
            <option value="Sarah Martin">Sarah Martin</option>
            <option value="Mourad">Mourad</option>
            <option value="Christelle">Christelle</option>
            <option value="Mehdi">Mehdi</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-white/80 border border-white/90 rounded-2xl px-3.5 py-2 font-semibold text-slate-700 text-xs outline-none cursor-pointer hover:bg-white shadow-2xs"
          >
            <option value="all">Toutes priorités</option>
            <option value="Haute">Priorité Haute</option>
            <option value="Moyenne">Priorité Moyenne</option>
            <option value="Basse">Priorité Basse</option>
          </select>
        </div>
      </div>

      {/* 3 Colonnes Kanban avec Drag & Drop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {/* COLONNE 1 : À faire */}
        <div 
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (dragOverColumn !== 'todo') setDragOverColumn('todo');
          }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              if (dragOverColumn === 'todo') setDragOverColumn(null);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain') || draggedActionId;
            if (id) moveAction(id, 'todo');
            setDraggedActionId(null);
            setDragOverColumn(null);
          }}
          className={`p-4 rounded-3xl border transition-all duration-200 space-y-3 min-h-[580px] ${
            dragOverColumn === 'todo'
              ? 'bg-slate-100/95 border-slate-700 ring-2 ring-slate-800/30 shadow-xl scale-[1.01]'
              : 'bg-white/45 backdrop-blur-xl border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'
          }`}
        >
          <div className="flex items-center justify-between px-1 mb-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
              <h3 className="font-extrabold text-slate-900 text-xs tracking-wide">
                À faire ({todoActions.length})
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-700 bg-white/80 border border-slate-200/60 px-2.5 py-0.5 rounded-full font-mono shadow-2xs">
              À planifier
            </span>
          </div>

          {draggedActionId && (
            <div className={`p-3 rounded-2xl border-2 border-dashed text-center text-xs font-bold transition-all ${
              dragOverColumn === 'todo'
                ? 'border-slate-800 bg-white text-slate-900 shadow-xs'
                : 'border-slate-300 text-slate-400 bg-white/40'
            }`}>
              {dragOverColumn === 'todo' ? '✓ Déposer ici pour placer dans "À faire"' : 'Glisser ici (À faire)'}
            </div>
          )}

          <div className="space-y-3">
            {todoActions.map((act) => renderCard(act, 'todo'))}
          </div>
        </div>

        {/* COLONNE 2 : En cours */}
        <div 
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (dragOverColumn !== 'in_progress') setDragOverColumn('in_progress');
          }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              if (dragOverColumn === 'in_progress') setDragOverColumn(null);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain') || draggedActionId;
            if (id) moveAction(id, 'in_progress');
            setDraggedActionId(null);
            setDragOverColumn(null);
          }}
          className={`p-4 rounded-3xl border transition-all duration-200 space-y-3 min-h-[580px] ${
            dragOverColumn === 'in_progress'
              ? 'bg-emerald-50/85 border-[#00D084] ring-2 ring-[#00D084]/40 shadow-xl scale-[1.01]'
              : 'bg-white/45 backdrop-blur-xl border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'
          }`}
        >
          <div className="flex items-center justify-between px-1 mb-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00D084] shadow-sm shadow-[#00D084]/50 animate-pulse"></span>
              <h3 className="font-extrabold text-slate-900 text-xs tracking-wide">
                En cours ({inProgressActions.length})
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-[#00D084]/15 border border-[#00D084]/25 px-2.5 py-0.5 rounded-full font-mono shadow-2xs">
              Suivi actif
            </span>
          </div>

          {draggedActionId && (
            <div className={`p-3 rounded-2xl border-2 border-dashed text-center text-xs font-bold transition-all ${
              dragOverColumn === 'in_progress'
                ? 'border-[#00D084] bg-emerald-100 text-emerald-900 shadow-xs'
                : 'border-emerald-300/60 text-emerald-700/70 bg-emerald-50/30'
            }`}>
              {dragOverColumn === 'in_progress' ? '✓ Déposer ici pour passer "En cours"' : 'Glisser ici (En cours)'}
            </div>
          )}

          <div className="space-y-3">
            {inProgressActions.map((act) => renderCard(act, 'in_progress'))}
          </div>
        </div>

        {/* COLONNE 3 : Clôturées */}
        <div 
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (dragOverColumn !== 'completed') setDragOverColumn('completed');
          }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              if (dragOverColumn === 'completed') setDragOverColumn(null);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain') || draggedActionId;
            if (id) moveAction(id, 'completed');
            setDraggedActionId(null);
            setDragOverColumn(null);
          }}
          className={`p-4 rounded-3xl border transition-all duration-200 space-y-3 min-h-[580px] ${
            dragOverColumn === 'completed'
              ? 'bg-indigo-50/85 border-indigo-500 ring-2 ring-indigo-500/40 shadow-xl scale-[1.01]'
              : 'bg-white/45 backdrop-blur-xl border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)]'
          }`}
        >
          <div className="flex items-center justify-between px-1 mb-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="font-extrabold text-slate-900 text-xs tracking-wide">
                Clôturées ({completedActions.length})
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono shadow-2xs">
              Validées
            </span>
          </div>

          {draggedActionId && (
            <div className={`p-3 rounded-2xl border-2 border-dashed text-center text-xs font-bold transition-all ${
              dragOverColumn === 'completed'
                ? 'border-indigo-600 bg-indigo-100 text-indigo-900 shadow-xs'
                : 'border-indigo-300/60 text-indigo-700/70 bg-indigo-50/30'
            }`}>
              {dragOverColumn === 'completed' ? '✓ Déposer ici pour Clôturer l\'action' : 'Glisser ici (Clôturées)'}
            </div>
          )}

          <div className="space-y-3">
            {completedActions.map((act) => renderCard(act, 'completed'))}
          </div>
        </div>
      </div>

      {/* Modal : Création / Édition Action Corrective */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                {editingActionId ? 'Modifier l\'Action Corrective' : 'Nouvelle Action Corrective'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAction} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Intitulé de l'action *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Point assiduité tuteur Helpline"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Description / Notes de suivi
                </label>
                <textarea
                  rows={2}
                  placeholder="Précisez le plan d'action..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Promotion
                </label>
                <select
                  value={newPromoId}
                  onChange={(e) => setNewPromoId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 outline-none"
                >
                  {promotions.map(p => (
                    <option key={p.id} value={p.id}>{p.code} • {p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Responsable
                  </label>
                  <select
                    value={newResponsible}
                    onChange={(e) => setNewResponsible(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 outline-none"
                  >
                    <option value="Samir Derardja">Samir Derardja</option>
                    <option value="Claire Dubois">Claire Dubois</option>
                    <option value="Sarah Martin">Sarah Martin</option>
                    <option value="Mourad">Mourad</option>
                    <option value="Christelle">Christelle</option>
                    <option value="Mehdi">Mehdi</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Priorité
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as ActionPriority)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 outline-none"
                  >
                    <option value="urgent">Urgente</option>
                    <option value="high">Haute</option>
                    <option value="medium">Moyenne</option>
                    <option value="low">Basse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Échéance
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 outline-none font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#0F172A] text-white font-extrabold hover:bg-[#1E293B] transition"
                >
                  {editingActionId ? 'Enregistrer' : 'Créer l\'action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionsPage;
