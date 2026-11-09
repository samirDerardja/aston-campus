import React from 'react';
import { Search, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const { setCommandPaletteOpen, unreadNotificationsCount } = useApp();

  return (
    <header className="h-16 bg-white border-b border-slate-100 px-8 flex items-center justify-between shrink-0 z-10">
      <div className="flex-1 max-w-lg">
        {/* Raccourci Command Palette (style Linear / maquette exacte) */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between bg-[#F4F5FA] hover:bg-[#EEF0F8] text-slate-400 text-xs px-3.5 py-2 rounded-xl transition duration-150 border border-slate-100/80"
        >
          <div className="flex items-center space-x-2.5">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-normal">Rechercher un apprenant, une promotion...</span>
          </div>
          <kbd className="font-mono text-[10px] text-slate-400 bg-white border border-slate-200/80 px-1.5 py-0.5 rounded shadow-2xs">
            ⌘ K
          </kbd>
        </button>
      </div>

      <div className="flex items-center space-x-4">
        {/* Cloche de notifications */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
        </button>

        {/* Avatar profil */}
        <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-slate-200">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="Samir Derardja"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};
