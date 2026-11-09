import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  MessageSquareShare, Plus, Calendar, CheckSquare, 
  ArrowRight, Check, Users, Clock, Sparkles 
} from 'lucide-react';

export const MeetingsPage: React.FC = () => {
  const { meetings, convertDecisionToAction, trainers, actions } = useApp();
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(meetings[0]?.id || '');

  const activeMeeting = meetings.find(m => m.id === selectedMeetingId) || meetings[0];

  const handleConvert = (decisionId: string, topic: string) => {
    // Échéance à J+7
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des réunions */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Réunions enregistrées</h2>
          {meetings.map((meeting) => (
            <div
              key={meeting.id}
              onClick={() => setSelectedMeetingId(meeting.id)}
              className={`p-4 rounded-xl border transition cursor-pointer ${
                meeting.id === activeMeeting?.id
                  ? 'border-indigo-500 bg-white shadow-xs ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-semibold text-indigo-600">{meeting.promotionName}</span>
                <span className="text-slate-400 font-mono">
                  {new Date(meeting.scheduledAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">{meeting.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{meeting.agenda}</p>
            </div>
          ))}
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
                </div>

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
    </div>
  );
};
