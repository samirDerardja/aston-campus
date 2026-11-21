import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, GraduationCap, Users, 
  MessageSquare, RefreshCw, CheckSquare, Calendar, 
  FileText, BarChart3, FileSpreadsheet, LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const Sidebar: React.FC = () => {
  const { actions, currentUser, switchRole, logout } = useApp();
  const overdueCount = actions.filter(
    a => a.status !== 'completed' && a.status !== 'cancelled' && new Date(a.dueDate) < new Date()
  ).length || 7;

  // Navigation dédiée uniquement au Coordinateur Pédagogique, Responsable Pédagogique et Assistante Administrative
  // (Les vues Formateurs / Admin Technique sont masquées en frontend sans modifier la BDD)
  const navigationItems = [
    { name: 'Tableau de bord', to: '/', icon: LayoutDashboard },
    { name: 'Import Nevea (CSV)', to: '/import-nevea', icon: FileSpreadsheet },
    { name: 'Promotions', to: '/promotions', icon: GraduationCap },
    { name: 'Apprenants', to: '/apprenants', icon: Users },
    { name: 'Actions', to: '/actions', icon: CheckSquare, badge: overdueCount },
    { name: 'Entretiens', to: '/entretiens', icon: MessageSquare },
    { name: 'Synchronisations', to: '/synchronisations', icon: RefreshCw },
    { name: 'Planning', to: '/planning', icon: Calendar },
    { name: 'Documents', to: '/documents', icon: FileText },
    { name: 'Reporting', to: '/reporting', icon: BarChart3 },
  ];

  const roleLabels: Record<string, string> = {
    coordinateur: 'Coordinateur Pédagogique',
    direction: 'Responsable Pédagogique',
    assistante_admin: 'Assistante Administrative',
  };

  const initials = `${currentUser.firstName?.[0] || ''}${currentUser.lastName?.[0] || ''}`.toUpperCase() || 'SD';

  return (
    <aside className="w-64 bg-white text-[#1C1C1C] flex flex-col justify-between shrink-0 select-none border-r border-black/[0.06] z-20 font-sans h-full transition-all">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* SnowUI Light Brand Header */}
        <div className="px-2 pt-2 pb-1 flex items-center justify-between">
          <NavLink to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-[#1C1C1C] flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105 duration-200">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
            <div>
              <span className="font-semibold text-base text-[#1C1C1C] tracking-tight block">
                Aston Campus
              </span>
              <span className="text-[10px] font-medium tracking-wider uppercase text-black/40 font-mono">
                PÉDAGOGIE & ADMIN
              </span>
            </div>
          </NavLink>
        </div>

        {/* Navigation items SnowUI Light */}
        <nav className="space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#1C1C1C]/[0.05] text-[#1C1C1C] font-semibold'
                    : 'text-black/60 hover:text-[#1C1C1C] hover:bg-[#F9F9FA]'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </div>
              {item.badge && item.badge > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-[#F43F5E] text-white shadow-xs">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Connected User Profile Footer with Role Switcher (3 profils actifs uniquement) */}
      <div className="p-3 border-t border-white/50 bg-white/40 backdrop-blur-md space-y-2">
        <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-white/70 border border-white/80 shadow-2xs">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#0F172A] text-white font-bold text-xs flex items-center justify-center font-mono shadow-xs shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-[10px] text-emerald-600 font-semibold leading-tight truncate">
                {roleLabels[currentUser.role] || 'Coordinateur Pédagogique'}
              </p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#00D084] shadow-sm shadow-[#00D084]/60 animate-pulse shrink-0"></span>
        </div>

        <select
          aria-label="Changer de profil actif"
          value={roleLabels[currentUser.role] ? currentUser.role : 'coordinateur'}
          onChange={(e) => switchRole(e.target.value as UserRole)}
          className="w-full text-[11px] font-semibold text-slate-700 bg-white/80 hover:bg-white border border-slate-200/80 rounded-xl px-2.5 py-1.5 outline-none cursor-pointer transition"
        >
          <option value="coordinateur">Vue : Coordinateur Pédagogique</option>
          <option value="direction">Vue : Responsable Pédagogique</option>
          <option value="assistante_admin">Vue : Assistante Administrative</option>
        </select>

        <button
          type="button"
          onClick={logout}
          className="w-full flex items-center justify-center space-x-1.5 text-[11px] font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50/80 rounded-xl py-1.5 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Se déconnecter</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
