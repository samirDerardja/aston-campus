import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  ChevronRight, Mail, Phone, MessageSquare, Check, 
  Clock, AlertCircle, Calendar, ShieldCheck 
} from 'lucide-react';

export const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { students, actions, interviews } = useApp();

  const [activeTab, setActiveTab] = useState<'summary' | 'interviews' | 'actions' | 'documents' | 'history'>('summary');

  const student = students.find(s => s.id === id || s.firstName === 'Thomas') || students[0];
  const studentActions = actions.filter(a => a.studentId === student.id || a.title.includes('SQL'));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-400">
        <button onClick={() => navigate('/apprenants')} className="hover:text-slate-700 transition">
          Apprenants
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-medium text-slate-800">Fiche apprenant</span>
      </div>

      {/* En-tête Fiche Apprenant */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-purple-100 shadow-xs shrink-0">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80" 
              alt={student.firstName + ' ' + student.lastName}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl font-bold text-slate-900">{student.firstName} {student.lastName}</h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Actif
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{student.promotionName}</p>

            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono text-[11px]">{student.email}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{student.phone}</span>
              </span>
            </div>
          </div>
        </div>

        <div>
          <button 
            onClick={() => alert(`Contacter ${student.firstName} ${student.lastName} : email envoyé à ${student.email}`)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>Contacter</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-slate-200/80 text-xs font-semibold px-1">
        {[
          { id: 'summary', label: 'Synthèse' },
          { id: 'interviews', label: 'Entretiens' },
          { id: 'actions', label: 'Actions' },
          { id: 'documents', label: 'Documents' },
          { id: 'history', label: 'Historique' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 transition-colors relative ${
              activeTab === tab.id
                ? 'text-purple-600 font-bold'
                : 'text-slate-400 hover:text-slate-700 font-medium'
            }`}
          >
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 rounded-full"></span>
            )}
          </button>
        ))}
      </div>

      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bloc Gauche : Parcours de formation (Timeline exacte) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h2 className="text-sm font-bold text-slate-900 mb-6">Parcours de formation</h2>

            <div className="relative pl-6 space-y-7 border-l-2 border-slate-100 ml-3">
              {/* Étape 1 : Intégration (validée) */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                  <Check className="w-3 h-3 stroke-3" />
                </span>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Intégration</h4>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">02 sept. - 05 sept. 2025</p>
              </div>

              {/* Étape 2 : Bloc 1 - Dév web (En cours) */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                </span>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">Bloc 1 - Développement web</h4>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
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
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
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
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Indicateurs</h2>

              <div className="flex items-center justify-around py-3">
                {/* Jauge 1 : Assiduité 92% */}
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
                        className="text-emerald-500"
                        strokeDasharray="92, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-sm font-bold text-slate-900">92 %</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-2">Assiduité</span>
                </div>

                {/* Jauge 2 : Moyenne 14,2/20 */}
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
                        className="text-purple-600"
                        strokeDasharray="71, 100"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-sm font-bold text-slate-900">14,2/20</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-2">Moyenne</span>
                </div>
              </div>
            </div>

            {/* Actions en cours (1) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <h2 className="text-sm font-bold text-slate-900 mb-3">Actions en cours (1)</h2>

              <div 
                onClick={() => navigate('/actions')}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100/80 transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Renforcement en SQL</h4>
                    <p className="text-[11px] text-slate-500">Échéance : 20 nov. 2025</p>
                  </div>
                </div>

                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  En cours
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
