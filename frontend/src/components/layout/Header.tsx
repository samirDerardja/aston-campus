import React, { useState } from 'react';
import { Search, Bell, Check, ExternalLink, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    notifications, 
    unreadNotificationsCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    setCommandPaletteOpen 
  } = useApp();

  const [isNotifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  const today = new Intl.DateTimeFormat('fr-FR', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  }).format(new Date());

  const formattedToday = today.charAt(0).toUpperCase() + today.slice(1);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-10">
      {/* Salutations & Date */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-base font-semibold text-slate-900">
            Bonjour, {currentUser.firstName} 👋
          </h1>
          <p className="text-xs text-slate-500 capitalize">{formattedToday}</p>
        </div>
      </div>

      {/* Barre de recherche globale & Notifications */}
      <div className="flex items-center space-x-3">
        {/* Raccourci Command Palette (Linear / Raycast style) */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 px-3 py-1.5 rounded-lg border border-slate-200/80 transition w-64 justify-between"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span>Rechercher une promotion, apprenant...</span>
          </div>
          <kbd className="font-mono text-[10px] bg-white border border-slate-200 rounded px-1 text-slate-400">⌘K</kbd>
        </button>

        {/* Centre de Notifications avec Popup */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">Notifications ({unreadNotificationsCount})</span>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Tout marquer comme lu
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <p className="p-4 text-center text-xs text-slate-400">Aucune notification</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        navigate(n.actionUrl);
                        setNotifOpen(false);
                      }}
                      className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition ${
                        !n.isRead ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between font-medium text-slate-900 mb-0.5">
                        <span className="truncate">{n.title}</span>
                        {!n.isRead && <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>}
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
