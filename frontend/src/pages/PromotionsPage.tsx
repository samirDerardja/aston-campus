import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Users, UserCheck, CheckSquare, Calendar, 
  ArrowRight, Search, Plus, TrendingUp, Clock, BookOpen,
  ChevronRight, Award
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';

export const PromotionsPage: React.FC = () => {
  const navigate = useNavigate();

  // Graphique d'évolution montant vers 92% (Septembre à Décembre)
  const evolutionData = [
    { month: 'Septembre', assiduite: 78, progression: 20 },
    { month: 'Octobre', assiduite: 84, progression: 45 },
    { month: 'Novembre', assiduite: 89, progression: 70 },
    { month: 'Décembre', assiduite: 92, progression: 92 },
  ];

  const promotionsList = [
    {
      id: 'promo-dw2025',
      name: 'Développeur Web - 2025',
      code: 'DW2025',
      level: 'BTS',
      studentsCount: 24,
      trainersCount: 3,
      actionsCount: 12,
      attendance: 92,
      startDate: '02 sept. 2025',
      endDate: '06 juin 2026',
      coordinator: 'J. Martin',
      featured: true,
    },
    {
      id: 'promo-cda2026',
      name: 'Concepteur Développeur d\'Applications (CDA)',
      code: 'CDA2026',
      level: 'Bac+4 / Titre RNCP',
      studentsCount: 28,
      trainersCount: 4,
      actionsCount: 6,
      attendance: 94,
      startDate: '15 oct. 2025',
      endDate: '30 oct. 2026',
      coordinator: 'Samir Derardja',
      featured: false,
    },
    {
      id: 'promo-secops2026',
      name: 'DevSecOps & Cloud Architecture',
      code: 'DSO2026',
      level: 'Mastère Spécialisé',
      studentsCount: 22,
      trainersCount: 3,
      actionsCount: 4,
      attendance: 96,
      startDate: '01 nov. 2025',
      endDate: '15 déc. 2026',
      coordinator: 'P. Lambert',
      featured: false,
    },
    {
      id: 'promo-cyber2026',
      name: 'Expert en Cybersécurité & Réseaux',
      code: 'CYB2026',
      level: 'Mastère RNCP Niv. 7',
      studentsCount: 26,
      trainersCount: 5,
      actionsCount: 3,
      attendance: 91,
      startDate: '08 sept. 2025',
      endDate: '28 juin 2026',
      coordinator: 'C. Vasseur',
      featured: false,
    },
    {
      id: 'promo-sio2025',
      name: 'BTS SIO - Option SLAM',
      code: 'SIO2025',
      level: 'BTS',
      studentsCount: 24,
      trainersCount: 3,
      actionsCount: 3,
      attendance: 88,
      startDate: '01 sept. 2025',
      endDate: '30 mai 2026',
      coordinator: 'M. Benali',
      featured: false,
    },
  ];

  const [search, setSearch] = useState('');

  const filteredPromos = promotionsList.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.coordinator.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Promotions & Cursus
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervision académique des cohortes en alternance et initiale du campus Aston
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md text-emerald-700 border border-emerald-500/30 text-xs font-bold font-mono shadow-2xs">
            5 promotions actives
          </span>
        </div>
      </div>

      {/* SECTION VEDETTE EN VERRE TRANSLUCIDE DE LUXE : Développeur Web - 2025 */}
      <div className="glass-card rounded-3xl p-6 lg:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-white/80">
          <div>
            <div className="flex items-center space-x-3 mb-1.5">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase font-mono bg-[#00D084]/15 text-emerald-800 border border-[#00D084]/30">
                PROMOTION VEDETTE
              </span>
              <span className="text-xs font-bold text-slate-500 font-mono">
                Code : DW2025
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/80 border border-slate-200/60 text-slate-700">
                Niveau : BTS
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Développeur Web - 2025
            </h2>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={() => navigate('/promotions/promo-dw2025')}
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white px-5 py-2.5 rounded-2xl font-bold flex items-center space-x-2 shadow-[0_4px_14px_rgba(15,23,42,0.2)] transition-all hover:scale-102"
            >
              <span>Ouvrir la fiche promotion</span>
              <ArrowRight className="w-4 h-4 text-[#00D084]" />
            </button>
          </div>
        </div>

        {/* 4 Cartes de la promotion vedette : 24 Apprenants, 3 Formateurs, 12 Actions ouvertes, 92% Assiduité */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Carte 1 */}
          <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 flex items-center space-x-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-slate-900/5 text-slate-800 flex items-center justify-center shrink-0 border border-white/80 shadow-2xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 font-mono">24</span>
              <p className="text-[11px] text-slate-500 font-medium">Apprenants inscrits</p>
            </div>
          </div>

          {/* Carte 2 */}
          <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 flex items-center space-x-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-500/20 shadow-2xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-black text-slate-900 font-mono">3</span>
              <p className="text-[11px] text-slate-500 font-medium">Formateurs référents</p>
            </div>
          </div>

          {/* Carte 3 */}
          <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 flex items-center space-x-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#F43F5E] flex items-center justify-center shrink-0 border border-rose-200/80 shadow-2xs">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-black text-[#F43F5E] font-mono">12</span>
              <p className="text-[11px] text-slate-500 font-medium">Actions ouvertes</p>
            </div>
          </div>

          {/* Carte 4 */}
          <div className="bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/80 flex items-center space-x-3.5 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-2xs">
              <TrendingUp className="w-5 h-5 text-[#00D084]" />
            </div>
            <div>
              <span className="text-2xl font-black text-emerald-600 font-mono">92%</span>
              <p className="text-[11px] text-slate-500 font-medium">Taux d'assiduité</p>
            </div>
          </div>
        </div>

        {/* Graphique d'évolution montant vers 92% (Septembre à Décembre) & Informations clés */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Graphique */}
          <div className="lg:col-span-2 bg-white/50 backdrop-blur-md p-5 rounded-2xl border border-white/80 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                  Évolution de l'assiduité de la promotion
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Progression constante montant vers l'objectif de 92%</p>
              </div>
              <span className="text-xs font-bold font-mono text-emerald-700 bg-[#00D084]/15 border border-[#00D084]/25 px-2.5 py-0.5 rounded-full">
                +14% vs Rentrée
              </span>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={evolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAssiduite" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D084" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#00D084" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} domain={[60, 100]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0F172A', 
                      borderRadius: '12px', 
                      border: 'none', 
                      color: '#fff', 
                      fontSize: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                    }}
                    formatter={(v: any) => [`${v}%`, 'Assiduité']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="assiduite" 
                    stroke="#00D084" 
                    strokeWidth={3} 
                    fill="url(#colorAssiduite)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Informations clés de la promotion vedette */}
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
                    DW2025
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Rythme :</span>
                  <span className="font-semibold text-slate-800">1 sem. école / 2 sem. entreprise</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-900">
              <span className="font-bold block">Certification Qualiopi :</span>
              Assiduité et suivi des entretiens validés pour le semestre en cours.
            </div>
          </div>
        </div>
      </div>

      {/* Liste complète des promotions du campus avec cartes glassmorphism */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">
            Toutes les promotions du campus ({filteredPromos.length})
          </h2>

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
          {filteredPromos.map((p) => (
            <div 
              key={p.id}
              onClick={() => navigate(`/promotions/${p.id}`)}
              className="glass-card p-5 rounded-2xl cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-slate-900 bg-white/90 px-2 py-0.5 rounded border border-slate-200/60 shadow-2xs">
                    {p.code}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">{p.level}</span>
                </div>

                <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition text-sm">
                  {p.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">Coord. {p.coordinator}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 border-y border-white/60 text-center">
                <div>
                  <span className="text-sm font-black font-mono text-slate-900">{p.studentsCount}</span>
                  <p className="text-[10px] text-slate-400">Apprenants</p>
                </div>
                <div>
                  <span className="text-sm font-black font-mono text-slate-900">{p.trainersCount}</span>
                  <p className="text-[10px] text-slate-400">Formateurs</p>
                </div>
                <div>
                  <span className="text-sm font-black font-mono text-emerald-600">{p.attendance}%</span>
                  <p className="text-[10px] text-slate-400">Assiduité</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[11px]">{p.startDate}</span>
                <span className="font-bold text-slate-900 group-hover:text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                  <span>Dossier</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionsPage;
