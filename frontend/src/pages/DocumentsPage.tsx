import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FolderArchive, Upload, Search, FileText, Download, ShieldCheck, Lock } from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { documents, promotions } = useApp();
  const [search, setSearch] = useState('');

  const filteredDocs = documents.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.fileName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Documents Pédagogiques</h1>
          <p className="text-xs text-slate-500">
            Stockage sécurisé sur buckets privés Supabase Storage avec URLs signées temporaires
          </p>
        </div>

        <button
          onClick={() => alert("Formulaire de téléversement sécurisé : validation de type MIME (PDF/DOCX) et limite 25 Mo.")}
          className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition"
        >
          <Upload className="w-4 h-4" />
          <span>Téléverser un document</span>
        </button>
      </div>

      {/* Info Sécurité */}
      <div className="bg-slate-900 text-slate-200 p-4 rounded-xl flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-white">Chiffrement et Buckets Privés Strictement Isolés</p>
            <p className="text-slate-400 text-[11px]">
              Aucun lien public permanent. Chaque téléchargement génère un jeton temporaire d'une durée de 60 secondes.
            </p>
          </div>
        </div>
      </div>

      {/* Table des documents */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Titre du document</th>
              <th className="py-3 px-4">Fichier & Taille</th>
              <th className="py-3 px-4">Promotion / Apprenant</th>
              <th className="py-3 px-4">Téléversé par</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50 transition">
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900 flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{doc.title}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-mono text-slate-600 block">{doc.fileName}</span>
                  <span className="text-[10px] text-slate-400">{(doc.fileSizeBytes / 1024 / 1024).toFixed(2)} Mo</span>
                </td>
                <td className="py-3 px-4 text-slate-700">
                  {doc.promotionName} {doc.studentName && `(${doc.studentName})`}
                </td>
                <td className="py-3 px-4 text-slate-600 font-medium">{doc.uploadedByName}</td>
                <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                  {new Date(doc.uploadedAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => alert(`Génération de l'URL signée Supabase Storage pour le document : ${doc.fileName}`)}
                    className="inline-flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Télécharger</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
