import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Users, UserCheck, CheckSquare, Calendar, 
  ArrowRight, Search, Clock, BookOpen,
  ChevronRight, Award, AlertCircle, CheckCircle2, Sparkles, Layers, Tag
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { useApp } from '../context/AppContext';

export const PromotionsPage: React.FC = () => {
  const navigate = useNavigate();
  const { promotions, cursusList } = useApp();
  const [activeTab, setActiveTab] = useState<'promotions' | 'cursus'>('promotions');
  const [search, setSearch] = useState('');
  const [selectedCursusModal, setSelectedCursusModal] = useState<any | null>(null);

  // Graphique d'évolution montant vers 92% (Septembre à Décembre)
  const evolutionData = [
    { month: 'Septembre', assiduite: 78, progression: 20 },
    { month: 'Octobre', assiduite: 84, progression: 45 },
    { month: 'Novembre', assiduite: 89, progression: 70 },
    { month: 'Décembre', assiduite: 92, progression: 92 },
  ];

  // Filtrage des promotions
  const filteredPromos = promotions.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    (p.cursus && p.cursus.toLowerCase().includes(search.toLowerCase())) ||
    (p.coordinator && p.coordinator.toLowerCase().includes(search.toLowerCase()))
  );

  // Filtrage des cursus
  const filteredCursus = cursusList.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.rncpLevel.toLowerCase().includes(search.toLowerCase()) ||
    (c.tags && c.tags.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  const activeCount = promotions.filter(p => p.status === 'active').length;
  const upcomingCount = promotions.filter(p => p.status === 'upcoming').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Promotions & Cursus Académiques
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervision académique des cohortes en alternance et référentiel officiel du campus Aston Informatique
          </p>
        </div>

        {/* Onglets Élégants */}
        <div className="flex items-center space-x-1.5 p-1 bg-white/70 backdrop-blur-md rounded-2xl border border-white/90 shadow-2xs">
          <button
            onClick={() => setActiveTab('promotions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'promotions'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Promotions en cours ({promotions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cursus')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeTab === 'cursus'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Référentiel des 7 Cursus</span>
          </button>
        </div>
      </div>

      {activeTab === 'promotions' && (
        <>
          {/* SECTION VEDETTE : Développeur Web - 2025 */}
          <div className="glass-card rounded-3xl p-6 lg:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-white/80">
              <div>
                <div className="flex items-center space-x-3 mb-1.5 flex-wrap gap-y-2">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase font-mono bg-[#00D084]/15 text-emerald-800 border border-[#00D084]/30">
                    PROMOTION VEDETTE
                  </span>
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    Code : DW2025
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/80 border border-slate-200/60 text-slate-700">
                    Niveau : Titre RNCP Niveau 5 (Bac+2)
                  </span>
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 flex items-center space-x-1">
                    <Clock className="w-3 h-3 inline mr-1" />
                    <span>910 heures / 130 Jours</span>
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Développeur Web - 2025
                </h2>
              </div>

              <div className="flex items-center space-x-3 text-xs">
                <button
                  onClick={() => navigate('/promotions/promo-dw-2025')}
                  className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-5 py-2.5 rounded-2xl font-bold flex items-center space-x-2 shadow-[0_4px_14px_rgba(15,23,42,0.2)] transition-all hover:scale-102"
                >
                  <span>Ouvrir la fiche promotion</span>
                  <ArrowRight className="w-4 h-4 text-[#00D084]" />
                </button>
              </div>
            </div>

            {/* 4 Cartes de statistiques */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 flex items-center space-x-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-slate-900/5 text-slate-800 flex items-center justify-center shrink-0 border border-white/80 shadow-2xs">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 font-mono">24</span>
                  <p className="text-[11px] text-slate-500 font-medium">Apprenants inscrits</p>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 flex items-center space-x-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-500/20 shadow-2xs">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 font-mono">3</span>
                  <p className="text-[11px] text-slate-500 font-medium">Formateurs référents</p>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 flex items-center space-x-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-2xs">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 font-mono">12</span>
                  <p className="text-[11px] text-slate-500 font-medium">Actions ouvertes</p>
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 flex items-center space-x-3.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-2xs">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-2xl font-black text-emerald-600 font-mono">92%</span>
                  <p className="text-[11px] text-slate-500 font-medium">Taux d'assiduité</p>
                </div>
              </div>
            </div>

            {/* Suivi graphique & Infos clés */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
              <div className="lg:col-span-2 bg-white/50 backdrop-blur-md p-5 rounded-2xl border border-white/80 shadow-2xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                      Progression pédagogique & Assiduité
                    </h3>
                    <p className="text-[11px] text-slate-500">Trajectoire semestrielle vers la certification</p>
                  </div>
                  <span className="text-xs font-black font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    +14% vs N-1
                  </span>
                </div>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={evolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="promoGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#635BFF" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#635BFF" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
                      <YAxis tickLine={false} axisLine={false} domain={[60, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="assiduite" stroke="#635BFF" strokeWidth={3} fillOpacity={1} fill="url(#promoGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white/50 backdrop-blur-md p-5 rounded-2xl border border-white/80 shadow-2xs flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono mb-3">
                    Informations clés
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
                      <span className="text-slate-500">Période :</span>
                      <span className="font-semibold text-slate-900 font-mono">02 sept. 2025 - 06 juin 2026</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
                      <span className="text-slate-500">Coordinateur :</span>
                      <span className="font-semibold text-slate-900">J. Martin</span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
                      <span className="text-slate-500">Code Nevea :</span>
                      <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        NEVEA-DW-2025
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Rythme :</span>
                      <span className="font-semibold text-slate-800">1 sem. école / 2 sem. entreprise</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-900">
                  <span className="font-bold block">Conformité Qualiopi :</span>
                  Contrôles d'assiduité et synchronisations d'équipe à jour.
                </div>
              </div>
            </div>
          </div>

          {/* Liste complète des promotions */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Toutes les promotions ({filteredPromos.length})
                </h2>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {activeCount} actives
                  </span>
                  {upcomingCount > 0 && (
                    <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      {upcomingCount} prochainement (gelée)
                    </span>
                  )}
                </div>
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher une promotion..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2.5 bg-white/70 backdrop-blur-md border border-white/90 rounded-2xl outline-none focus:border-slate-800 transition shadow-2xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPromos.map((p) => {
                const isUpcoming = p.status === 'upcoming' || p.isFrozen;

                return (
                  <div 
                    key={p.id}
                    onClick={() => navigate(`/promotions/${p.id}`)}
                    className={`glass-card p-5 rounded-2xl cursor-pointer flex flex-col justify-between space-y-4 group transition-all duration-200 ${
                      isUpcoming ? 'border-amber-300/60 bg-amber-50/20' : 'hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-mono font-bold text-slate-900 bg-white/90 px-2 py-0.5 rounded border border-slate-200/60 shadow-2xs">
                          {p.code}
                        </span>
                        {isUpcoming ? (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 flex items-center space-x-1">
                            <Clock className="w-3 h-3 inline mr-1" />
                            <span>Prochainement (Gelé)</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3 inline mr-1" />
                            <span>Active</span>
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition text-sm">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium">{p.cursus || p.cursusName}</p>
                      
                      {isUpcoming && (
                        <div className="mt-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-900 flex items-start space-x-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                          <span>Programme gelé pour révision pédagogique annuelle. Ouverture prochaine.</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/60 text-center text-xs">
                      <div>
                        <span className="text-sm font-black font-mono text-slate-900">{p.studentsCount}</span>
                        <p className="text-[10px] text-slate-400">Apprenants</p>
                      </div>
                      <div>
                        <span className="text-sm font-black font-mono text-slate-900">
                          {p.totalHours ? `${p.totalHours}h` : '910h'}
                        </span>
                        <p className="text-[10px] text-slate-400">Volume</p>
                      </div>
                      <div>
                        <span className="text-sm font-black font-mono text-indigo-600">
                          {p.totalDays ? `${p.totalDays}j` : '130j'}
                        </span>
                        <p className="text-[10px] text-slate-400">Jours</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-mono text-[11px]">{p.startDate}</span>
                      <span className="font-bold text-slate-900 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                        <span>Consulter</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ONGLET 2 : RÉFÉRENTIEL DES 7 CURSUS ASTON */}
      {activeTab === 'cursus' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Référentiel des 7 Cursus Diplômants Aston Informatique
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Volumes horaires, jours de formation, niveaux RNCP et Blocs de compétences officiels
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par titre, tag ou RNCP..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2.5 bg-white/70 backdrop-blur-md border border-white/90 rounded-2xl outline-none focus:border-slate-800 transition shadow-2xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCursus.map((c) => {
              const isUpcoming = c.status === 'upcoming' || c.code.includes('PB');

              return (
                <div 
                  key={c.id}
                  className={`glass-card p-6 rounded-3xl flex flex-col justify-between space-y-5 transition-all duration-200 ${
                    isUpcoming ? 'border-amber-300/80 bg-amber-50/20' : 'hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-xs font-mono font-black px-2.5 py-1 rounded-lg bg-slate-900 text-white shadow-2xs">
                        {c.code}
                      </span>
                      {isUpcoming ? (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center space-x-1">
                          <Clock className="w-3 h-3 inline mr-1" />
                          <span>Prochainement (Gelé)</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 inline mr-1" />
                          <span>Actif au catalogue</span>
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                        {c.title}
                      </h3>
                      <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700">
                        {c.rncpLevel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {c.description || 'Formation diplômante en alternance délivrée par Aston Informatique.'}
                    </p>

                    {/* Tags */}
                    {c.tags && c.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {c.tags.slice(0, 4).map((tag, idx) => (
                          <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/80 border border-slate-200 text-slate-600">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-3 border-t border-white/80">
                    {/* Heures et Jours en gros */}
                    <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-white/60 border border-white/90 text-center">
                      <div>
                        <span className="text-lg font-black font-mono text-slate-900 flex items-center justify-center">
                          <Clock className="w-4 h-4 mr-1 text-slate-500" />
                          {c.totalHours}h
                        </span>
                        <p className="text-[10px] text-slate-400 font-medium">Volume horaire</p>
                      </div>
                      <div>
                        <span className="text-lg font-black font-mono text-indigo-600 flex items-center justify-center">
                          <Calendar className="w-4 h-4 mr-1 text-indigo-500" />
                          {c.totalDays ? `${c.totalDays}j` : '—'}
                        </span>
                        <p className="text-[10px] text-slate-400 font-medium">Jours école</p>
                      </div>
                    </div>

                    {/* Blocs de compétences */}
                    {c.skillBlocks && c.skillBlocks.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-1">
                          <span>Blocs RNCP ({c.skillBlocks.length})</span>
                          <span className="text-[11px] text-indigo-600">Certifiables</span>
                        </div>
                        <div className="space-y-1">
                          {c.skillBlocks.slice(0, 3).map((block: any, bIdx: number) => (
                            <div key={bIdx} className="text-[11px] p-2 rounded-xl bg-white/70 border border-white/90 text-slate-700 flex items-start space-x-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                              <span className="line-clamp-1 font-medium">{block.title}</span>
                            </div>
                          ))}
                          {c.skillBlocks.length > 3 && (
                            <p className="text-[10px] text-center text-slate-400 pt-0.5">
                              + {c.skillBlocks.length - 3} autre(s) bloc(s) de compétences
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PromotionsPage;
