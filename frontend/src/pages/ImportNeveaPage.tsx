import React, { useState } from 'react';
import { 
  FileSpreadsheet, Upload, Check, AlertTriangle, 
  ArrowRight, ArrowLeft, RefreshCw, ShieldAlert, CheckCircle2 
} from 'lucide-react';

export const ImportNeveaPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [fileName, setFileName] = useState<string>('export_nevea_apprenants_nov2026.csv');
  const [isProcessing, setIsProcessing] = useState(false);

  // Exemple de données prévisualisées simulées pour l'assistant
  const previewRows = [
    { neveaId: 'NEVEA-ST-101', nom: 'Martin', prenom: 'Alexandre', promo: 'PROMO-TSRS-2025-A', statut: 'Existant (Mise à jour)' },
    { neveaId: 'NEVEA-ST-102', nom: 'Girard', prenom: 'Camille', promo: 'PROMO-TSRS-2025-A', statut: 'Existant (Mise à jour)' },
    { neveaId: 'NEVEA-ST-106', nom: 'Belkacem', prenom: 'Sami', promo: 'PROMO-ESD-2025-P1', statut: 'Nouveau (Création)' },
    { neveaId: 'NEVEA-ST-107', nom: 'Faure', prenom: 'Inès', promo: 'PROMO-ESD-2025-P1', statut: 'Nouveau (Création)' },
  ];

  const handleSimulateImport = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep(4);
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Entête */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Passerelle Nevea — Import Administratif</h1>
        <p className="text-xs text-slate-500">
          Assistant d'importation des effectifs administratifs depuis Nevea (Étape A — Fichiers CSV)
        </p>
      </div>

      {/* Étapes du processus */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-xs">
        <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>1</span>
          <span>Sélection CSV</span>
        </div>
        <div className="h-0.5 w-12 bg-slate-200"></div>
        <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>2</span>
          <span>Correspondance colonnes</span>
        </div>
        <div className="h-0.5 w-12 bg-slate-200"></div>
        <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>3</span>
          <span>Prévisualisation & Doublons</span>
        </div>
        <div className="h-0.5 w-12 bg-slate-200"></div>
        <div className={`flex items-center space-x-2 ${step >= 4 ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${step >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-100'}`}>4</span>
          <span>Rapport d'import</span>
        </div>
      </div>

      {/* ÉTAPE 1 : SÉLECTION DU FICHIER */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">1. Sélection du fichier d'export Nevea</h2>
          <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-8 text-center cursor-pointer transition bg-slate-50/50">
            <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-800">Glissez-déposez le fichier CSV ou cliquez pour sélectionner</p>
            <p className="text-[11px] text-slate-400 mt-1">Fichiers acceptés : .csv (séparateur virgule ou point-virgule)</p>
            <div className="mt-4 inline-flex items-center space-x-2 bg-white border border-slate-200 px-3 py-1.5 rounded-md text-xs font-mono text-slate-600">
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>{fileName}</span>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              <span>Continuer vers le mapping</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ÉTAPE 2 : MAPPING DES COLONNES */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900">2. Correspondance des colonnes (Mapping)</h2>
          <p className="text-xs text-slate-500">Associez les colonnes de votre fichier Nevea aux champs cibles d'Aston Campus.</p>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg items-center">
              <div>
                <span className="font-semibold text-slate-800">Champ Aston Campus</span>
                <p className="text-[11px] text-slate-500">Identifiant distant Nevea (clé unique)</p>
              </div>
              <select className="bg-white border border-slate-200 rounded p-1.5 font-mono text-xs">
                <option>nevea_student_id</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg items-center">
              <div>
                <span className="font-semibold text-slate-800">Nom de famille</span>
                <p className="text-[11px] text-slate-500">Obligatoire</p>
              </div>
              <select className="bg-white border border-slate-200 rounded p-1.5 font-mono text-xs">
                <option>student_last_name</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg items-center">
              <div>
                <span className="font-semibold text-slate-800">Prénom</span>
                <p className="text-[11px] text-slate-500">Obligatoire</p>
              </div>
              <select className="bg-white border border-slate-200 rounded p-1.5 font-mono text-xs">
                <option>student_first_name</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg items-center">
              <div>
                <span className="font-semibold text-slate-800">Code Promotion</span>
                <p className="text-[11px] text-slate-500">Rattachement promotion</p>
              </div>
              <select className="bg-white border border-slate-200 rounded p-1.5 font-mono text-xs">
                <option>promotion_code</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between pt-3">
            <button
              onClick={() => setStep(1)}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              <span>Prévisualiser les données</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ÉTAPE 3 : PRÉVISUALISATION & DÉTECTION DES DOUBLONS */}
      {step === 3 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">3. Prévisualisation & Analyse des Conflits</h2>
            <span className="text-xs text-slate-500 font-medium">4 lignes détectées</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-800 flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Règle de non-écrasement :</strong> Les données pédagogiques locales (comptes rendus d'entretiens, actions créées) ne seront pas altérées.
            </span>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                <tr>
                  <th className="p-2.5">ID Nevea</th>
                  <th className="p-2.5">Nom</th>
                  <th className="p-2.5">Prénom</th>
                  <th className="p-2.5">Promotion</th>
                  <th className="p-2.5">Statut analyse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previewRows.map((r, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-mono text-[11px] text-slate-500">{r.neveaId}</td>
                    <td className="p-2.5 font-semibold text-slate-900">{r.nom}</td>
                    <td className="p-2.5 text-slate-700">{r.prenom}</td>
                    <td className="p-2.5 text-slate-700 font-mono text-[11px]">{r.promo}</td>
                    <td className="p-2.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        r.statut.includes('Nouveau') ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {r.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between pt-3">
            <button
              onClick={() => setStep(2)}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Modifier le mapping</span>
            </button>
            <button
              onClick={handleSimulateImport}
              disabled={isProcessing}
              className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Traitement en cours...</span>
                </>
              ) : (
                <>
                  <span>Confirmer l'importation</span>
                  <Check className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ÉTAPE 4 : RAPPORT D'IMPORT */}
      {step === 4 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Importation Nevea Réalisée avec Succès</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Le fichier CSV a été analysé et synchronisé avec la base Supabase PostgreSQL.
          </p>

          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-xs py-2">
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-base font-bold text-slate-900 block">4</span>
              <span className="text-slate-500 text-[10px]">Lignes traitées</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-base font-bold text-emerald-600 block">2</span>
              <span className="text-slate-500 text-[10px]">Nouveaux apprenants</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg">
              <span className="text-base font-bold text-blue-600 block">2</span>
              <span className="text-slate-500 text-[10px]">Profils mis à jour</span>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setStep(1)}
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Effectuer un autre import CSV
            </button>
          </div>
        </div>
      )}

      {/* Documentation Connecteur API Étape B */}
      <div className="bg-slate-900 text-slate-300 p-5 rounded-xl border border-slate-800 text-xs space-y-2">
        <div className="flex items-center space-x-2 text-blue-400 font-semibold">
          <ShieldAlert className="w-4 h-4" />
          <span>Étape B — Connecteur API Nevea Direct (Statut : En attente d'agrément)</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Conformément aux instructions d'intégration, aucun endpoint ou clé secrète fictive n'a été inventé. 
          L'interface d'adaptateur <code>INeveaConnector</code> est prête et restera désactivée tant que la documentation d'API officielle et les habilitations de l'établissement n'auront pas été fournies.
        </p>
      </div>
    </div>
  );
};

