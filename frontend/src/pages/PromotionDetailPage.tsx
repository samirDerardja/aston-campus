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

  // Données de suivi de l'évolution (courbe exacte de la maquette : Sept, Oct, Nov, Déc montant vers 92%)
  const trackingData = [
    { month: 'Sept', rate: 76 },
    { month: 'Oct', rate: 84 },
    { month: 'Nov', rate: 88 },
    { month: 'Déc', rate: 92 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-400">
        <button onClick={() => navigate('/promotions')} className="hover:text-slate-700 transition">
          Promotions
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-medium text-slate-800">{promo.name}</span>
      </div>

      {/* Header Fiche Promotion */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-900 to-indigo-700 flex items-center justify-center text-white shrink-0 shadow-sm overflow-hidden p-2">
            <div className="w-full h-full rounded-xl bg-indigo-950/40 flex items-center justify-center border border-indigo-500/30">
              <Laptop className="w-7 h-7 text-indigo-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-xl font-bold text-slate-900">{promo.name}</h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
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
            onClick={() => alert("Édition des métadonnées de la promotion.")}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Modifier</span>
          </button>
          <button 
            onClick={() => alert("Menu contextuel : Exporter, Archiver, Dupliquer.")}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs soulignés exacts */}
      <div className="flex space-x-6 border-b border-slate-200/80 text-xs font-semibold px-1">
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

      {activeTab === 'overview' && (
        <>
          {/* Rangée des 4 Cartes Métriques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#FAF8FF] p-5 rounded-2xl border border-purple-100 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-2.5">
                <Users className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-slate-900 leading-tight">24</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Apprenants</div>
            </div>

            <div className="bg-[#F6F9FF] p-5 rounded-2xl border border-blue-100 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-2.5">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-slate-900 leading-tight">3</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Formateurs</div>
            </div>

            <div className="bg-[#FFFDF5] p-5 rounded-2xl border border-amber-100 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-2.5">
                <CheckSquare className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-slate-900 leading-tight">12</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Actions ouvertes</div>
            </div>

            <div className="bg-[#F4FBF7] p-5 rounded-2xl border border-emerald-100 shadow-2xs">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-2xl font-bold text-emerald-600 leading-tight">92 %</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Assiduité</div>
            </div>
          </div>

          {/* Rangée Basse : Graphique Suivi de la promotion & Informations clés */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Suivi de la promotion (Area Chart) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Suivi de la promotion</h2>

              <div className="relative h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trackingData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="promoGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[60, 100]} tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip />
                    <Area type="monotone" dataKey="rate" stroke="#7C3AED" strokeWidth={2.5} fillOpacity={1} fill="url(#promoGradient)" />
                  </AreaChart>
                </ResponsiveContainer>

                {/* Badge 92% épinglé en fin de courbe comme sur la maquette */}
                <div className="absolute top-4 right-6 bg-[#6E56CF] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  92 %
                </div>
              </div>
            </div>

            {/* Informations clés */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <h2 className="text-sm font-bold text-slate-900 mb-4">Informations clés</h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-center space-x-3 text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{promo.startDate} - {promo.endDate}</p>
                    <p className="text-[10px] text-slate-400">Période académique</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{promo.coordinatorName}</p>
                    <p className="text-[10px] text-slate-400">Coordination de promotion</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{promo.cursusName}</p>
                    <p className="text-[10px] text-slate-400">Diplôme visé</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                    <Hash className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 font-mono">{promo.code}</p>
                    <p className="text-[10px] text-slate-400">Code administratif interne</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Apprenant</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Entreprise</th>
                <th className="py-3 px-4">Assiduité</th>
                <th className="py-3 px-4 text-right">Fiche</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {promoStudents.map(s => (
                <tr key={s.id} onClick={() => navigate(`/apprenants/${s.id}`)} className="hover:bg-slate-50 cursor-pointer">
                  <td className="py-3 px-4 font-bold text-slate-900">{s.firstName} {s.lastName}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{s.email}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{s.companyName}</td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {s.attendanceRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-purple-600 font-medium">Consulter ➔</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
