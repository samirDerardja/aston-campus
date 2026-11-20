import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Users, UserCheck, CheckSquare, ShieldCheck, 
  Calendar, Award, Hash, Edit3, MoreHorizontal, ChevronRight,
  Laptop
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const PromotionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { promotions, students, trainers, actions, documents, events, interviews } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'trainers' | 'planning' | 'tracking' | 'documents'>('overview');

  const promo = promotions.find(p => p.id === id) || promotions[0];
  if (!promo) {
    return (
      <div className="glass-card p-8 rounded-3xl text-center text-xs text-slate-500">
        Aucune promotion trouvée.
      </div>
    );
  }

  const promoStudents = students.filter(s => s.promotionId === promo.id);
  const promoTrainers = trainers.filter(
    t => t.assignedPromotionIds.includes(promo.id) || (promo.referentTrainer && promo.referentTrainer.toLowerCase().includes(t.firstName.toLowerCase()))
  );
  const promoActions = actions.filter(a => a.promotionId === promo.id);
  const openPromoActions = promoActions.filter(a => a.status !== 'completed' && a.status !== 'cancelled');
  const promoDocs = documents.filter(d => d.promotionId === promo.id);
  const promoEvents = events.filter(e => e.promotionId === promo.id);
  const promoInterviews = interviews.filter(i => i.promotionId === promo.id);

  const avgAttendance = promoStudents.length > 0
    ? Math.round(promoStudents.reduce((sum, s) => sum + (s.attendanceRate || 0), 0) / promoStudents.length)
    : 92;

  const cursusLabel = promo.cursusName || promo.cursus || 'Cursus Aston';
  const coordinatorLabel = promo.coordinatorName || promo.coordinator || 'Samir Derardja';
  const statusLabel = promo.status === 'active' ? 'En cours' : promo.status === 'upcoming' ? 'À venir' : promo.status === 'completed' ? 'Terminée' : 'Archivée';

  // Données de suivi de l'évolution vers l'assiduité réelle de la promotion
  const trackingData = [
    { month: 'Sept', rate: Math.max(65, avgAttendance - 14) },
    { month: 'Oct', rate: Math.max(70, avgAttendance - 8) },
    { month: 'Nov', rate: Math.max(75, avgAttendance - 4) },
    { month: 'Déc', rate: avgAttendance },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-400">
        <button onClick={() => navigate('/promotions')} className="hover:text-slate-800 transition">
          Promotions
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-bold text-slate-900">{promo.name}</span>
      </div>

      {/* Header Fiche Promotion en verre translucide de luxe */}
      <div className="glass-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0F172A] flex items-center justify-center text-white shrink-0 shadow-sm border border-white/20 p-2">
            <Laptop className="w-7 h-7 text-[#00D084]" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl font-extrabold text-slate-900">{promo.name}</h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#00D084]/15 text-emerald-800 border border-[#00D084]/30 font-mono">
                {statusLabel}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {cursusLabel} • Promotion {promo.code} • {promo.studentsCount} apprenants
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/promotions')}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-white/70 border border-white/90 text-xs font-bold text-slate-700 hover:bg-white shadow-2xs transition"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Gérer les promos</span>
          </button>
        </div>
      </div>

      {/* Tabs soulignés */}
      <div className="flex space-x-6 border-b border-white/80 text-xs font-semibold px-1 overflow-x-auto">
        {[
          { id: 'overview', label: "Vue d'ensemble" },
          { id: 'students', label: `Apprenants (${promoStudents.length || promo.studentsCount})` },
          { id: 'trainers', label: `Formateurs (${promoTrainers.length})` },
          { id: 'planning', label: `Planning (${promoEvents.length})` },
          { id: 'tracking', label: `Suivi (${promoActions.length + promoInterviews.length})` },
          { id: 'documents', label: `Documents (${promoDocs.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 transition-colors relative whitespace-nowrap ${
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

      {activeTab === 'overview' && (
        <>
          {/* Rangée des 4 Cartes Métriques en verre */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-slate-900/5 text-slate-900 flex items-center justify-center mb-2.5 border border-white/80 shadow-2xs">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono leading-tight">{promo.studentsCount}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Apprenants</div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center mb-2.5 border border-blue-500/20 shadow-2xs">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono leading-tight">{promoTrainers.length}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Formateurs</div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-[#F43F5E] flex items-center justify-center mb-2.5 border border-rose-500/20 shadow-2xs">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-[#F43F5E] font-mono leading-tight">{openPromoActions.length}</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Actions ouvertes</div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center mb-2.5 border border-emerald-500/20 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#00D084]" />
              </div>
              <div className="text-2xl font-black text-emerald-600 font-mono leading-tight">{avgAttendance} %</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Assiduité</div>
            </div>
          </div>

          {/* Rangée Basse : Graphique Suivi de la promotion & Informations clés */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Suivi de la promotion (Area Chart) */}
            <div className="glass-card p-6 rounded-3xl">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Suivi de la promotion</h2>

              <div className="relative h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trackingData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="promoGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00D084" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#00D084" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip />
                    <Area type="monotone" dataKey="rate" stroke="#00D084" strokeWidth={2.5} fillOpacity={1} fill="url(#promoGradient)" />
                  </AreaChart>
                </ResponsiveContainer>

                <div className="absolute top-4 right-6 bg-[#00D084] text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm font-mono">
                  {avgAttendance} %
                </div>
              </div>
            </div>

            {/* Informations clés */}
            <div className="glass-card p-6 rounded-3xl flex flex-col justify-between">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Informations clés</h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-center space-x-3 text-slate-700">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-500 shadow-2xs">
                    <Calendar className="w-4 h-4 text-[#00D084]" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{promo.startDate} - {promo.endDate}</p>
                    <p className="text-[10px] text-slate-400">Période académique</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-slate-700">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-500 shadow-2xs">
                    <UserCheck className="w-4 h-4 text-slate-700" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{coordinatorLabel}</p>
                    <p className="text-[10px] text-slate-400">Coordination de promotion</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-slate-700">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-500 shadow-2xs">
                    <Award className="w-4 h-4 text-slate-700" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{cursusLabel}</p>
                    <p className="text-[10px] text-slate-400">Diplôme visé</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-slate-700">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-500 shadow-2xs">
                    <Hash className="w-4 h-4 text-slate-700" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 font-mono">{promo.code}</p>
                    <p className="text-[10px] text-slate-400">Code administratif interne</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'students' && (
        <div className="glass-card rounded-3xl overflow-hidden shadow-2xs">
          {promoStudents.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">Aucun apprenant rattaché à cette promotion pour le moment.</div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-white/40 text-slate-400 font-semibold text-[10px] uppercase border-b border-white/70">
                <tr>
                  <th className="py-4 px-5">Apprenant</th>
                  <th className="py-4 px-5">Email</th>
                  <th className="py-4 px-5">Entreprise</th>
                  <th className="py-4 px-5">Assiduité</th>
                  <th className="py-4 px-5 text-right">Fiche</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/50">
                {promoStudents.map(s => (
                  <tr key={s.id} onClick={() => navigate(`/apprenants/${s.id}`)} className="hover:bg-white/60 cursor-pointer transition">
                    <td className="py-3.5 px-5 font-bold text-slate-900">{s.firstName} {s.lastName}</td>
                    <td className="py-3.5 px-5 text-slate-500 font-mono text-[11px]">{s.email}</td>
                    <td className="py-3.5 px-5 text-slate-700 font-medium">{s.companyName}</td>
                    <td className="py-3.5 px-5">
                      <span className="text-[11px] font-bold text-emerald-800 bg-[#00D084]/15 border border-[#00D084]/25 px-2.5 py-0.5 rounded-full font-mono">
                        {s.attendanceRate}%
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right text-slate-900 font-bold hover:text-[#00D084]">Consulter ➔</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'trainers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promoTrainers.length === 0 ? (
            <div className="col-span-2 glass-card p-8 rounded-3xl text-center text-xs text-slate-400">
              Aucun formateur affecté explicitement à cette promotion. Référent : {promo.referentTrainer || promo.referentTrainerName || 'À assigner'}.
            </div>
          ) : (
            promoTrainers.map(t => (
              <div key={t.id} className="glass-card p-5 rounded-3xl space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{t.firstName} {t.lastName}</h3>
                  {t.isLead && (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#00D084]/15 text-emerald-800 border border-[#00D084]/30">
                      Référent officiel
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{t.poleSpecialty || t.specialties.join(' • ')}</p>
                <p className="text-[11px] text-slate-400 font-mono">{t.email} • {t.phone}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'planning' && (
        <div className="glass-card rounded-3xl p-6 space-y-3">
          {promoEvents.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Aucune séance planifiée pour cette promotion.</p>
          ) : (
            promoEvents.map(ev => (
              <div key={ev.id} className="p-4 rounded-2xl bg-white/70 border border-white/90 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{ev.title}</h4>
                  <p className="text-[11px] text-slate-500">
                    {new Date(ev.startTime).toLocaleDateString('fr-FR')} • {ev.room || 'Campus Aston'} • {ev.trainerName || 'Équipe pédagogique'}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">
                  {ev.sourceType === 'nevea_readonly' ? 'Nevea' : 'Aston Local'}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'tracking' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="glass-card p-6 rounded-3xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Actions correctives ({promoActions.length})</h3>
            {promoActions.length === 0 ? (
              <p className="text-xs text-slate-400">Aucune action enregistrée.</p>
            ) : (
              promoActions.map(a => (
                <div key={a.id} onClick={() => navigate('/actions')} className="p-3 rounded-2xl bg-white/70 border border-white/90 cursor-pointer hover:bg-white transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{a.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{a.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Responsable : {a.assigneeName} • Échéance : {a.dueDate}</p>
                </div>
              ))
            )}
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Entretiens ({promoInterviews.length})</h3>
            {promoInterviews.length === 0 ? (
              <p className="text-xs text-slate-400">Aucun entretien enregistré.</p>
            ) : (
              promoInterviews.map(i => (
                <div key={i.id} onClick={() => navigate('/entretiens')} className="p-3 rounded-2xl bg-white/70 border border-white/90 cursor-pointer hover:bg-white transition">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{i.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{i.status}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{new Date(i.scheduledAt).toLocaleDateString('fr-FR')} • {i.location}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="glass-card rounded-3xl p-6 space-y-3">
          {promoDocs.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">Aucun document associé à cette promotion.</p>
          ) : (
            promoDocs.map(d => (
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
    </div>
  );
};

export default PromotionDetailPage;
