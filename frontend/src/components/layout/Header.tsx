import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { setCommandPaletteOpen, unreadNotificationsCount } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return 'Tableau de bord';
    if (path.startsWith('/promotions')) return 'Promotions & Cursus';
    if (path.startsWith('/apprenants')) return 'Apprenants';
    if (path.startsWith('/formateurs')) return 'Formateurs';
    if (path.startsWith('/entretiens')) return 'Entretiens d\'accompagnement';
    if (path.startsWith('/synchronisations')) return 'Synchronisations';
    if (path.startsWith('/actions')) return 'Actions correctives';
    if (path.startsWith('/planning')) return 'Planning des cours';
    if (path.startsWith('/documents')) return 'Documents & Livrables';
    if (path.startsWith('/reporting')) return 'Reporting & Indicateurs';
    return 'Coordination Pédagogique';
  };

  return (
    <header className="h-16 bg-white/70 backdrop-blur-xl border-b border-white/60 px-6 lg:px-8 flex items-center justify-between shrink-0 z-10 font-sans shadow-[0_4px_20px_rgba(0,0,0,0.015)]">
      {/* Left: Breadcrumb & Sync Status */}
      <div className="flex items-center space-x-3.5 min-w-0">
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
          <span 
            className="hover:text-slate-900 transition cursor-pointer font-bold text-slate-800" 
            onClick={() => navigate('/')}
          >
            Aston Campus
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-[#0F172A] font-extrabold truncate">{getBreadcrumb()}</span>
        </div>

        {/* Sync badge Nevea - Luxury Glass Badge */}
        <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#00D084]/10 text-emerald-800 border border-[#00D084]/25 text-[10px] font-bold font-mono tracking-wider backdrop-blur-md shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D084] animate-pulse"></span>
          <span>SYNCHRONISÉ AVEC NEVEA</span>
        </div>
      </div>

      {/* Center & Right: Glass Search, Notifications, Luxury Dark Action */}
      <div className="flex items-center space-x-3.5">
        {/* Glass Search Input with ⌘K */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center justify-between bg-white/60 hover:bg-white/85 text-slate-500 text-xs px-3.5 py-2 rounded-xl transition border border-white/80 shadow-2xs w-56 lg:w-72 backdrop-blur-md group"
        >
          <div className="flex items-center space-x-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition" />
            <span className="truncate">Rechercher apprenant, promo, action...</span>
          </div>
          <kbd className="font-mono text-[10px] text-slate-400 bg-white/80 border border-slate-200/80 px-1.5 py-0.5 rounded shadow-2xs">⌘K</kbd>
        </button>

        {/* Quick Action Button in Luxury Dark Navy */}
        <button
          onClick={() => navigate('/actions')}
          className="hidden md:inline-flex items-center space-x-1.5 bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-[0_4px_14px_rgba(15,23,42,0.18)] transition-all hover:shadow-[0_6px_20px_rgba(15,23,42,0.25)]"
        >
          <Plus className="w-3.5 h-3.5 text-[#00D084]" />
          <span>Nouvelle action</span>
        </button>

        {/* Bell icon with Glass Hover */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="p-2 rounded-xl bg-white/50 hover:bg-white/90 border border-white/70 text-slate-600 transition relative shadow-2xs backdrop-blur-md"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#F43F5E] shadow-sm shadow-[#F43F5E]/50"></span>
          )}
        </button>

        {/* Profile Card */}
        <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200/60">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-tight">Samir Derardja</p>
            <p className="text-[10px] text-emerald-600 font-bold leading-tight font-mono">COORDINATION</p>
          </div>
          <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center font-mono shadow-xs border border-white/40">
            SD
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
