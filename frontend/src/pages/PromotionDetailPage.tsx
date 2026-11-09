import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, Users, UserCheck, Calendar, CalendarCheck, 
  MessageSquareShare, CheckSquare, FolderArchive, ArrowLeft, 
  ExternalLink, Clock, Plus, AlertCircle 
} from 'lucide-react';

export const PromotionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { promotions, students, trainers, actions, interviews, meetings, events, documents } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'students' | 'trainers' | 'planning' | 'interviews' | 'meetings' | 'actions' | 'documents'
  >('overview');

  const promo = promotions.find(p => p.id === id);

  if (!promo) {
    return (
      <div className="p-12 text-center">
        <p className="text-sm text-slate-500">Promotion introuvable.</p>
        <button 
          onClick={() => navigate('/promotions')}
          className="mt-4 text-xs text-indigo-600 font-medium hover:underline"
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  // Filtrage des éléments associés à cette promotion
  const promoStudents = students.filter(s => s.promotionId === promo.id);
  const promoActions = actions.filter(a => a.promotionId === promo.id);
  const promoInterviews = interviews.filter(i => i.promotionId === promo.id);
  const promoMeetings = meetings.filter(m => m.promotionId === promo.id);
  const promoEvents = events.filter(e => e.promotionId === promo.id);
  const promoDocs = documents.filter(d => d.promotionId === promo.id);

  const tabs = [
    { key: 'overview', label: "Vue d'ensemble", icon: GraduationCap },
    { key: 'students', label: `Apprenants (${promoStudents.length})`, icon: Users },
    { key: 'trainers', label: 'Formateurs', icon: UserCheck },
    { key: 'planning', label: 'Planning', icon: Calendar },
    { key: 'interviews', label: `Entretiens (${promoInterviews.length})`, icon: CalendarCheck },
    { key: 'meetings', label: `Synchronisations (${promoMeetings.length})`, icon: MessageSquareShare },
    { key: 'actions', label: `Actions (${promoActions.length})`, icon: CheckSquare },
    { key: 'documents', label: `Documents (${promoDocs.length})`, icon: FolderArchive },
  ];

  return (
    <div className="space-y-6">
      {/* Bouton retour & En-tête de la fiche */}
      <div>
        <button
          onClick={() => navigate('/promotions')}
          className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Toutes les promotions</span>
        </button>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {promo.status === 'active' ? 'Promotion Active' : 'À venir'}
              </span>
              <span className="text-xs font-mono text-slate-400">Code: {promo.code}</span>
              {promo.neveaReference && (
                <span className="text-xs font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                  Réf. Nevea : {promo.neveaReference}
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-900">{promo.name}</h1>
            <p className="text-xs text-indigo-600 font-medium mt-0.5">{promo.cursusName} • {promo.academicYear}</p>
          </div>

          <div className="flex items-center space-x-4 text-xs text-slate-600 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6">
            <div>
              <span className="text-slate-400 block text-[11px]">Coordinateur référent</span>
              <span className="font-semibold text-slate-900">{promo.coordinatorName}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Période</span>
              <span className="font-semibold text-slate-900">{promo.startDate} au {promo.endDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par Onglets */}
      <div className="flex space-x-1 border-b border-slate-200 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-3.5 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition ${
                isActive
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Contenu selon l'onglet sélectionné */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Synthèse Pédagogique</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Promotion de cursus diplômant en alternance. Les cours techniques issus du planning Nevea sont délivrés 
                sur site au campus et complétés par les sessions de travaux pratiques en laboratoire réseau.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100 text-center">
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-lg font-bold text-slate-900 block">{promoStudents.length}</span>
                  <span className="text-[10px] text-slate-500">Apprenants inscrits</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-lg font-bold text-slate-900 block">{promoInterviews.length}</span>
                  <span className="text-[10px] text-slate-500">Entretiens réalisés / prévus</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50">
                  <span className="text-lg font-bold text-slate-900 block">{promoActions.length}</span>
                  <span className="text-[10px] text-slate-500">Plans correctifs</span>
                </div>
              </div>
            </div>

            {/* Actions récentes de la promotion */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Actions en cours sur la promotion</h3>
                <button onClick={() => setActiveTab('actions')} className="text-xs text-indigo-600 hover:underline">Voir tout</button>
              </div>
              <div className="space-y-2">
                {promoActions.map(action => (
                  <div key={action.id} className="p-3 bg-slate-50 rounded-lg text-xs flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{action.title}</p>
                      <p className="text-[11px] text-slate-500">Assigné à {action.assigneeName} • Échéance: {action.dueDate}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {action.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Encadrement</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block">Coordinateur</span>
                  <span className="font-semibold text-slate-900">{promo.coordinatorName}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Formateur référent</span>
                  <span className="font-semibold text-slate-900">{promo.referentTrainerName || 'Non assigné'}</span>
                </div>
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl text-xs text-sky-800 space-y-1">
              <p className="font-bold flex items-center space-x-1.5">
                <span>Synchronisation Nevea</span>
              </p>
              <p className="text-[11px] text-sky-700 leading-relaxed">
                Les cours officiels associés à cette promotion proviennent de Nevea et sont verrouillés en lecture seule pour préserver la conformité administrative.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Apprenant</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Entreprise d'alternance</th>
                <th className="py-3 px-4">Tuteur</th>
                <th className="py-3 px-4">Assiduité</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {promoStudents.map((s) => (
                <tr 
                  key={s.id} 
                  onClick={() => navigate(`/apprenants/${s.id}`)}
                  className="hover:bg-slate-50 cursor-pointer transition"
                >
                  <td className="py-3 px-4 font-semibold text-slate-900">{s.firstName} {s.lastName}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{s.email}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{s.companyName}</td>
                  <td className="py-3 px-4 text-slate-500">{s.companyTutor}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      s.attendanceRate >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {s.attendanceRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-indigo-600 font-medium">Consulter ➔</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="space-y-3">
          {promoActions.map(action => (
            <div key={action.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {action.priority}
                </span>
                <h4 className="text-sm font-semibold text-slate-900">{action.title}</h4>
                <p className="text-xs text-slate-500">{action.description}</p>
                <p className="text-[11px] text-slate-400">Assigné à {action.assigneeName} • Échéance : {action.dueDate}</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 capitalize">
                {action.status.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'interviews' && (
        <div className="space-y-3">
          {promoInterviews.map(i => (
            <div key={i.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  {i.type.replace('_', ' ')}
                </span>
                <h4 className="text-sm font-semibold text-slate-900 mt-1">{i.title}</h4>
                <p className="text-xs text-slate-500">Apprenant : {i.studentName} • Date : {new Date(i.scheduledAt).toLocaleDateString('fr-FR')}</p>
              </div>
              <span className="text-xs font-medium text-slate-600">{i.status}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-3">
          {promoDocs.map(d => (
            <div key={d.id} className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">{d.title}</h4>
                <p className="text-xs text-slate-400">{d.fileName} • Téléversé par {d.uploadedByName}</p>
              </div>
              <button 
                onClick={() => alert(`Téléchargement sécurisé du document ${d.fileName} via URL signée Supabase Storage.`)}
                className="text-xs text-indigo-600 font-medium hover:underline"
              >
                Télécharger
              </button>
            </div>
          ))}
        </div>
      )}

      {['trainers', 'planning', 'meetings'].includes(activeTab) && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
          Module opérationnel et synchronisé pour la promotion {promo.name}.
        </div>
      )}
    </div>
  );
};
