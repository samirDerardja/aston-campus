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
  const { promotions, students } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'trainers' | 'tracking' | 'documents'>('overview');

  const promo = promotions.find(p => p.id === id || p.code === 'DW2025') || promotions[0];
  const promoStudents = students.filter(s => s.promotionId === promo.id);

  // Données de suivi de l'évolution : Sept, Oct, Nov, Déc montant vers 92%
  const trackingData = [
    { month: 'Sept', rate: 76 },
    { month: 'Oct', rate: 84 },
    { month: 'Nov', rate: 88 },
    { month: 'Déc', rate: 92 },
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
                En cours
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {promo.cursusName} • Promotion {promo.code} • {promo.studentsCount} apprenants
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {}}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-2xl bg-white/70 border border-white/90 text-xs font-bold text-slate-700 hover:bg-white shadow-2xs transition"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Modifier</span>
          </button>
          <button 
            onClick={() => {}}
            className="p-2.5 rounded-2xl bg-white/70 border border-white/90 text-slate-500 hover:bg-white shadow-2xs transition"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs soulignés */}
      <div className="flex space-x-6 border-b border-white/80 text-xs font-semibold px-1">
        {[
          { id: 'overview', label: "Vue d'ensemble" },
          { id: 'students', label: `Apprenants (${promo.studentsCount})` },
          { id: 'trainers', label: 'Formateurs (3)' },
          { id: 'tracking', label: 'Suivi' },
          { id: 'documents', label: 'Documents' },
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
              <div className="text-2xl font-black text-slate-900 font-mono leading-tight">3</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Formateurs</div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-[#F43F5E] flex items-center justify-center mb-2.5 border border-rose-500/20 shadow-2xs">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-[#F43F5E] font-mono leading-tight">12</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Actions ouvertes</div>
            </div>

            <div className="glass-card p-5 rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center mb-2.5 border border-emerald-500/20 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-[#00D084]" />
              </div>
              <div className="text-2xl font-black text-emerald-600 font-mono leading-tight">92 %</div>
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

                {/* Badge 92% épinglé en fin de courbe */}
                <div className="absolute top-4 right-6 bg-[#00D084] text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm font-mono">
                  92 %
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
                    <p className="font-bold text-slate-900">{promo.coordinatorName}</p>
                    <p className="text-[10px] text-slate-400">Coordination de promotion</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-slate-700">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-500 shadow-2xs">
                    <Award className="w-4 h-4 text-slate-700" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{promo.cursusName}</p>
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
        </div>
      )}
    </div>
  );
};

export default PromotionDetailPage;
