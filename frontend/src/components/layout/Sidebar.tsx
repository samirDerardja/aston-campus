import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, GraduationCap, Users, UserCheck, CalendarCheck, 
  MessageSquareShare, CheckSquare, Calendar, FolderArchive, BarChart3, 
  FileSpreadsheet, ShieldAlert, Settings, LogOut, ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { currentUser, switchRole, unreadNotificationsCount, actions } = useApp();

  const overdueActionsCount = actions.filter(
    a => a.status !== 'completed' && a.status !== 'cancelled' && new Date(a.dueDate) < new Date()
  ).length;

  const navItems = [
    { to: '/', label: 'Tableau de bord', icon: LayoutDashboard },
    { to: '/promotions', label: 'Promotions', icon: GraduationCap },
    { to: '/apprenants', label: 'Apprenants', icon: Users },
    { to: '/formateurs', label: 'Formateurs', icon: UserCheck },
    { to: '/entretiens', label: 'Entretiens', icon: CalendarCheck },
    { to: '/synchronisations', label: 'Synchronisations', icon: MessageSquareShare },
    { 
      to: '/actions', 
      label: 'Actions correctives', 
      icon: CheckSquare,
      badge: overdueActionsCount > 0 ? `${overdueActionsCount} retard` : undefined,
      badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200'
    },
    { to: '/planning', label: 'Planning', icon: Calendar },
    { to: '/documents', label: 'Documents', icon: FolderArchive },
    { to: '/reporting', label: 'Reporting', icon: BarChart3 },
    { to: '/import-nevea', label: 'Import Nevea', icon: FileSpreadsheet },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold shadow-md">
              A
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight">Aston Campus</span>
              <span className="block text-[10px] uppercase font-semibold text-indigo-400 tracking-wider">Coordination</span>
            </div>
          </div>
        </div>

        {/* Demo environment pill */}
        <div className="px-4 py-2.5">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-md px-3 py-1.5 flex items-center justify-between">
            <div className="flex items-center space-x-1.5 text-xs text-amber-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Démo active</span>
            </div>
            <select
              value={currentUser.role}
              onChange={(e) => switchRole(e.target.value as any)}
              className="bg-slate-800 text-[11px] text-slate-200 border border-slate-700 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              title="Changer de rôle pour tester les habilitations"
            >
              <option value="direction">Direction</option>
              <option value="coordinateur">Coordinateur</option>
              <option value="formateur">Formateur</option>
              <option value="admin_technique">Admin Tech</option>
            </select>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="px-3 py-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-250px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User footer profile */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/80">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800/50 transition">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center font-semibold text-indigo-300 shrink-0">
              {currentUser.firstName[0]}{currentUser.lastName[0]}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {currentUser.firstName} {currentUser.lastName}
              </p>
              <p className="text-[11px] text-slate-400 capitalize truncate">
                {currentUser.role.replace('_', ' ')}
              </p>
            </div>
          </div>
          <button 
            onClick={() => alert(`Connecté en tant que ${currentUser.firstName} ${currentUser.lastName} (${currentUser.role}). Déconnexion sécurisée.`)}
            className="text-slate-500 hover:text-slate-300 p-1.5 rounded-md hover:bg-slate-800 transition"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
