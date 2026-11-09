import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, GraduationCap, Users, UserCheck, CalendarCheck, 
  MessageSquareShare, CheckSquare, Calendar, FolderArchive, BarChart3,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { currentUser } = useApp();

  const navItems = [
    { to: '/', label: 'Tableau de bord', icon: LayoutDashboard },
    { to: '/promotions', label: 'Promotions', icon: GraduationCap },
    { to: '/apprenants', label: 'Apprenants', icon: Users },
    { to: '/formateurs', label: 'Formateurs', icon: UserCheck },
    { to: '/entretiens', label: 'Entretiens', icon: CalendarCheck },
    { to: '/synchronisations', label: 'Synchronisations', icon: MessageSquareShare },
    { to: '/actions', label: 'Actions', icon: CheckSquare },
    { to: '/planning', label: 'Planning', icon: Calendar },
    { to: '/documents', label: 'Documents', icon: FolderArchive },
    { to: '/reporting', label: 'Reporting', icon: BarChart3 },
  ];

  return (
    <aside className="w-56 bg-[#131126] text-slate-300 flex flex-col justify-between shrink-0 select-none border-r border-[#1F1C38] z-20">
      <div>
        {/* Brand header */}
        <div className="h-16 px-5 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-white stroke-2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L3 9l9 7 9-7-9-7z" />
              <path d="M3 14l9 7 9-7" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white tracking-tight leading-tight">Aston</span>
            <span className="text-sm font-bold text-white tracking-tight leading-tight -mt-0.5">Campus</span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#6E56CF] to-[#7C3AED] text-white shadow-lg shadow-purple-600/25 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User profile footer */}
      <div className="p-4 border-t border-[#1F1C38] bg-[#0E0D1E]/60">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Samir Derardja"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-purple-500/30"
            />
            <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#131126]"></span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Samir Derardja</p>
            <p className="text-[10px] text-slate-400 capitalize truncate">Coordination</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
