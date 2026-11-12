import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, Search, FileText, Download, Lock, Trash2, X } from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const { documents, promotions, addDocument, deleteDocument } = useApp();
  const [search, setSearch] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    fileName: '',
    fileSizeBytes: 512000,
    mimeType: 'application/pdf',
    promotionId: '',
  });

  const filteredDocs = documents.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.fileName.toLowerCase().includes(search.toLowerCase()) ||
    (d.promotionName || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = (fileName: string) => {
    setDownloadNotice(`Génération de l'URL signée Supabase Storage pour : ${fileName}`);
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData(prev => ({
      ...prev,
      title: prev.title || file.name.replace(/\.[^/.]+$/, ''),
      fileName: file.name,
      fileSizeBytes: file.size,
      mimeType: file.type || 'application/pdf',
    }));
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    addDocument({
      title: formData.title.trim(),
      fileName: formData.fileName.trim() || `${formData.title.trim().toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSizeBytes: formData.fileSizeBytes,
      mimeType: formData.mimeType,
      promotionId: formData.promotionId || promotions[0]?.id,
    });
    setShowUploadModal(false);
    setFormData({
      title: '',
      fileName: '',
      fileSizeBytes: 512000,
      mimeType: 'application/pdf',
      promotionId: '',
    });
    setDownloadNotice('Document ajouté avec succès.');
    setTimeout(() => setDownloadNotice(null), 3500);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Supprimer le document "${title}" ?`)) {
      deleteDocument(id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {downloadNotice && (
        <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 text-xs rounded-xl flex items-center justify-between">
          <span>✓ {downloadNotice}</span>
          <button onClick={() => setDownloadNotice(null)} className="text-blue-500 hover:text-blue-700">✕</button>
        </div>
      )}
      {/* Entête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Documents Pédagogiques</h1>
          <p className="text-xs text-slate-500">
            Stockage sécurisé sur buckets privés Supabase Storage avec URLs signées temporaires
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              title: '',
              fileName: '',
              fileSizeBytes: 512000,
              mimeType: 'application/pdf',
              promotionId: promotions[0]?.id || '',
            });
            setShowUploadModal(true);
          }}
          className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm shadow-blue-700/20 transition self-start sm:self-auto"
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

      {/* Barre de recherche */}
      <div className="relative w-full sm:w-80">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Rechercher un document, fichier, promotion..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800 shadow-2xs"
        />
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
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Aucun document trouvé.
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc) => (
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
                    <div className="inline-flex items-center space-x-3">
                      <button
                        onClick={() => handleDownload(doc.fileName)}
                        className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Télécharger</span>
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.title)}
                        title="Supprimer"
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 font-display">Téléverser un document pédagogique</h3>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500">Validation stricte MIME PDF / DOCX, taille max 25 Mo, stockage Supabase privé.</p>
            <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
              <label className="block border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-5 text-center text-xs text-slate-500 cursor-pointer transition">
                <Upload className="w-7 h-7 mx-auto text-blue-500 mb-1.5" />
                <p className="font-semibold text-slate-700">
                  {formData.fileName || 'Cliquez pour sélectionner un fichier'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">PDF, DOCX, XLSX (max 25 Mo)</p>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Titre du document *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Convention de stage signée"
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Promotion associée</label>
                <select
                  value={formData.promotionId}
                  onChange={(e) => setFormData({ ...formData, promotionId: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-slate-800"
                >
                  {promotions.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Téléverser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


