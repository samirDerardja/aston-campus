import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ChevronRight, Mail, Phone, MessageSquare, Check,
  Building2, Plus, X, AlertTriangle, Trash2
} from 'lucide-react';
import { computeStudentRisk } from '../utils/riskScore';
import { FeedbackAuthorRole, FeedbackCategory, FeedbackSentiment } from '../types';

export const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students, actions, interviews, documents, alerts, feedbacks, trainers, currentUser, addInterview, addAction, addFeedback, deleteFeedback } = useApp();

  const [activeTab, setActiveTab] = useState<'summary' | 'interviews' | 'actions' | 'feedbacks' | 'documents' | 'history'>('summary');
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);
  const [isActionOpen, setIsActionOpen] = useState(false);

  const [interviewTitle, setInterviewTitle] = useState("Point d'étape individuel");
  const [interviewDate, setInterviewDate] = useState(new Date().toISOString().slice(0, 16));
  const [actionTitle, setActionTitle] = useState('');
  const [actionPriority, setActionPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('high');

  // Formulaire Feedback terrain
  const [fbAuthor, setFbAuthor] = useState(`${currentUser.firstName} ${currentUser.lastName}`);
  const [fbRole, setFbRole] = useState<FeedbackAuthorRole>('formateur');
  const [fbSentiment, setFbSentiment] = useState<FeedbackSentiment>('neutral');
  const [fbCategory, setFbCategory] = useState<FeedbackCategory>('progression');
  const [fbComment, setFbComment] = useState('');

  const student = students.find(s => s.id === id) || students[0];
  if (!student) {
    return (
      <div className="glass-card p-8 rounded-3xl text-center text-xs text-slate-500">
        Aucun apprenant trouvé.
      </div>
    );
  }

  const studentActions = actions.filter(a => a.studentId === student.id);
  const openStudentActions = studentActions.filter(a => a.status !== 'completed' && a.status !== 'cancelled');
  const studentInterviews = interviews.filter(i => i.studentId === student.id);
  const studentDocs = documents.filter(d => d.studentId === student.id || d.promotionId === student.promotionId);
  const studentAlerts = alerts.filter(a => a.studentId === student.id);
  const studentFeedbacks = feedbacks.filter(f => f.studentId === student.id);
  const risk = computeStudentRisk(student, alerts, feedbacks);

  const handleCreateFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbComment.trim()) return;
    await addFeedback({
      studentId: student.id,
      studentName: `${student.firstName} ${student.lastName}`,
      promotionId: student.promotionId,
      promotionName: student.promotionName,
      authorName: fbAuthor.trim() || `${currentUser.firstName} ${currentUser.lastName}`,
      authorRole: fbRole,
      sentiment: fbSentiment,
      category: fbCategory,
      comment: fbComment.trim(),
    });
    setFbComment('');
  };

  const handleCreateInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewTitle.trim()) return;
    addInterview({
      title: interviewTitle.trim(),
      type: 'apprenant_individuel',
      scheduledAt: new Date(interviewDate).toISOString(),
      promotionId: student.promotionId,
      studentId: student.id,
      location: 'Bureau Coordination B201',
    });
    setIsInterviewOpen(false);
    setActiveTab('interviews');
  };

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionTitle.trim()) return;
    addAction({
      title: actionTitle.trim(),
      description: `Action de suivi pour ${student.firstName} ${student.lastName}`,
      promotionId: student.promotionId,
      studentId: student.id,
      assigneeId: trainers[0]?.id || 'usr-samir-01',
      priority: actionPriority,
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    });
    setActionTitle('');
    setIsActionOpen(false);
    setActiveTab('actions');
  };

  const attendancePct = Math.min(100, Math.max(0, student.attendanceRate ?? 92));

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-400">
        <button onClick={() => navigate('/apprenants')} className="hover:text-slate-800 transition">
          Apprenants
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-bold text-slate-900">Fiche apprenant</span>
      </div>

      {/* En-tête Fiche Apprenant en verre translucide de luxe */}
      <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white shadow-md shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" 
              alt={student.firstName + ' ' + student.lastName}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl font-extrabold text-slate-900">{student.firstName} {student.lastName}</h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#00D084]/15 text-emerald-800 border border-[#00D084]/30 font-mono">
                Actif
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-semibold">
              {student.promotionName} • {student.companyName} ({student.companyTutor})
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-[11px]">{student.email}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{student.phone}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{student.companyName}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsInterviewOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white border border-slate-200 text-slate-800 text-xs font-bold transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#00D084]" />
            <span>Entretien</span>
          </button>
          <button
            onClick={() => setIsActionOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-white/80 hover:bg-white border border-slate-200 text-slate-800 text-xs font-bold transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#00D084]" />
            <span>Action</span>
          </button>
          <a 
            href={`mailto:${student.email}?subject=Aston%20Campus%20-%20Suivi%20pédagogique`}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold transition shadow-[0_4px_14px_rgba(15,23,42,0.18)]"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#00D084]" />
            <span>Contacter</span>
          </a>
        </div>
      </div>

      {/* Tabs avec sous-lignage */}
      <div className="flex space-x-6 border-b border-white/80 text-xs font-semibold px-1 overflow-x-auto">
        {[
          { id: 'summary', label: 'Synthèse' },
          { id: 'interviews', label: `Entretiens (${studentInterviews.length})` },
          { id: 'actions', label: `Actions (${studentActions.length})` },
          { id: 'feedbacks', label: `Feedbacks (${studentFeedbacks.length})` },
          { id: 'documents', label: `Documents (${studentDocs.length})` },
          { id: 'history', label: 'Historique' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 transition-colors relative ${
              activeTab === tab.id
                ? 'text-[#0F172A] font-extrabold'
                : 'text-slate-400 hover:text-slate-700 font-medium'
            }`}
          >
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F172A] rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bloc Gauche : Parcours de formation (Timeline verticale exacte) */}
          <div className="glass-card p-6 rounded-3xl">
            <h2 className="text-sm font-bold text-slate-900 mb-6">Parcours de formation</h2>

            <div className="relative pl-6 space-y-7 border-l-2 border-slate-100 ml-3">
              {/* Étape 1 : Intégration (validée) */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-[#00D084] text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                  <Check className="w-3 h-3 stroke-3" />
                </span>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Intégration</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono">Validé</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">02 sept. - 05 sept. 2025</p>
              </div>

              {/* Étape 2 : Bloc 1 - Dév web (En cours) */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-[#0F172A] text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#00D084]"></span>
                </span>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Bloc 1 - Développement web</h4>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900/10 text-slate-900 border border-slate-900/20 font-mono">
                    En cours
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">08 sept. - 31 oct. 2025</p>
              </div>

              {/* Étape 3 : Bloc 2 - Frameworks (À venir) */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center ring-4 ring-white shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                </span>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Bloc 2 - Frameworks</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                    À venir
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">03 nov. - 28 nov. 2025</p>
              </div>

              {/* Étape 4 : Bloc 3 - Projet final */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center ring-4 ring-white shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                </span>
                <h4 className="text-xs font-bold text-slate-900">Bloc 3 - Projet final</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">01 déc. - 23 janv. 2026</p>
              </div>
            </div>
          </div>

          {/* Bloc Droite : Indicateurs (Jauges rondes) & Actions en cours */}
          <div className="space-y-5">
            {/* Indicateurs (Deux cercles jauge) */}
            <div className="glass-card p-6 rounded-3xl">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Indicateurs académiques</h2>

              <div className="flex items-center justify-around py-3">
                {/* Jauge 1 : Assiduité 92% (vert) */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#00D084]"
                        strokeDasharray={`${attendancePct}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-base font-black text-slate-900 font-mono">{attendancePct} %</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-bold mt-2">Assiduité</span>
                </div>

                {/* Jauge 2 : Moyenne 14,2/20 (violet) */}
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#6E56CF]"
                        strokeDasharray="71, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-base font-black text-slate-900 font-mono">14,2/20</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-bold mt-2">Moyenne</span>
                </div>
              </div>
            </div>

            {/* Score de Risque Décrochage */}
            <div className="glass-card p-6 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Risque de décrochage</span>
                </h2>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full font-mono uppercase border ${
                  risk.level === 'critique'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : risk.level === 'eleve'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : risk.level === 'modere'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {risk.level} ({risk.score}/100)
                </span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600 list-disc pl-4">
                {risk.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Actions en cours */}
            <div className="glass-card p-6 rounded-3xl">
              <h2 className="text-sm font-bold text-slate-900 mb-3">Actions en cours ({openStudentActions.length})</h2>

              {openStudentActions.length === 0 ? (
                <p className="text-xs text-slate-400">Aucune action ouverte pour cet apprenant.</p>
              ) : (
                <div className="space-y-2.5">
                  {openStudentActions.map(a => (
                    <div
                      key={a.id}
                      onClick={() => navigate('/actions')}
                      className="p-4 rounded-2xl border border-white/90 bg-white/60 hover:bg-white/80 transition cursor-pointer flex items-center justify-between shadow-2xs backdrop-blur-md"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{a.title}</h4>
                          <p className="text-[11px] text-slate-500 font-mono">Échéance : {a.dueDate}</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#00D084]/15 text-emerald-800 border border-[#00D084]/30 font-mono">
                        {a.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'interviews' && (
        <div className="glass-card rounded-3xl p-6 space-y-3">
          {studentInterviews.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Aucun entretien enregistré pour cet apprenant.</p>
          ) : (
            studentInterviews.map(i => (
              <div key={i.id} onClick={() => navigate('/entretiens')} className="p-4 rounded-2xl bg-white/70 border border-white/90 flex items-center justify-between cursor-pointer hover:bg-white transition">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{i.title}</h4>
                  <p className="text-[11px] text-slate-500">{new Date(i.scheduledAt).toLocaleDateString('fr-FR')} • {i.location}</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">{i.status}</span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="glass-card rounded-3xl p-6 space-y-3">
          {studentActions.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Aucune action corrective associée.</p>
          ) : (
            studentActions.map(a => (
              <div key={a.id} onClick={() => navigate('/actions')} className="p-4 rounded-2xl bg-white/70 border border-white/90 flex items-center justify-between cursor-pointer hover:bg-white transition">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{a.title}</h4>
                  <p className="text-[11px] text-slate-500">Responsable : {a.assigneeName} • Échéance : {a.dueDate}</p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">{a.status}</span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'feedbacks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <form onSubmit={handleCreateFeedback} className="glass-card rounded-3xl p-6 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900">Ajouter un feedback terrain</h3>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Auteur</label>
              <input
                type="text"
                required
                value={fbAuthor}
                onChange={(e) => setFbAuthor(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Source</label>
                <select
                  value={fbRole}
                  onChange={(e) => setFbRole(e.target.value as FeedbackAuthorRole)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                >
                  <option value="formateur">Formateur</option>
                  <option value="tuteur_esn">Tuteur ESN</option>
                  <option value="coordinateur">Coordinateur</option>
                  <option value="apprenant">Apprenant</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ressenti</label>
                <select
                  value={fbSentiment}
                  onChange={(e) => setFbSentiment(e.target.value as FeedbackSentiment)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
                >
                  <option value="positive">Positif</option>
                  <option value="neutral">Neutre</option>
                  <option value="negative">Alerte / Négatif</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Thématique</label>
              <select
                value={fbCategory}
                onChange={(e) => setFbCategory(e.target.value as FeedbackCategory)}
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
              >
                <option value="assiduite">Assiduité / Ponctualité</option>
                <option value="progression">Progression technique</option>
                <option value="integration_esn">Intégration entreprise / ESN</option>
                <option value="posture">Posture professionnelle</option>
                <option value="risque_rupture">Risque de rupture</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Commentaire *</label>
              <textarea
                rows={3}
                required
                value={fbComment}
                onChange={(e) => setFbComment(e.target.value)}
                placeholder="Retour formateur, tuteur Helpline/XEFI ou point apprenant..."
                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none"
              />
            </div>
            <button type="submit" className="w-full py-2.5 rounded-xl bg-[#1C1C1C] text-white font-bold">
              Enregistrer le feedback
            </button>
          </form>

          <div className="lg:col-span-2 glass-card rounded-3xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Historique des retours ({studentFeedbacks.length})</h3>
            {studentFeedbacks.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">Aucun feedback enregistré pour cet apprenant.</p>
            ) : (
              studentFeedbacks.map(fb => (
                <div key={fb.id} className="p-4 rounded-2xl bg-[#F9F9FA] border border-black/[0.06] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{fb.authorName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600">{fb.authorRole}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        fb.sentiment === 'positive' ? 'bg-emerald-100 text-emerald-800' :
                        fb.sentiment === 'negative' ? 'bg-rose-100 text-rose-800' : 'bg-slate-200 text-slate-700'
                      }`}>{fb.sentiment}</span>
                    </div>
                    <button
                      onClick={() => deleteFeedback(fb.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-700">{fb.comment}</p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {fb.category} • {new Date(fb.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="glass-card rounded-3xl p-6 space-y-3">
          {studentDocs.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Aucun document rattaché.</p>
          ) : (
            studentDocs.map(d => (
              <div key={d.id} onClick={() => navigate('/documents')} className="p-4 rounded-2xl bg-white/70 border border-white/90 flex items-center justify-between cursor-pointer hover:bg-white transition">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{d.title}</h4>
                  <p className="text-[11px] text-slate-500 font-mono">{d.fileName}</p>
                </div>
                <span className="text-[11px] text-slate-400">{new Date(d.uploadedAt).toLocaleDateString('fr-FR')}</span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="glass-card rounded-3xl p-6 space-y-3">
          {studentAlerts.length === 0 && studentInterviews.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Aucun événement d'historique enregistré.</p>
          ) : (
            studentAlerts.map(al => (
              <div key={al.id} className="p-4 rounded-2xl bg-white/70 border border-white/90 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{al.title}</h4>
                  <p className="text-[11px] text-slate-500">{al.description}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{new Date(al.triggeredAt).toLocaleDateString('fr-FR')}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Planifier Entretien */}
      {isInterviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Planifier un entretien — {student.firstName} {student.lastName}</h2>
              <button onClick={() => setIsInterviewOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateInterview} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Motif *</label>
                <input
                  type="text"
                  required
                  value={interviewTitle}
                  onChange={(e) => setInterviewTitle(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date et heure</label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsInterviewOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600">Annuler</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0F172A] text-white font-bold">Planifier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Créer Action Corrective */}
      {isActionOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Action corrective — {student.firstName} {student.lastName}</h2>
              <button onClick={() => setIsActionOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateAction} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Intitulé de l'action *</label>
                <input
                  type="text"
                  required
                  value={actionTitle}
                  onChange={(e) => setActionTitle(e.target.value)}
                  placeholder="Ex: Point assiduité avec le tuteur entreprise"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Priorité</label>
                <select
                  value={actionPriority}
                  onChange={(e) => setActionPriority(e.target.value as any)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                >
                  <option value="low">Basse</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Haute</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsActionOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600">Annuler</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#0F172A] text-white font-bold">Créer l'action</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetailPage;
