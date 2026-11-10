import React, { useState } from 'react';
import { 
  CheckSquare, Search, Filter, Plus, Calendar, 
  User, AlertTriangle, CheckCircle2, Clock, ChevronRight,
  MoreHorizontal, ArrowRight, X
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface KanbanAction {
  id: string;
  title: string;
  promotion: string;
  responsible: string;
  avatarText: string;
  priority: 'Haute' | 'Moyenne' | 'Basse';
  dueDate: string;
  status: 'todo' | 'in_progress' | 'completed';
  notes?: string;
}

export const ActionsPage: React.FC = () => {
  const { promotions } = useApp();

  const [actions, setActions] = useState<KanbanAction[]>([
    // Colonne 1 : À faire (7)
    {
      id: 'act-1',
      title: 'Renforcement français & rédaction pro',
      promotion: 'DW2025 • Développeur Web',
      responsible: 'J. Martin',
      avatarText: 'JM',
      priority: 'Haute',
      dueDate: '15 nov. 2026',
      status: 'todo',
      notes: 'Difficultés de formulation dans les livrables d\'alternance',
    },
    {
      id: 'act-2',
      title: 'Manque de participation en cours',
      promotion: 'DW2025 • Développeur Web',
      responsible: 'Samir Derardja',
      avatarText: 'SD',
      priority: 'Moyenne',
      dueDate: '18 nov. 2026',
      status: 'todo',
      notes: 'Point individuel à caler avec l\'apprenant',
    },
    {
      id: 'act-3',
      title: 'Rattrapage QCM Bases de données',
      promotion: 'DW2025 • Développeur Web',
      responsible: 'P. Lambert',
      avatarText: 'PL',
      priority: 'Haute',
      dueDate: '12 nov. 2026',
      status: 'todo',
    },
    {
      id: 'act-4',
      title: 'Point tuteur entreprise (Assiduité)',
      promotion: 'CDA2026 • Concepteur Dév.',
      responsible: 'Samir Derardja',
      avatarText: 'SD',
      priority: 'Haute',
      dueDate: '14 nov. 2026',
      status: 'todo',
    },
    {
      id: 'act-5',
      title: 'Cadrage projet fin d\'année',
      promotion: 'SIO2025 • BTS SIO',
      responsible: 'M. Benali',
      avatarText: 'MB',
      priority: 'Moyenne',
      dueDate: '22 nov. 2026',
      status: 'todo',
    },
    {
      id: 'act-6',
      title: 'Contrat alternance à signer',
      promotion: 'CYB2026 • Cybersécurité',
      responsible: 'C. Vasseur',
      avatarText: 'CV',
      priority: 'Moyenne',
      dueDate: '19 nov. 2026',
      status: 'todo',
    },
    {
      id: 'act-7',
      title: 'Validation livret d\'apprentissage',
      promotion: 'DW2025 • Développeur Web',
      responsible: 'J. Martin',
      avatarText: 'JM',
      priority: 'Basse',
      dueDate: '25 nov. 2026',
      status: 'todo',
    },

    // Colonne 2 : En cours (14)
    {
      id: 'act-8',
      title: 'Soutien en maths & logique algorithmique',
      promotion: 'DW2025 • Développeur Web',
      responsible: 'J. Martin',
      avatarText: 'JM',
      priority: 'Haute',
      dueDate: '20 nov. 2026',
      status: 'in_progress',
      notes: '3 séances de tutorat programmées les mercredis',
    },
    {
      id: 'act-9',
      title: 'Suivi individuel (Thomas Dubois)',
      promotion: 'DW2025 • Développeur Web',
      responsible: 'Samir Derardja',
      avatarText: 'SD',
      priority: 'Moyenne',
      dueDate: '17 nov. 2026',
      status: 'in_progress',
      notes: 'Plan d\'accompagnement sur les requêtes SQL',
    },
    {
      id: 'act-10',
      title: 'Atelier Git & GitHub avancé',
      promotion: 'DW2025 • Développeur Web',
      responsible: 'P. Lambert',
      avatarText: 'PL',
      priority: 'Moyenne',
      dueDate: '21 nov. 2026',
      status: 'in_progress',
    },
    {
      id: 'act-11',
      title: 'Point d\'étape semestriel tuteurs',
      promotion: 'CDA2026 • Concepteur Dév.',
      responsible: 'Samir Derardja',
      avatarText: 'SD',
      priority: 'Haute',
      dueDate: '24 nov. 2026',
      status: 'in_progress',
    },
    {
      id: 'act-12',
      title: 'Accompagnement certification Agile',
      promotion: 'DSO2026 • DevSecOps',
      responsible: 'P. Lambert',
      avatarText: 'PL',
      priority: 'Basse',
      dueDate: '28 nov. 2026',
      status: 'in_progress',
    },
    {
      id: 'act-13',
      title: 'Préparation soutenance orale',
      promotion: 'SIO2025 • BTS SIO',
      responsible: 'M. Benali',
      avatarText: 'MB',
      priority: 'Moyenne',
      dueDate: '30 nov. 2026',
      status: 'in_progress',
    },
    {
      id: 'act-14',
      title: 'Suivi d\'intégration en entreprise',
      promotion: 'CYB2026 • Cybersécurité',
      responsible: 'C. Vasseur',
      avatarText: 'CV',
      priority: 'Haute',
      dueDate: '16 nov. 2026',
      status: 'in_progress',
    },
    {
      id: 'act-15',
      title: 'Révision des maquettes Figma',
      promotion: 'DW2025 • Développeur Web',
      responsible: 'J. Martin',
      avatarText: 'JM',
      priority: 'Basse',
      dueDate: '02 déc. 2026',
      status: 'in_progress',
    },
    {
      id: 'act-16',
      title: 'Installation environnement Docker',
      promotion: 'DSO2026 • DevSecOps',
      responsible: 'P. Lambert',
      avatarText: 'PL',
      priority: 'Moyenne',
      dueDate: '25 nov. 2026',
      status: 'in_progress',
    },
    {
      id: 'act-17',
      title: 'Tutorat pairs-à-pairs JavaScript',
      promotion: 'DW2025 • Développeur Web',
      responsible: 'Samir Derardja',
      avatarText: 'SD',
      priority: 'Moyenne',
      dueDate: '27 nov. 2026',
      status: 'in_progress',
    },
    {
      id: 'act-18',
      title: 'Contrôle assiduité hebdomadaire',
      promotion: 'CDA2026 • Concepteur Dév.',
      responsible: 'Samir Derardja',
      avatarText: 'SD',
      priority: 'Haute',
      dueDate: '13 nov. 2026',
      status: 'in_progress',
    },
    {
      id: 'act-19',
      title: 'Audit sécurité TP Réseaux',
      promotion: 'CYB2026 • Cybersécurité',
      responsible: 'C. Vasseur',
      avatarText: 'CV',
      priority: 'Haute',
      dueDate: '23 nov. 2026',
      status: 'in_progress',
    },
    {
      id: 'act-20',
      title: 'Bilan de mi-parcours Qualiopi',
      promotion: 'DW2025 • Développeur Web',
      responsible: 'Samir Derardja',
      avatarText: 'SD',
      priority: 'Haute',
      dueDate: '15 nov. 2026',
      status: 'in_progress',
    },
    {
      id: 'act-21',
      title: 'Émargements électroniques Nevea',
      promotion: 'SIO2025 • BTS SIO',
      responsible: 'M. Benali',
      avatarText: 'MB',
      priority: 'Moyenne',
      dueDate: '19 nov. 2026',
      status: 'in_progress',
    },

    // Colonne 3 : Clôturées (12)
    {
      id: 'act-22',
      title: 'Remise à niveau environnement Linux',
      promotion: 'DW2025 • Développeur Web',
      responsible: 'P. Lambert',
      avatarText: 'PL',
      priority: 'Moyenne',
      dueDate: '28 oct. 2026',
      status: 'completed',
    },
    {
      id: 'act-23',
      title: 'Accompagnement convention de stage',
      promotion: 'DW2025 • Développeur Web',
      responsible: 'Samir Derardja',
      avatarText: 'SD',
      priority: 'Haute',
      dueDate: '30 oct. 2026',
      status: 'completed',
    },
    {
      id: 'act-24',
      title: 'Entretien initial d\'intégration',
      promotion: 'CDA2026 • Concepteur Dév.',
      responsible: 'J. Martin',
      avatarText: 'JM',
      priority: 'Moyenne',
      dueDate: '25 oct. 2026',
      status: 'completed',
    },
    {
      id: 'act-25',
      title: 'Validation des prérequis TypeScript',
      promotion: 'DW2025 • Développeur Web',
      responsible: 'P. Lambert',
      avatarText: 'PL',
      priority: 'Haute',
      dueDate: '02 nov. 2026',
      status: 'completed',
    },
    {
      id: 'act-26',
      title: 'Point assiduité septembre',
      promotion: 'SIO2025 • BTS SIO',
      responsible: 'M. Benali',
      avatarText: 'MB',
      priority: 'Moyenne',
      dueDate: '05 oct. 2026',
      status: 'completed',
    },
    {
      id: 'act-27',
      title: 'Mise en place salle serveurs',
      promotion: 'CYB2026 • Cybersécurité',
      responsible: 'C. Vasseur',
      avatarText: 'CV',
      priority: 'Basse',
      dueDate: '18 oct. 2026',
      status: 'completed',
    },
    {
      id: 'act-28',
      title: 'Livret d\'accueil dématérialisé',
      promotion: 'DW2025 • Développeur Web',
      responsible: 'Samir Derardja',
      avatarText: 'SD',
      priority: 'Basse',
      dueDate: '10 sept. 2026',
      status: 'completed',
    },
  ]);

  // Filtres dropdown : Toutes les promotions, Tous les responsables, Tous les statuts
  const [selectedPromo, setSelectedPromo] = useState('all');
  const [selectedResponsible, setSelectedResponsible] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [search, setSearch] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPromo, setNewPromo] = useState('DW2025 • Développeur Web');
  const [newResponsible, setNewResponsible] = useState('Samir Derardja');
  const [newPriority, setNewPriority] = useState<'Haute' | 'Moyenne' | 'Basse'>('Haute');
  const [newDueDate, setNewDueDate] = useState('20 nov. 2026');

  const filteredActions = actions.filter((a) => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
                          a.promotion.toLowerCase().includes(search.toLowerCase());
    const matchesPromo = selectedPromo === 'all' || a.promotion.includes(selectedPromo);
    const matchesResp = selectedResponsible === 'all' || a.responsible === selectedResponsible;
    const matchesPriority = selectedPriority === 'all' || a.priority === selectedPriority;
    return matchesSearch && matchesPromo && matchesResp && matchesPriority;
  });

  const todoActions = filteredActions.filter((a) => a.status === 'todo');
  const inProgressActions = filteredActions.filter((a) => a.status === 'in_progress');
  const completedActions = filteredActions.filter((a) => a.status === 'completed');

  const moveAction = (id: string, newStatus: 'todo' | 'in_progress' | 'completed') => {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const initials = newResponsible
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();

    const created: KanbanAction = {
      id: `act-${Date.now()}`,
      title: newTitle.trim(),
      promotion: newPromo,
      responsible: newResponsible,
      avatarText: initials,
      priority: newPriority,
      dueDate: newDueDate,
      status: 'todo',
    };

    setActions([created, ...actions]);
    setNewTitle('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* En-tête avec bouton de création de luxe */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Actions Correctives
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Pilotage pédagogique et suivi des plans d'accompagnement apprenants
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-extrabold text-xs shadow-[0_4px_16px_rgba(15,23,42,0.2)] transition-all hover:scale-102 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-[#00D084]" />
          <span>Nouvelle action</span>
        </button>
      </div>

      {/* Barre de filtres en verre translucide */}
      <div className="glass-panel p-3.5 rounded-3xl flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Recherche */}
        <div className="relative flex-1 min-w-[260px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une action pédagogique..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/70 hover:bg-white focus:bg-white text-xs pl-9 pr-3.5 py-2.5 rounded-2xl border border-white/90 outline-none focus:border-slate-800 transition shadow-2xs placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* Dropdown 1 : Promotions */}
          <select
            value={selectedPromo}
            onChange={(e) => setSelectedPromo(e.target.value)}
            className="bg-white/80 border border-white/90 rounded-2xl px-3.5 py-2 font-semibold text-slate-700 text-xs outline-none cursor-pointer hover:bg-white shadow-2xs"
          >
            <option value="all">Toutes les promotions</option>
            <option value="DW2025">DW2025 • Développeur Web</option>
            <option value="CDA2026">CDA2026 • Concepteur Dév.</option>
            <option value="SIO2025">SIO2025 • BTS SIO</option>
            <option value="CYB2026">CYB2026 • Cybersécurité</option>
            <option value="DSO2026">DSO2026 • DevSecOps</option>
          </select>

          {/* Dropdown 2 : Responsables */}
          <select
            value={selectedResponsible}
            onChange={(e) => setSelectedResponsible(e.target.value)}
            className="bg-white/80 border border-white/90 rounded-2xl px-3.5 py-2 font-semibold text-slate-700 text-xs outline-none cursor-pointer hover:bg-white shadow-2xs"
          >
            <option value="all">Tous les responsables</option>
            <option value="Samir Derardja">Samir Derardja</option>
            <option value="J. Martin">J. Martin</option>
            <option value="P. Lambert">P. Lambert</option>
            <option value="M. Benali">M. Benali</option>
            <option value="C. Vasseur">C. Vasseur</option>
          </select>

          {/* Dropdown 3 : Priorités */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-white/80 border border-white/90 rounded-2xl px-3.5 py-2 font-semibold text-slate-700 text-xs outline-none cursor-pointer hover:bg-white shadow-2xs"
          >
            <option value="all">Toutes priorités</option>
            <option value="Haute">Priorité Haute</option>
            <option value="Moyenne">Priorité Moyenne</option>
            <option value="Basse">Priorité Basse</option>
          </select>
        </div>
      </div>

      {/* 3 Colonnes Kanban strictes en verre translucide : À faire (7), En cours (14), Clôturées (12) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {/* COLONNE 1 : À faire (7) */}
        <div className="bg-white/45 backdrop-blur-xl p-4 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-3 min-h-[550px]">
          <div className="flex items-center justify-between px-1 mb-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span>
              <h3 className="font-extrabold text-slate-900 text-xs tracking-wide">
                À faire ({todoActions.length})
              </h3>
            </div>
            <span className="text-[10px] font-bold text-slate-700 bg-white/80 border border-slate-200/60 px-2.5 py-0.5 rounded-full font-mono shadow-2xs">
              À planifier
            </span>
          </div>

          <div className="space-y-3">
            {todoActions.map((act) => (
              <div
                key={act.id}
                className="glass-card p-4 rounded-2xl space-y-3"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md font-mono ${
                      act.priority === 'Haute'
                        ? 'bg-rose-50 text-[#F43F5E] border border-rose-200/80'
                        : act.priority === 'Moyenne'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {act.priority}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{act.dueDate}</span>
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{act.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{act.promotion}</p>
                </div>

                {act.notes && (
                  <p className="text-[11px] text-slate-600 bg-white/70 p-2.5 rounded-xl border border-white/90 shadow-2xs">
                    {act.notes}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/60">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-[#0F172A] text-white text-[10px] font-bold flex items-center justify-center font-mono shadow-2xs">
                      {act.avatarText}
                    </div>
                    <span className="text-[11px] font-medium text-slate-600">{act.responsible}</span>
                  </div>

                  <button
                    onClick={() => moveAction(act.id, 'in_progress')}
                    className="text-[11px] font-bold text-[#00A86B] hover:text-[#00D084] flex items-center space-x-0.5 transition"
                  >
                    <span>Lancer</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLONNE 2 : En cours (14) */}
        <div className="bg-white/45 backdrop-blur-xl p-4 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-3 min-h-[550px]">
          <div className="flex items-center justify-between px-1 mb-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00D084] shadow-sm shadow-[#00D084]/50 animate-pulse"></span>
              <h3 className="font-extrabold text-slate-900 text-xs tracking-wide">
                En cours ({inProgressActions.length})
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-[#00D084]/15 border border-[#00D084]/25 px-2.5 py-0.5 rounded-full font-mono shadow-2xs">
              Suivi actif
            </span>
          </div>

          <div className="space-y-3">
            {inProgressActions.map((act) => (
              <div
                key={act.id}
                className="glass-card p-4 rounded-2xl space-y-3"
              >
                <div className="flex items-start justify-between">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md font-mono ${
                      act.priority === 'Haute'
                        ? 'bg-rose-50 text-[#F43F5E] border border-rose-200/80'
                        : act.priority === 'Moyenne'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {act.priority}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{act.dueDate}</span>
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{act.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{act.promotion}</p>
                </div>

                {act.notes && (
                  <p className="text-[11px] text-slate-600 bg-white/70 p-2.5 rounded-xl border border-white/90 shadow-2xs">
                    {act.notes}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-white/60">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-[#0F172A] text-white text-[10px] font-bold flex items-center justify-center font-mono shadow-2xs">
                      {act.avatarText}
                    </div>
                    <span className="text-[11px] font-medium text-slate-600">{act.responsible}</span>
                  </div>

                  <button
                    onClick={() => moveAction(act.id, 'completed')}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-0.5 transition"
                  >
                    <span>Clôturer</span>
                    <CheckCircle2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLONNE 3 : Clôturées (12) */}
        <div className="bg-white/45 backdrop-blur-xl p-4 rounded-3xl border border-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.02)] space-y-3 min-h-[550px]">
          <div className="flex items-center justify-between px-1 mb-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h3 className="font-extrabold text-slate-900 text-xs tracking-wide">
                Clôturées ({completedActions.length})
              </h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono shadow-2xs">
              Validées
            </span>
          </div>

          <div className="space-y-3">
            {completedActions.map((act) => (
              <div
                key={act.id}
                className="bg-white/70 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-2xs space-y-3 opacity-90 hover:opacity-100 transition"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Terminée
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{act.dueDate}</span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-700 line-through decoration-slate-400">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{act.promotion}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/60">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-lg bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center font-mono">
                      {act.avatarText}
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">{act.responsible}</span>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Archivée</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal : Nouvelle action corrective en verre translucide */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white/90 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Nouvelle Action Corrective
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAction} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Intitulé de l'action *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Soutien en programmation orientée objet"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 outline-none focus:border-slate-800 transition"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Promotion concernée
                </label>
                <select
                  value={newPromo}
                  onChange={(e) => setNewPromo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 outline-none"
                >
                  <option value="DW2025 • Développeur Web">DW2025 • Développeur Web</option>
                  <option value="CDA2026 • Concepteur Dév.">CDA2026 • Concepteur Dév.</option>
                  <option value="SIO2025 • BTS SIO">SIO2025 • BTS SIO</option>
                  <option value="CYB2026 • Cybersécurité">CYB2026 • Cybersécurité</option>
                  <option value="DSO2026 • DevSecOps">DSO2026 • DevSecOps</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Responsable
                  </label>
                  <select
                    value={newResponsible}
                    onChange={(e) => setNewResponsible(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 outline-none"
                  >
                    <option value="Samir Derardja">Samir Derardja</option>
                    <option value="J. Martin">J. Martin</option>
                    <option value="P. Lambert">P. Lambert</option>
                    <option value="M. Benali">M. Benali</option>
                    <option value="C. Vasseur">C. Vasseur</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Priorité
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 outline-none"
                  >
                    <option value="Haute">Haute</option>
                    <option value="Moyenne">Moyenne</option>
                    <option value="Basse">Basse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Échéance
                </label>
                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 outline-none font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-[#0F172A] text-white font-extrabold hover:bg-[#1E293B] transition"
                >
                  Créer l'action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionsPage;
