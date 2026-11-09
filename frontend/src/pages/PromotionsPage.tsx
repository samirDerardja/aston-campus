import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, Search, Filter, Calendar, Users, 
  ChevronRight, ArrowUpDown, LayoutGrid, List, CheckCircle, Clock
} from 'lucide-react';

export const PromotionsPage: React.FC = () => {
  const { promotions } = useApp();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredPromos = promotions.filter(promo => {
    const matchesSearch = 
      promo.name.toLowerCase().includes(search.toLowerCase()) ||
      promo.code.toLowerCase().includes(search.toLowerCase()) ||
      promo.cursusName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || promo.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Entête de page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Promotions & Cursus</h1>
          <p className="text-xs text-slate-500">
            Gestion des promotions actives sous référentiel Aston Informatique
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
              title="Vue grille"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md ${viewMode === 'table' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
              title="Vue tableau"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Barre de Filtres */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, code promotion, cursus..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actives en cours</option>
            <option value="upcoming">À venir (prochaine rentrée)</option>
            <option value="completed">Clôturées</option>
          </select>
        </div>
      </div>

      {/* Vue Grille (Cards Premium) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPromos.map((promo) => (
            <div
              key={promo.id}
              onClick={() => navigate(`/promotions/${promo.id}`)}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-indigo-400 hover:shadow-subtle cursor-pointer transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                    promo.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    promo.status === 'upcoming' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {promo.status === 'active' ? 'En cours' : promo.status === 'upcoming' ? 'À venir' : 'Clôturée'}
                  </span>
                  {promo.neveaReference && (
                    <span className="text-[10px] font-mono font-medium text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                      {promo.neveaReference}
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition">
                  {promo.name}
                </h3>
                <p className="text-xs text-indigo-600 font-medium mt-0.5">{promo.cursusName}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-1">Code: {promo.code}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Période :</span>
                    <span className="font-medium text-slate-800">{promo.startDate} ➔ {promo.endDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Coordinateur :</span>
                    <span className="font-medium text-slate-800">{promo.coordinatorName}</span>
                  </div>
                  {promo.referentTrainerName && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Formateur réf. :</span>
                      <span className="font-medium text-slate-800">{promo.referentTrainerName}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-xs text-slate-700 font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{promo.studentsCount} apprenants</span>
                </div>
                <span className="text-xs text-indigo-600 font-medium flex items-center group-hover:translate-x-0.5 transition">
                  <span>Accéder à la fiche</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Vue Tableau */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Promotion</th>
                <th className="py-3 px-4">Cursus</th>
                <th className="py-3 px-4">Année</th>
                <th className="py-3 px-4">Effectif</th>
                <th className="py-3 px-4">Coordinateur</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPromos.map((p) => (
                <tr 
                  key={p.id}
                  onClick={() => navigate(`/promotions/${p.id}`)}
                  className="hover:bg-slate-50 cursor-pointer transition"
                >
                  <td className="py-3 px-4 font-semibold text-slate-900">{p.name}</td>
                  <td className="py-3 px-4 text-slate-600">{p.cursusName}</td>
                  <td className="py-3 px-4 text-slate-500 font-mono">{p.academicYear}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{p.studentsCount} inscrits</td>
                  <td className="py-3 px-4 text-slate-700">{p.coordinatorName}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-indigo-600 font-medium">Consulter ➔</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
