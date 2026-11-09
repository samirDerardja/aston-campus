import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, Mail, Phone, Building2, UserCheck, CalendarCheck, 
  CheckSquare, Clock, FileText, ChevronRight, ShieldCheck 
} from 'lucide-react';

export const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students, interviews, actions, documents } = useApp();

  const [activeTab, setActiveTab] = useState<'summary' | 'interviews' | 'actions' | 'timeline'>('summary');

  const student = students.find(s => s.id === id);

  if (!student) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm text-slate-500">Apprenant introuvable.</p>
        <button onClick={() => navigate('/apprenants')} className="mt-4 text-xs text-indigo-600 font-medium hover:underline">
          Retour à la liste
        </button>
      </div>
    );
  }

  const studentInterviews = interviews.filter(i => i.studentId === student.id);
  const studentActions = actions.filter(a => a.studentId === student.id);
  const studentDocs = documents.filter(d => d.studentId === student.id);

  return (
    <div className="space-y-6">
      {/* Bouton retour */}
      <div>
        <button
          onClick={() => navigate('/apprenants')}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tous les apprenants</span>
        </button>

        {/* Fiche Apprenant Header */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-sm">
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-slate-900">{student.firstName} {student.lastName}</h1>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                  {student.status}
                </span>
              </div>
              <p className="text-xs text-indigo-600 font-medium">{student.promotionName}</p>
              
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                <span className="flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{student.email}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{student.phone}</span>
                </span>
                {student.neveaReference && (
                  <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                    ID Nevea: {student.neveaReference}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-1">
            <div className="flex items-center space-x-1 text-slate-700 font-semibold">
              <Building2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Entreprise d'alternance</span>
            </div>
            <p className="font-bold text-slate-900">{student.companyName}</p>
            <p className="text-slate-500 text-[11px]">Tuteur : {student.companyTutor}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200 text-xs font-medium">
        <button
          onClick={() => setActiveTab('summary')}
          className={`pb-2.5 border-b-2 transition ${activeTab === 'summary' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500'}`}
        >
          Synthèse
        </button>
        <button
          onClick={() => setActiveTab('interviews')}
          className={`pb-2.5 border-b-2 transition ${activeTab === 'interviews' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500'}`}
        >
          Entretiens ({studentInterviews.length})
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          className={`pb-2.5 border-b-2 transition ${activeTab === 'actions' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500'}`}
        >
          Actions correctives ({studentActions.length})
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-2.5 border-b-2 transition ${activeTab === 'timeline' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-slate-500'}`}
        >
          Timeline & Historique
        </button>
      </div>

      {/* Contenu */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Indicateurs de progression</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[11px] text-slate-500 block">Taux d'assiduité</span>
                  <span className="text-xl font-bold text-emerald-600">{student.attendanceRate}%</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <span className="text-[11px] text-slate-500 block">Actions de soutien en cours</span>
                  <span className="text-xl font-bold text-indigo-600">{studentActions.filter(a => a.status !== 'completed').length}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Dernier compte rendu d'entretien</h3>
              {studentInterviews[0]?.report ? (
                <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-2">
                  <p className="font-semibold text-slate-900">{studentInterviews[0].title}</p>
                  <p className="text-slate-600">{studentInterviews[0].report.summary}</p>
                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Recommandations :</span> {studentInterviews[0].report.recommendations}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Aucun compte rendu finalisé pour l'instant.</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-2">
              <div className="flex items-center space-x-1.5 text-slate-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Protection des Données (RGPD)</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Conformément aux directives Aston, ce dossier ne contient aucune mention médicale ou disciplinaire sensible non autorisée.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'interviews' && (
        <div className="space-y-3">
          {studentInterviews.map(i => (
            <div key={i.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700">{i.type}</span>
                <h4 className="text-sm font-semibold text-slate-900 mt-1">{i.title}</h4>
                <p className="text-xs text-slate-500">Lieu: {i.location} • Coordinateur: {i.coordinatorName}</p>
              </div>
              <span className="text-xs font-semibold text-slate-600">{i.status}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="space-y-3">
          {studentActions.map(action => (
            <div key={action.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">{action.priority}</span>
                <h4 className="text-sm font-semibold text-slate-900 mt-1">{action.title}</h4>
                <p className="text-xs text-slate-500">{action.description}</p>
                <p className="text-[11px] text-slate-400">Échéance: {action.dueDate} • Assigné à {action.assigneeName}</p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-50 text-indigo-700">{action.status}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="relative border-l-2 border-slate-200 pl-6 ml-2 space-y-6 text-xs">
            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-white"></span>
              <span className="text-[11px] text-slate-400 font-mono">15 Septembre 2025</span>
              <p className="font-semibold text-slate-900 mt-0.5">Inscription administrative confirmée</p>
              <p className="text-slate-500">Rentrée dans la promotion TSRS 2025/2026 et contrat d'alternance Capgemini.</p>
            </div>

            <div className="relative">
              <span className="absolute -left-[31px] top-0 w-3.5 h-3.5 rounded-full bg-indigo-500 ring-4 ring-white"></span>
              <span className="text-[11px] text-slate-400 font-mono">04 Novembre 2026</span>
              <p className="font-semibold text-slate-900 mt-0.5">Entretien individuel de bilan</p>
              <p className="text-slate-500">Entretien avec Marc Lefèvre. Compte rendu rédigé et plan d'aide mis en place.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
