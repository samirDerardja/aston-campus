import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Meeting } from '../types';
import {
  Plus, Check, Sparkles, Pencil, Trash2, X
} from 'lucide-react';

export const MeetingsPage: React.FC = () => {
  const {
    meetings,
    promotions,
    convertDecisionToAction,
    addMeeting,
    updateMeeting,
    deleteMeeting,
    addMeetingDecision,
    trainers,
    actions
  } = useApp();

  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(meetings[0]?.id || '');

  // Modal Create / Edit Meeting
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    promotionId: '',
    scheduledAt: new Date().toISOString().slice(0, 16),
    agenda: '',
    status: 'published' as Meeting['status'],
  });

  // Add decision form
  const [isDecisionFormOpen, setIsDecisionFormOpen] = useState(false);
  const [decisionForm, setDecisionForm] = useState({ topic: '', decision: '' });

  const activeMeeting = meetings.find(m => m.id === selectedMeetingId) || meetings[0];

  const openCreateModal = () => {
    setEditingMeeting(null);
    setFormData({
      title: '',
      promotionId: promotions[0]?.id || 'promo-dw-2025',
      scheduledAt: new Date().toISOString().slice(0, 16),
      agenda: '',
      status: 'published',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setFormData({
      title: meeting.title,
      promotionId: meeting.promotionId,
      scheduledAt: meeting.scheduledAt ? meeting.scheduledAt.slice(0, 16) : new Date().toISOString().slice(0, 16),
      agenda: meeting.agenda,
      status: meeting.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    const isoDate = formData.scheduledAt
      ? new Date(formData.scheduledAt).toISOString()
      : new Date().toISOString();

    if (editingMeeting) {
      const promo = promotions.find(p => p.id === formData.promotionId);
      updateMeeting(editingMeeting.id, {
        title: formData.title.trim(),
        promotionId: formData.promotionId,
        promotionName: promo?.name || editingMeeting.promotionName,
        scheduledAt: isoDate,
        agenda: formData.agenda.trim(),
        status: formData.status,
      });
    } else {
      addMeeting({
        title: formData.title.trim(),
        promotionId: formData.promotionId || promotions[0]?.id || 'promo-dw-2025',
        scheduledAt: isoDate,
        agenda: formData.agenda.trim() || 'Point de synchronisation',
      });
    }
    setIsModalOpen(false);
    setEditingMeeting(null);
  };

  const handleDelete = (meeting: Meeting, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Supprimer la réunion "${meeting.title}" ?`)) {
      deleteMeeting(meeting.id);
      if (selectedMeetingId === meeting.id) {
        setSelectedMeetingId('');
      }
    }
  };

  const handleAddDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMeeting || !decisionForm.topic.trim() || !decisionForm.decision.trim()) return;
    addMeetingDecision(activeMeeting.id, decisionForm.topic.trim(), decisionForm.decision.trim());
    setDecisionForm({ topic: '', decision: '' });
    setIsDecisionFormOpen(false);
  };

  const handleConvert = (decisionId: string, topic: string) => {
    if (!activeMeeting) return;
    const dueDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    convertDecisionToAction(
      activeMeeting.id,
      decisionId,
      topic,
      trainers[0]?.id || 'usr-coord-01',
      dueDate,
      'high'
    );
  };

  return (
    <div className="space-y-6">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Synchronisations Pédagogiques</h1>
          <p className="text-xs text-slate-500">
            Comités de promotion, réunions de concertation et transformation 1-clic des décisions en actions
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center space-x-2 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-extrabold px-5 py-2.5 rounded-2xl shadow-sm transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#00D084]" />
          <span>Nouvelle réunion</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des réunions */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Réunions enregistrées ({meetings.length})</h2>
          {meetings.length === 0 ? (
            <div className="p-6 rounded-xl border border-slate-200 bg-white text-center text-xs text-slate-400">
              Aucune réunion enregistrée.
            </div>
          ) : (
            meetings.map((meeting) => (
              <div
                key={meeting.id}
                onClick={() => setSelectedMeetingId(meeting.id)}
                className={`p-4 rounded-xl border transition cursor-pointer group ${
                  meeting.id === activeMeeting?.id
                    ? 'border-indigo-500 bg-white shadow-xs ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-semibold text-indigo-600">{meeting.promotionName}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 font-mono">
                      {new Date(meeting.scheduledAt).toLocaleDateString('fr-FR')}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); openEditModal(meeting); }}
                      title="Modifier"
                      className="p-1 text-slate-400 hover:text-slate-700 rounded"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(meeting, e)}
                      title="Supprimer"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{meeting.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{meeting.agenda}</p>
              </div>
            ))
          )}
        </div>

        {/* Détail de la réunion & Décisions */}
        <div className="lg:col-span-2 space-y-6">
          {activeMeeting && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    {activeMeeting.status}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 mt-1">{activeMeeting.title}</h2>
                  <p className="text-xs text-slate-500">
                    Promotion : <span className="font-semibold text-slate-700">{activeMeeting.promotionName}</span> • Organisé par {activeMeeting.organizerName}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <span className="block font-medium text-slate-900">
                    {new Date(activeMeeting.scheduledAt).toLocaleDateString('fr-FR', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                  <span>à {new Date(activeMeeting.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* Ordre du jour */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Ordre du jour</h3>
                <div className="p-3.5 bg-slate-50 rounded-lg text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                  {activeMeeting.agenda}
                </div>
              </div>

              {/* Décisions & Transformation 1-clic */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Décisions & Actions Correctives Générées
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Garantit la traçabilité complète de la décision prise jusqu'à son exécution
                    </p>
                  </div>
                  <button
                    onClick={() => setIsDecisionFormOpen(!isDecisionFormOpen)}
                    className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter une décision</span>
                  </button>
                </div>

                {isDecisionFormOpen && (
                  <form onSubmit={handleAddDecision} className="mb-4 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2.5 text-xs">
                    <input
                      type="text"
                      required
                      placeholder="Sujet / Thème de la décision..."
                      value={decisionForm.topic}
                      onChange={(e) => setDecisionForm({ ...decisionForm, topic: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                    />
                    <textarea
                      required
                      rows={2}
                      placeholder="Détail de la décision prise..."
                      value={decisionForm.decision}
                      onChange={(e) => setDecisionForm({ ...decisionForm, decision: e.target.value })}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                    />
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => setIsDecisionFormOpen(false)}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold"
                      >
                        Enregistrer la décision
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {activeMeeting.decisions.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Aucune décision consignée pour cette réunion.</p>
                  ) : (
                    activeMeeting.decisions.map((dec) => {
                      const linkedAction = actions.find(a => a.id === dec.convertedToActionId);
                      return (
                        <div key={dec.id} className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="text-[11px] font-bold text-slate-800">{dec.topic}</span>
                              <p className="text-xs text-slate-600 mt-0.5">{dec.decision}</p>
                            </div>

                            {dec.convertedToActionId ? (
                              <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                                <Check className="w-3.5 h-3.5" />
                                <span>Action #{linkedAction?.id || dec.convertedToActionId} créée</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => handleConvert(dec.id, dec.topic)}
                                className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-xs transition shrink-0"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                                <span>Convertir en action ➔</span>
                              </button>
                            )}
                          </div>

                          {linkedAction && (
                            <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 flex items-center justify-between">
                              <span>Responsable : {linkedAction.assigneeName}</span>
                              <span className="font-semibold text-indigo-600">Statut actuel : {linkedAction.status}</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Créer / Modifier Réunion */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                {editingMeeting ? 'Modifier la réunion' : 'Nouvelle réunion pédagogique'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Titre de la réunion *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Comité de suivi TSRS 2026"
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
                  <label className="block font-semibold text-slate-700 mb-1">Date et heure</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ordre du jour</label>
                <textarea
                  rows={3}
                  value={formData.agenda}
                  onChange={(e) => setFormData({ ...formData, agenda: e.target.value })}
                  placeholder="Points à aborder..."
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                />
              </div>

              {editingMeeting && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Meeting['status'] })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                  >
                    <option value="draft">Brouillon</option>
                    <option value="published">Publiée</option>
                    <option value="archived">Archivée</option>
                  </select>
                </div>
              )}

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
                  {editingMeeting ? 'Enregistrer' : 'Créer la réunion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


