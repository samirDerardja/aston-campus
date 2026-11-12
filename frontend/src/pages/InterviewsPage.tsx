import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Interview } from '../types';
import {
  Plus, Search, ChevronDown, CheckCircle2, Clock,
  X, Pencil, Trash2, FileText, XCircle
} from 'lucide-react';

export const InterviewsPage: React.FC = () => {
  const {
    interviews,
    students,
    promotions,
    addInterview,
    updateInterview,
    updateInterviewReport,
    deleteInterview
  } = useApp();

  const [filterPill, setFilterPill] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [promoFilter, setPromoFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Modal Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const [formData, setFormData] = useState({
    title: "Point d'étape",
    type: 'apprenant_individuel' as Interview['type'],
    studentId: '',
    promotionId: '',
    scheduledAt: new Date().toISOString().slice(0, 16),
    location: 'Bureau Coordination B201',
    status: 'scheduled' as Interview['status'],
  });

  // Modal Report
  const [reportInterview, setReportInterview] = useState<Interview | null>(null);
  const [reportForm, setReportForm] = useState({
    summary: '',
    academicProgress: '',
    companyIntegration: '',
    difficultiesIdentified: '',
    recommendations: '',
    isFinalized: false,
  });

  const counts = useMemo(() => ({
    all: interviews.length,
    scheduled: interviews.filter(i => i.status === 'scheduled').length,
    completed: interviews.filter(i => i.status === 'completed').length,
    cancelled: interviews.filter(i => i.status === 'cancelled').length,
  }), [interviews]);

  const pills = [
    { id: 'all', label: `Tous (${counts.all})` },
    { id: 'scheduled', label: `À venir (${counts.scheduled})` },
    { id: 'completed', label: `Réalisés (${counts.completed})` },
    { id: 'cancelled', label: `Annulés (${counts.cancelled})` },
  ];

  const filteredInterviews = useMemo(() => {
    return interviews.filter((interview) => {
      if (filterPill !== 'all' && interview.status !== filterPill) return false;
      if (promoFilter !== 'all' && interview.promotionId !== promoFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const student = students.find(s => s.id === interview.studentId);
        const studentName = student ? `${student.firstName} ${student.lastName}`.toLowerCase() : '';
        const promo = promotions.find(p => p.id === interview.promotionId)?.name.toLowerCase() || '';
        if (
          !interview.title.toLowerCase().includes(q) &&
          !studentName.includes(q) &&
          !promo.includes(q) &&
          !(interview.location || '').toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [interviews, filterPill, promoFilter, search, students, promotions]);

  const openCreateModal = () => {
    setEditingInterview(null);
    setFormData({
      title: "Point d'étape",
      type: 'apprenant_individuel',
      studentId: students[0]?.id || '',
      promotionId: promotions[0]?.id || 'promo-dw-2025',
      scheduledAt: new Date().toISOString().slice(0, 16),
      location: 'Bureau Coordination B201',
      status: 'scheduled',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (interview: Interview) => {
    setEditingInterview(interview);
    setFormData({
      title: interview.title,
      type: interview.type,
      studentId: interview.studentId || '',
      promotionId: interview.promotionId || '',
      scheduledAt: interview.scheduledAt ? interview.scheduledAt.slice(0, 16) : new Date().toISOString().slice(0, 16),
      location: interview.location || '',
      status: interview.status,
    });
    setIsModalOpen(true);
  };

  const openReportModal = (interview: Interview) => {
    setReportInterview(interview);
    setReportForm({
      summary: interview.report?.summary || '',
      academicProgress: interview.report?.academicProgress || '',
      companyIntegration: interview.report?.companyIntegration || '',
      difficultiesIdentified: interview.report?.difficultiesIdentified || '',
      recommendations: interview.report?.recommendations || '',
      isFinalized: interview.report?.isFinalized || false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    const isoDate = formData.scheduledAt
      ? new Date(formData.scheduledAt).toISOString()
      : new Date().toISOString();

    if (editingInterview) {
      updateInterview(editingInterview.id, {
        title: formData.title.trim(),
        type: formData.type,
        studentId: formData.studentId || undefined,
        promotionId: formData.promotionId,
        scheduledAt: isoDate,
        location: formData.location.trim(),
        status: formData.status,
      });
    } else {
      addInterview({
        title: formData.title.trim(),
        type: formData.type,
        studentId: formData.studentId || undefined,
        promotionId: formData.promotionId || promotions[0]?.id || 'promo-dw-2025',
        scheduledAt: isoDate,
        location: formData.location.trim() || 'Bureau Coordination B201',
      });
    }
    setIsModalOpen(false);
    setEditingInterview(null);
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportInterview) return;
    updateInterviewReport(reportInterview.id, reportForm);
    setReportInterview(null);
  };

  const handleDelete = (interview: Interview) => {
    if (window.confirm(`Supprimer l'entretien "${interview.title}" ?`)) {
      deleteInterview(interview.id);
    }
  };

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return {
        date: d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
    } catch {
      return { date: iso, time: '' };
    }
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
          onClick={openCreateModal}
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
            onClick={() => setFilterPill(pill.id as typeof filterPill)}
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
            placeholder="Rechercher un apprenant, motif, lieu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white/70 border border-white/90 rounded-2xl outline-none focus:border-slate-800 shadow-2xs transition"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative">
            <select
              value={promoFilter}
              onChange={(e) => setPromoFilter(e.target.value)}
              className="appearance-none bg-white/80 text-xs text-slate-700 font-semibold pl-4 pr-9 py-2.5 rounded-2xl border border-white/90 shadow-2xs outline-none cursor-pointer hover:bg-white"
            >
              <option value="all">Toutes les promotions</option>
              {promotions.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
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
              <th className="py-4 px-6">Apprenant / Promo</th>
              <th className="py-4 px-6">Motif & Lieu</th>
              <th className="py-4 px-6">Statut</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/50">
            {filteredInterviews.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  Aucun entretien trouvé.
                </td>
              </tr>
            ) : (
              filteredInterviews.map((interview) => {
                const { date, time } = formatDate(interview.scheduledAt);
                const student = students.find(s => s.id === interview.studentId);
                const promo = promotions.find(p => p.id === interview.promotionId);

                return (
                  <tr key={interview.id} className="hover:bg-white/60 transition">
                    <td className="py-4 px-6 text-slate-700 font-medium">
                      {date} <span className="block text-[11px] text-slate-400 font-mono">{time}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-bold text-slate-900 block">
                          {student ? `${student.firstName} ${student.lastName}` : 'Suivi collectif / Formateur'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {promo ? promo.name : interview.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-800 font-medium block">{interview.title}</span>
                      <span className="text-[10px] text-slate-400">{interview.location || 'Campus Aston'}</span>
                    </td>
                    <td className="py-4 px-6">
                      {interview.status === 'completed' ? (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 backdrop-blur-xs">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Réalisé</span>
                        </span>
                      ) : interview.status === 'cancelled' ? (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-700 border border-rose-500/20 backdrop-blur-xs">
                          <XCircle className="w-3 h-3 text-rose-500" />
                          <span>Annulé</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-700 border border-blue-500/20 backdrop-blur-xs">
                          <Clock className="w-3 h-3 text-blue-500" />
                          <span>À venir</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center space-x-1">
                        <button
                          onClick={() => openReportModal(interview)}
                          title="Compte-rendu"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openEditModal(interview)}
                          title="Modifier"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-white transition"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(interview)}
                          title="Supprimer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Créer / Modifier Entretien */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">
                {editingInterview ? "Modifier l'entretien" : 'Planifier un entretien'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Motif de l'entretien *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as Interview['type'] })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                  >
                    <option value="apprenant_individuel">Apprenant individuel</option>
                    <option value="formateur_point">Suivi formateur</option>
                    <option value="point_pedagogique">Point pédagogique</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

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
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Apprenant concerné</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                >
                  <option value="">-- Aucun / Entretien équipe --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Date et heure</label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lieu</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              {editingInterview && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Interview['status'] })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                  >
                    <option value="scheduled">À venir</option>
                    <option value="completed">Réalisé</option>
                    <option value="postponed">Reporté</option>
                    <option value="cancelled">Annulé</option>
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
                  {editingInterview ? 'Enregistrer' : "Planifier l'entretien"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Compte-rendu */}
      {reportInterview && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Compte-rendu : {reportInterview.title}</h2>
              <button onClick={() => setReportInterview(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="p-6 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Synthèse *</label>
                <textarea
                  required
                  rows={3}
                  value={reportForm.summary}
                  onChange={(e) => setReportForm({ ...reportForm, summary: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Progression académique</label>
                  <input
                    type="text"
                    value={reportForm.academicProgress}
                    onChange={(e) => setReportForm({ ...reportForm, academicProgress: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Intégration entreprise</label>
                  <input
                    type="text"
                    value={reportForm.companyIntegration}
                    onChange={(e) => setReportForm({ ...reportForm, companyIntegration: e.target.value })}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Difficultés identifiées</label>
                <input
                  type="text"
                  value={reportForm.difficultiesIdentified}
                  onChange={(e) => setReportForm({ ...reportForm, difficultiesIdentified: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Recommandations</label>
                <input
                  type="text"
                  value={reportForm.recommendations}
                  onChange={(e) => setReportForm({ ...reportForm, recommendations: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                />
              </div>
              <label className="flex items-center space-x-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reportForm.isFinalized}
                  onChange={(e) => setReportForm({ ...reportForm, isFinalized: e.target.checked })}
                  className="rounded border-slate-300"
                />
                <span className="font-semibold text-slate-700">Finaliser le compte-rendu (marquer l'entretien comme Réalisé)</span>
              </label>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setReportInterview(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold shadow-xs transition"
                >
                  Enregistrer le compte-rendu
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
