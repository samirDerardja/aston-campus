import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Users, UserCheck, AlertTriangle, ArrowRight,
  Clock, Calendar, CheckCircle2, ChevronRight, MessageSquare,
  Sparkles, ShieldAlert, FileSpreadsheet, Building2, UserX,
  Phone, Mail, X, Check, BellRing, Filter, AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { StudentAlert } from '../types';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { alerts, partners, convertAlertToAction, dismissAlert, currentUser } = useApp();

  const [alertFilter, setAlertFilter] = useState<'all' | 'absences' | 'retards' | 'helpline' | 'xefi'>('all');
  const [contactModalAlert, setContactModalAlert] = useState<StudentAlert | null>(null);
  const [processingAlertId, setProcessingAlertId] = useState<string | null>(null);

  // Donut chart data: 28 actions au total (luxury color palette: Emerald, Dark Slate, Rose, Pearl)
  const actionStatusData = [
    { name: 'En cours', value: 14, color: '#0F172A' },
    { name: 'À faire', value: 7, color: '#00D084' },
    { name: 'En retard', value: 7, color: '#F43F5E' },
    { name: 'Clôturées', value: 0, color: '#CBD5E1' },
  ];

  const appointments = [
    {
      id: 'apt-1',
      title: 'Synchronisation Dev Web',
      time: 'Demain • 14:00',
      type: 'sync',
      badge: 'Réunion d\'équipe',
      color: 'bg-slate-900/5 text-slate-800 border-slate-200/80',
    },
    {
      id: 'apt-2',
      title: 'Entretien individuel (Thomas Dubois)',
      time: '13 nov. • 10:00',
      type: 'interview',
      badge: 'Point pédagogique',
      color: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20',
    },
    {
      id: 'apt-3',
      title: 'Réunion pédagogique formateurs',
      time: '14 nov. • 09:30',
      type: 'meeting',
      badge: 'Conseil pédagogique',
      color: 'bg-indigo-500/10 text-indigo-800 border-indigo-500/20',
    },
  ];

  // Filtrage des alertes
  const filteredAlerts = alerts.filter(a => {
    if (a.status === 'dismissed' || a.status === 'resolved') return false;
    if (alertFilter === 'absences') return a.type === 'absence_repetition' || a.type === 'absence_longue';
    if (alertFilter === 'retards') return a.type === 'retard_repetition';
    if (alertFilter === 'helpline') return a.partnerName === 'Helpline' || a.promotionName?.toLowerCase().includes('helpline');
    if (alertFilter === 'xefi') return a.partnerName === 'XEFI' || a.promotionName?.toLowerCase().includes('xefi');
    return true;
  });

  const activeAlertsCount = alerts.filter(a => a.status === 'open' || a.status === 'in_progress').length;
  const criticalCount = alerts.filter(a => (a.status === 'open' || a.status === 'in_progress') && (a.severity === 'critical' || a.severity === 'high')).length;

  const handleConvertAction = async (alertId: string) => {
    setProcessingAlertId(alertId);
    try {
      await convertAlertToAction(alertId);
    } finally {
      setProcessingAlertId(null);
    }
  };

  const getReferentInfo = (promoName?: string, partnerName?: string) => {
    if (partnerName === 'Helpline' || promoName?.toLowerCase().includes('helpline')) {
      return { 
        name: 'Mourad', 
        role: 'Formateur Référent officiel (Pôle Helpline & Partenaires ESN)', 
        phone: '+33 6 11 22 33 44',
        email: 'mourad.referent@aston.fr',
        partner: 'Helpline (Partenaire Historique)',
        partnerEmail: 'alternance@helpline.fr'
      };
    }
    if (partnerName === 'XEFI' || promoName?.toLowerCase().includes('xefi')) {
      return { 
        name: 'Mourad & Christelle', 
        role: 'Formateurs Référents (Pôle XEFI / Systèmes)', 
        phone: '+33 6 22 33 44 55',
        email: 'christelle.referente@aston.fr',
        partner: 'XEFI',
        partnerEmail: 'campus@xefi.fr'
      };
    }
    if (promoName?.toLowerCase().includes('esd') || partnerName?.toLowerCase().includes('cyber')) {
      return { 
        name: 'Mehdi', 
        role: 'Formateur Référent officiel (Pôle Sécurité Digitale & ESD)', 
        phone: '+33 6 33 44 55 66',
        email: 'mehdi.referent@aston.fr',
        partner: partnerName || 'Entreprise Partenaire',
        partnerEmail: 'contact@partenaire.fr'
      };
    }
    return { 
      name: 'Christelle', 
      role: 'Formatrice Référente officielle (Pôle Systèmes & TSAS)', 
      phone: '+33 6 22 33 44 55',
      email: 'christelle.referente@aston.fr',
      partner: partnerName || 'Entreprise Partenaire',
      partnerEmail: 'contact@partenaire.fr'
    };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. En-tête de bienvenue avec style luxe */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Bonjour {currentUser.firstName} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Voici la situation pédagogique du campus Aston Informatique • Rythme alternance : 1 sem. école / 3 sem. entreprise
          </p>
        </div>

        {/* Bouton d'import direct Nevea & Date */}
        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <button
            onClick={() => navigate('/import-nevea')}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-slate-900 to-slate-800 hover:to-slate-700 text-white px-4 py-2 rounded-2xl border border-slate-700 shadow-sm text-xs font-bold transition hover:scale-102"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#00D084]" />
            <span>Importer Émargements Nevea</span>
          </button>

          <div className="inline-flex items-center space-x-2 bg-white/70 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/80 shadow-[0_4px_16px_rgba(0,0,0,0.03)] text-xs font-semibold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-[#00D084]" />
            <span>Mer. 11 nov. 2026</span>
          </div>
        </div>
      </div>

      {/* 2. 4 cartes statistiques en ligne avec glassmorphism translucide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Carte 1 : Promotions */}
        <div 
          onClick={() => navigate('/promotions')}
          className="glass-card p-5 rounded-2xl cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider font-mono">
            <span>PROMOTIONS</span>
            <div className="w-9 h-9 rounded-xl bg-slate-900/5 group-hover:bg-[#0F172A] text-slate-700 group-hover:text-white flex items-center justify-center transition-colors border border-white/80 shadow-2xs">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              9
            </span>
            <p className="text-[11px] text-slate-400 mt-1">Cohortes (Helpline 40/42/43, XEFI, TSRS...)</p>
          </div>
        </div>

        {/* Carte 2 : Apprenants (+4) */}
        <div 
          onClick={() => navigate('/apprenants')}
          className="glass-card p-5 rounded-2xl cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider font-mono">
            <span>APPRENANTS</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 group-hover:bg-[#00D084] text-emerald-600 group-hover:text-white flex items-center justify-center transition-colors border border-emerald-500/20 shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              159
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-[#00D084]/15 border border-[#00D084]/30 px-2 py-0.5 rounded-full font-mono backdrop-blur-xs">
              1 sem./3 sem.
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Alternance ESN (Helpline, XEFI...) & Initial</p>
        </div>

        {/* Carte 3 : Formateurs Référents (Mourad, Christelle, Mehdi) */}
        <div 
          onClick={() => navigate('/promotions')}
          className="glass-card p-5 rounded-2xl cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider font-mono">
            <span>RÉFÉRENTS OFFICIELS</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 group-hover:bg-[#0F172A] text-indigo-600 group-hover:text-white flex items-center justify-center transition-colors border border-indigo-500/20 shadow-2xs">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono">
              3
            </span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full font-mono">
              +15 form.
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Mourad (Helpline), Christelle, Mehdi</p>
        </div>

        {/* Carte 4 : Alertes Assiduité Temps Réel */}
        <div 
          onClick={() => {
            const el = document.getElementById('alerts-section');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-rose-50/70 backdrop-blur-xl p-5 rounded-2xl border border-rose-200/70 shadow-[0_8px_30px_rgba(244,63,94,0.06)] hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between text-xs text-rose-600 font-bold uppercase tracking-wider font-mono">
            <span>ALERTES ASSIDUITÉ</span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-[#F43F5E] flex items-center justify-center border border-rose-200 shadow-2xs relative">
              <AlertTriangle className="w-4 h-4" />
              {criticalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-600 rounded-full animate-ping"></span>
              )}
            </div>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-[#F43F5E] tracking-tight font-mono">
              {activeAlertsCount}
            </span>
            <span className="text-xs font-bold text-rose-700 bg-rose-100 border border-rose-200 px-2 py-0.5 rounded-full font-mono">
              {criticalCount} critiques
            </span>
          </div>
          <p className="text-[11px] text-rose-500 font-medium mt-1">Retards & absences semaine en centre</p>
        </div>
      </div>

      {/* 3. SECTION SPÉCIALE : ALERTES ASSIDUITÉ & VIGILANCE EN TEMPS RÉEL (DEMANDE CLIENT PRIORITAIRE) */}
      <div id="alerts-section" className="glass-card rounded-3xl p-6 space-y-5 border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600">
                <BellRing className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Alertes d'Assiduité & Vigilance (Temps Réel)
              </h2>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 font-mono">
                {activeAlertsCount} actives
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Surveillance continue issue des émargements Nevea pour la semaine en cours • Rythme 1 sem. école / 3 sem. entreprise
            </p>
          </div>

          {/* Filtres interactifs par type et partenaire */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60 text-xs">
            <button
              onClick={() => setAlertFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                alertFilter === 'all' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Toutes ({activeAlertsCount})
            </button>
            <button
              onClick={() => setAlertFilter('absences')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1 ${
                alertFilter === 'absences' 
                  ? 'bg-rose-500 text-white shadow-xs' 
                  : 'text-rose-700 hover:bg-rose-50'
              }`}
            >
              <UserX className="w-3 h-3" />
              <span>Absences</span>
            </button>
            <button
              onClick={() => setAlertFilter('retards')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1 ${
                alertFilter === 'retards' 
                  ? 'bg-amber-500 text-white shadow-xs' 
                  : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>Retards cumulés</span>
            </button>
            <button
              onClick={() => setAlertFilter('helpline')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1 ${
                alertFilter === 'helpline' 
                  ? 'bg-[#0F172A] text-white shadow-xs' 
                  : 'text-slate-800 hover:bg-slate-200/60'
              }`}
            >
              <Building2 className="w-3 h-3 text-[#00D084]" />
              <span>Helpline (ESN)</span>
            </button>
            <button
              onClick={() => setAlertFilter('xefi')}
              className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center space-x-1 ${
                alertFilter === 'xefi' 
                  ? 'bg-indigo-600 text-white shadow-xs' 
                  : 'text-indigo-700 hover:bg-indigo-50'
              }`}
            >
              <span>XEFI</span>
            </button>
          </div>
        </div>

        {/* Grille des cartes d'alerte */}
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center bg-white/50 rounded-2xl border border-slate-200/60">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-800">Aucune alerte active dans cette catégorie</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Toutes les assiduités de ce filtre sont conformes au seuil Qualiopi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAlerts.map((alert) => {
              const refInfo = getReferentInfo(alert.promotionName, alert.partnerName);
              const isProcessing = processingAlertId === alert.id;
              const isCritical = alert.severity === 'critical';
              const isHigh = alert.severity === 'high';

              return (
                <div 
                  key={alert.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCritical 
                      ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300 shadow-[0_4px_20px_rgba(244,63,94,0.06)]' 
                      : isHigh 
                      ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300 shadow-[0_4px_20px_rgba(245,158,11,0.06)]'
                      : 'bg-white/70 border-white/90 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header de la carte d'alerte */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full font-mono border ${
                          isCritical 
                            ? 'bg-rose-100 text-rose-800 border-rose-300' 
                            : isHigh 
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}>
                          {alert.severity === 'critical' ? 'Urgent / Critique' : alert.severity === 'high' ? 'Vigilance Haute' : 'À surveiller'}
                        </span>

                        {alert.partnerName && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            alert.partnerName === 'Helpline' 
                              ? 'bg-slate-900 text-white border-slate-700' 
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {alert.partnerName}
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400 font-mono">
                        {alert.triggeredAt}
                      </span>
                    </div>

                    {/* Titre & Description */}
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {alert.title}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {alert.description}
                      </p>
                    </div>

                    {/* Métriques d'alerte & Formateur Référent */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                      <div className="bg-white/80 p-2 rounded-xl border border-slate-200/60">
                        <span className="text-[10px] text-slate-400 block font-semibold">Promotion / Cohorte</span>
                        <span className="font-bold text-slate-800 truncate block">
                          {alert.promotionName || 'Non rattaché'}
                        </span>
                        <span className="text-[10px] text-slate-500">1 sem. centre / 3 sem. ent.</span>
                      </div>

                      <div className="bg-white/80 p-2 rounded-xl border border-slate-200/60">
                        <span className="text-[10px] text-slate-400 block font-semibold">Formateur Référent</span>
                        <span className="font-bold text-indigo-700 truncate block">
                          {refInfo.name}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate block">{refInfo.role.split('(')[0]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions interactives en bas de carte */}
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      {alert.status === 'in_progress' ? (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl flex items-center space-x-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Action créée • En cours</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleConvertAction(alert.id)}
                          disabled={isProcessing}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition hover:scale-102 flex items-center space-x-1.5 disabled:opacity-60"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#00D084]" />
                          <span>{isProcessing ? 'Création...' : 'Créer action corrective'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => setContactModalAlert(alert)}
                        className="bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs px-3 py-1.5 rounded-xl border border-slate-200 transition shadow-2xs flex items-center space-x-1"
                      >
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>Contacter référent</span>
                      </button>
                    </div>

                    <button
                      onClick={() => dismissAlert(alert.id)}
                      title="Classer l'alerte"
                      className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-white transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Deux blocs centraux en verre translucide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bloc 1 : Actions par statut (Donut chart avec au centre "28 Actions") */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Actions par statut</h2>
              <p className="text-xs text-slate-500 mt-0.5">Répartition du plan d'accompagnement pédagogique</p>
            </div>
            <button 
              onClick={() => navigate('/actions')}
              className="text-xs font-bold text-slate-900 hover:text-[#00D084] transition"
            >
              Gérer ➔
            </button>
          </div>

          <div className="relative h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={actionStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={66}
                  outerRadius={94}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {actionStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any, name: any) => [`${value} actions`, name]}
                  contentStyle={{ 
                    backgroundColor: '#0F172A', 
                    borderRadius: '12px', 
                    border: 'none', 
                    color: '#fff', 
                    fontSize: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.2)' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centre du Donut : "28 Actions" */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900 font-mono">28</span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</span>
            </div>
          </div>

          {/* Légende détaillée en cartes de verre */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100/80">
            {actionStatusData.map((item) => (
              <div key={item.name} className="flex flex-col items-center p-2.5 rounded-xl bg-white/60 border border-white/90 shadow-2xs backdrop-blur-xs">
                <div className="flex items-center space-x-1.5 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-[11px] font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="text-base font-bold font-mono text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bloc 2 : Prochains rendez-vous en verre translucide */}
        <div className="glass-card rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Prochains rendez-vous</h2>
                <p className="text-xs text-slate-500 mt-0.5">Planning officiel des cours & séances du campus</p>
              </div>
              <button 
                onClick={() => navigate('/planning')}
                className="text-xs font-bold text-slate-900 hover:text-[#00D084] transition"
              >
                Planning complet ➔
              </button>
            </div>

            <div className="space-y-3">
              {appointments.map((apt) => (
                <div 
                  key={apt.id} 
                  className="p-3.5 rounded-2xl border border-white/90 bg-white/60 hover:bg-white/80 transition flex items-center justify-between shadow-2xs backdrop-blur-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-700 shadow-2xs">
                      <Clock className="w-4 h-4 text-[#0F172A]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{apt.title}</h4>
                      <p className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{apt.time}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-xs ${apt.color}`}>
                    {apt.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-500">
            <span>3 rendez-vous prévus cette semaine</span>
            <button 
              onClick={() => navigate('/synchronisations')}
              className="text-[#0F172A] font-bold hover:text-[#00D084] transition"
            >
              Voir les synchronisations
            </button>
          </div>
        </div>
      </div>

      {/* 5. Bannière en bas en dégradé de luxe avec effet verre */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#F43F5E] p-6 rounded-3xl text-white shadow-[0_12px_40px_rgba(15,23,42,0.18)] border border-white/20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Glow discret à l'intérieur */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>

        <div className="flex items-center space-x-4 relative z-10">
          <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold tracking-tight">
              À traiter en priorité : 7 actions en retard sur 28
            </h3>
            <p className="text-xs text-white/80 mt-0.5 max-w-xl">
              Ces actions pédagogiques nécessitent une relance immédiate auprès des coordinateurs et formateurs.
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/actions')}
          className="self-start sm:self-auto bg-white hover:bg-slate-50 text-[#0F172A] font-extrabold text-xs px-5 py-3 rounded-2xl shadow-sm transition-all hover:scale-102 flex items-center space-x-2 shrink-0 relative z-10"
        >
          <span>Voir les actions</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 6. MODAL DE CONTACT RÉFÉRENT & TUTEUR PARTENAIRE */}
      {contactModalAlert && (() => {
        const refInfo = getReferentInfo(contactModalAlert.promotionName, contactModalAlert.partnerName);
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200">
                    Coordination Pédagogique & ESN
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-2">
                    Signalement : {contactModalAlert.studentName || 'Apprenant'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Cohorte : {contactModalAlert.promotionName} • Partenaire : {contactModalAlert.partnerName || 'ESN'}
                  </p>
                </div>
                <button 
                  onClick={() => setContactModalAlert(null)}
                  className="p-1 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Détails du formateur référent officiel */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Formateur Référent Officiel</span>
                  <span className="text-xs font-extrabold text-slate-900">{refInfo.name}</span>
                </div>
                <p className="text-xs text-slate-600">{refInfo.role}</p>
                <div className="pt-2 flex items-center space-x-3 text-xs text-slate-700">
                  <a href={`tel:${refInfo.phone}`} className="flex items-center space-x-1.5 hover:text-indigo-600 font-semibold">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{refInfo.phone}</span>
                  </a>
                  <a href={`mailto:${refInfo.email}?subject=Signalement assiduité ${contactModalAlert.studentName}`} className="flex items-center space-x-1.5 hover:text-indigo-600 font-semibold">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{refInfo.email}</span>
                  </a>
                </div>
              </div>

              {/* Détails du tuteur d'entreprise / ESN */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase">Contact Partenaire Alternance</span>
                  <span className="text-xs font-extrabold text-emerald-900">{refInfo.partner}</span>
                </div>
                <p className="text-xs text-emerald-700">
                  Service Alternance & Relations Écoles pour le suivi en entreprise (3 sem./mois).
                </p>
                <div className="pt-1 flex items-center space-x-3 text-xs text-emerald-800 font-semibold">
                  <a href={`mailto:${refInfo.partnerEmail}?subject=Signalement assiduité ${contactModalAlert.studentName}&body=Bonjour,%0D%0A%0D%0ANous vous informons d'un signalement d'assiduité concernant l'apprenant ${contactModalAlert.studentName} :%0D%0A${contactModalAlert.title}%0D%0A${contactModalAlert.description}%0D%0A%0D%0ACordialement,%0D%0AL'équipe pédagogique Aston Campus`} className="flex items-center space-x-1.5 hover:underline">
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{refInfo.partnerEmail}</span>
                  </a>
                </div>
              </div>

              {/* Actions de clôture modal */}
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  onClick={() => {
                    setContactModalAlert(null);
                    navigate('/entretiens');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Planifier un entretien
                </button>
                <button
                  onClick={() => setContactModalAlert(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default DashboardPage;
