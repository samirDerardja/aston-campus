import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CalendarCheck, Plus, Search, Filter, Calendar, MapPin, 
  User, CheckCircle, Clock, X, FileText, AlertCircle 
} from 'lucide-react';
import { InterviewType } from '../types';

export const InterviewsPage: React.FC = () => {
  const { interviews, promotions, students, trainers, addInterview, updateInterviewReport } = useApp();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeReportInterview, setActiveReportInterview] = useState<any | null>(null);

  // Formulaire Nouvel Entretien
  const [formData, setFormData] = useState({
    title: '',
    type: 'apprenant_individuel' as InterviewType,
    promotionId: promotions[0]?.id || '',
    studentId: students[0]?.id || '',
    trainerId: '',
    scheduledAt: '2026-11-18T10:00',
    location: 'Bureau Coordination B201'
  });

  // Formulaire Compte Rendu
  const [reportForm, setReportForm] = useState({
    summary: '',
    academicProgress: '',
    companyIntegration: '',
    difficultiesIdentified: '',
    recommendations: '',
    isFinalized: true
  });

  const filteredInterviews = interviews.filter(i => {
    const matchesSearch = 
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      (i.studentName && i.studentName.toLowerCase().includes(search.toLowerCase())) ||
      i.promotionName.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || i.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.promotionId) return;

    addInterview({
      title: formData.title,
      type: formData.type,
      scheduledAt: new Date(formData.scheduledAt).toISOString(),
      promotionId: formData.promotionId,
      studentId: formData.type === 'formateur_point' ? undefined : formData.studentId,
      trainerId: formData.type === 'formateur_point' ? formData.trainerId : undefined,
      location: formData.location
    });

    setIsModalOpen(false);
  };

  const handleOpenReportModal = (interview: any) => {
    setActiveReportInterview(interview);
    if (interview.report) {
      setReportForm({
        summary: interview.report.summary || '',
        academicProgress: interview.report.academicProgress || '',
        companyIntegration: interview.report.companyIntegration || '',
        difficultiesIdentified: interview.report.difficultiesIdentified || '',
        recommendations: interview.report.recommendations || '',
        isFinalized: interview.report.isFinalized ?? true
      });
    } else {
      setReportForm({
        summary: 'Entretien individuel de suivi réalisé au campus.',
        academicProgress: 'Bonne assimilation des travaux pratiques.',
        companyIntegration: 'Retour d entreprise satisfaisant.',
        difficultiesIdentified: 'Rien à signaler d anormal.',
        recommendations: 'Poursuivre sur cette dynamique.',
        isFinalized: true
      });
    }
  };

  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReportInterview) return;

    updateInterviewReport(activeReportInterview.id, reportForm);
    setActiveReportInterview(null);
  };

  return (
    <div className="space-y-6">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Entretiens Pédagogiques</h1>
          <p className="text-xs text-slate-500">
            Planification des points individuels, alertes assiduité et comptes rendus structurés
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Planifier un entretien</span>
        </button>
      </div>

      {/* Barre de Recherche & Filtres */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par titre, apprenant, promotion..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Tous les types d'entretiens</option>
            <option value="apprenant_individuel">Apprenant individuel</option>
            <option value="urgent">Entretien urgent</option>
            <option value="point_pedagogique">Point pédagogique</option>
            <option value="formateur_point">Point formateur</option>
          </select>
        </div>
      </div>

      {/* Liste des Entretiens */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInterviews.map((interview) => (
          <div
            key={interview.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-indigo-400 hover:shadow-subtle transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  interview.type === 'urgent' ? 'bg-rose-100 text-rose-700' :
                  interview.type === 'apprenant_individuel' ? 'bg-indigo-50 text-indigo-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {interview.type.replace('_', ' ')}
                </span>
                <span className={`text-[11px] font-medium flex items-center space-x-1 ${
                  interview.status === 'completed' ? 'text-emerald-600' : 'text-slate-500'
                }`}>
                  {interview.status === 'completed' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                  <span className="capitalize">{interview.status === 'completed' ? 'Réalisé' : 'À venir'}</span>
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900">{interview.title}</h3>
              <p className="text-xs text-indigo-600 font-medium mt-0.5">{interview.promotionName}</p>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center space-x-2">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-800">{interview.studentName || interview.trainerName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {new Date(interview.scheduledAt).toLocaleDateString('fr-FR', { 
                      day: 'numeric', month: 'long', year: 'numeric' 
                    })} à {new Date(interview.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{interview.location}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              {interview.report ? (
                <button
                  onClick={() => handleOpenReportModal(interview)}
                  className="text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md font-medium flex items-center space-x-1"
                >
                  <FileText className="w-3 h-3" />
                  <span>Compte rendu finalisé</span>
                </button>
              ) : (
                <button
                  onClick={() => handleOpenReportModal(interview)}
                  className="text-xs text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-md font-medium flex items-center space-x-1"
                >
                  <FileText className="w-3 h-3" />
                  <span>Saisir le compte rendu</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL PLANIFIER UN ENTRETIEN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Planifier un nouvel entretien</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNew} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Motif / Titre</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bilan d'intégration mi-semestre"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type d'entretien</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="apprenant_individuel">Apprenant individuel</option>
                    <option value="urgent">Urgent / Alerte</option>
                    <option value="point_pedagogique">Point pédagogique</option>
                    <option value="formateur_point">Point formateur</option>
                  </select>
                </div>

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
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Apprenant concerné</label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.companyName})</option>
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
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lieu / Visioconférence</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                  Enregistrer l'entretien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL COMPTE RENDU STRUCTURÉ */}
      {activeReportInterview && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Compte Rendu d'Entretien</h2>
                <p className="text-[11px] text-slate-500">{activeReportInterview.title} • {activeReportInterview.studentName}</p>
              </div>
              <button onClick={() => setActiveReportInterview(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Synthèse globale</label>
                <textarea
                  rows={2}
                  value={reportForm.summary}
                  onChange={(e) => setReportForm({ ...reportForm, summary: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Progression académique au campus</label>
                <textarea
                  rows={2}
                  value={reportForm.academicProgress}
                  onChange={(e) => setReportForm({ ...reportForm, academicProgress: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Intégration en entreprise / Retour tuteur</label>
                <textarea
                  rows={2}
                  value={reportForm.companyIntegration}
                  onChange={(e) => setReportForm({ ...reportForm, companyIntegration: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Recommandations & Actions convenues</label>
                <textarea
                  rows={2}
                  value={reportForm.recommendations}
                  onChange={(e) => setReportForm({ ...reportForm, recommendations: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reportForm.isFinalized}
                    onChange={(e) => setReportForm({ ...reportForm, isFinalized: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-slate-700 font-medium">Finaliser et horodater ce compte rendu</span>
                </label>

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-xs"
                >
                  Valider le compte rendu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
