import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Filter, Briefcase, GraduationCap, ChevronRight } from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const { students, promotions } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedPromo, setSelectedPromo] = useState('all');

  const filteredStudents = students.filter(s => {
    const matchesSearch = 
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.companyName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesPromo = selectedPromo === 'all' || s.promotionId === selectedPromo;
    return matchesSearch && matchesPromo;
  });

  return (
    <div className="space-y-6">
      {/* Entête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Apprenants</h1>
          <p className="text-xs text-slate-500">
            Suivi individuel des étudiants en alternance du campus Aston Informatique
          </p>
        </div>
      </div>

      {/* Barre de Recherche & Filtres */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par apprenant, entreprise, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedPromo}
            onChange={(e) => setSelectedPromo(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Toutes les promotions</option>
            {promotions.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table des Apprenants */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">Apprenant</th>
              <th className="py-3 px-4">Promotion</th>
              <th className="py-3 px-4">Entreprise d'alternance</th>
              <th className="py-3 px-4">Tuteur</th>
              <th className="py-3 px-4">Assiduité</th>
              <th className="py-3 px-4">Statut</th>
              <th className="py-3 px-4 text-right">Fiche</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredStudents.map((s) => (
              <tr 
                key={s.id}
                onClick={() => navigate(`/apprenants/${s.id}`)}
                className="hover:bg-slate-50 cursor-pointer transition"
              >
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-900">{s.firstName} {s.lastName}</div>
                  <div className="text-[11px] text-slate-400 font-mono">{s.email}</div>
                </td>
                <td className="py-3 px-4 text-slate-700 font-medium">{s.promotionName}</td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-800">{s.companyName}</div>
                  <div className="text-[10px] text-slate-400">Alternance</div>
                </td>
                <td className="py-3 px-4 text-slate-600">{s.companyTutor}</td>
                <td className="py-3 px-4">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                    s.attendanceRate >= 90 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {s.attendanceRate}%
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    {s.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-indigo-600 font-medium">
                  Consulter ➔
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

