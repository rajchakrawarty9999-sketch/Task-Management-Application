import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Activity, 
  UserCheck, 
  LogOut, 
  Menu,
  Command,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  CheckCheck,
  CalendarDays,
  Users2,
  CheckCircle2,
  AlertCircle,
  Inbox
} from 'lucide-react';

export const Header = ({ onToggleMobileMenu, isSidebarCollapsed, onToggleDesktopSidebar }) => {
  const { user, onlineUsers, demoLogin, logout, teamMembers } = useAuth();
  const { 
    filters, 
    setFilters, 
    setIsAuthModalOpen, 
    activities,
    notifications,
    unreadNotificationsCount,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveView
  } = useTasks();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const notifRef = useRef(null);
  const personaRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (personaRef.current && !personaRef.current.contains(e.target)) {
        setShowPersonaMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header 
        className={`fixed top-0 right-0 h-15 sm:h-16 bg-[#08090d]/95 backdrop-blur-xl border-b border-white/[0.06] px-3.5 sm:px-6 flex items-center justify-between z-40 transition-all duration-300 ease-out ${
          isSidebarCollapsed ? 'left-0' : 'left-0 lg:left-[240px] xl:left-[260px]'
        }`}
      >
        {/* Left: Sidebar Toggle Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-1 max-w-lg min-w-0">
          {/* Mobile/Tablet Hamburger Button (< 1024px) */}
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden w-10 h-10 -ml-1 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 active:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-[#edd295]" />
          </button>

          {/* Desktop Sidebar Toggle Button (≥ 1024px) */}
          <button
            onClick={onToggleDesktopSidebar}
            className={`hidden lg:flex items-center gap-2 h-9 px-2.5 rounded-xl border transition-all flex-shrink-0 ${
              isSidebarCollapsed
                ? 'bg-[#caa457]/15 border-[#caa457]/50 text-[#edd295] hover:bg-[#caa457]/25 shadow-gold-sm font-bold'
                : 'bg-[#0d0f15] border-white/[0.08] text-slate-400 hover:text-white hover:border-[#caa457]/40'
            }`}
            title={isSidebarCollapsed ? 'Open Sidebar (Ctrl + B)' : 'Hide Sidebar (Ctrl + B)'}
            aria-label="Toggle Sidebar"
          >
            {isSidebarCollapsed ? (
              <>
                <PanelLeftOpen className="w-4 h-4 text-[#caa457]" />
                <span className="text-xs font-mono">Open Menu</span>
              </>
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>

          {/* Logo on Tablet/Mobile */}
          <div className="lg:hidden flex items-center gap-2 font-bold text-sm text-slate-100 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#edd295] via-[#caa457] to-[#8c6628] flex items-center justify-center text-[#140e04] shadow-sm border border-white/20">
              <svg className="w-3.5 h-3.5 text-[#140e04]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="tracking-tight text-white hidden sm:inline">TaskEngine</span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border border-[#caa457]/50 text-[#edd295] bg-[#caa457]/10">
              PRO
            </span>
          </div>

          {/* Search Bar (Desktop & Tablet >= 768px) */}
          <div className="hidden md:flex relative w-full items-center min-w-0">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tasks, categories, or teammates..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full h-9 bg-[#0d0f15] hover:bg-[#12141c] focus:bg-[#141622] border border-white/[0.08] focus:border-[#caa457]/60 rounded-xl pl-9 pr-12 text-xs text-slate-200 placeholder:text-slate-500 transition-all focus:outline-none focus:ring-1 focus:ring-[#caa457]/30"
            />
            <div className="absolute right-2.5 hidden lg:flex items-center gap-0.5 text-[10px] font-mono text-slate-500 bg-white/[0.03] border border-white/[0.06] px-1.5 py-0.5 rounded">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Live Indicator Pill & Avatars (Desktop >= 1200px) */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#0d0f15] border border-[#caa457]/25">
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-[#edd295] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
              <span>LIVE</span>
            </span>
            <div className="h-3 w-px bg-white/10" />
            <div className="flex -space-x-1.5">
              {teamMembers.slice(0, 4).map((member) => {
                const isOnline = onlineUsers.some(u => u.id === member.id) || member.id === user?.id;
                return (
                  <div key={member.id} className="relative group cursor-pointer" title={`${member.name} (${isOnline ? 'Active' : 'Offline'})`}>
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className={`w-6 h-6 rounded-full border ${
                        isOnline ? 'border-[#caa457]' : 'border-slate-800 opacity-60'
                      } object-cover`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notifications Bell with Realtime Unread Count */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(prev => !prev)}
              className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-[#0d0f15] hover:bg-[#141622] active:bg-[#181c2b] border border-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center transition-colors relative"
              title="Notifications & Activity"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-300" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-[#caa457] to-[#8c6628] text-[#120d04] font-extrabold text-[10px] font-mono flex items-center justify-center shadow-gold-sm animate-pulse border border-[#120d04]">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notification Popover Dropdown */}
            {showNotifications && (
              <div className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-auto sm:mt-2 w-[calc(100vw-24px)] sm:w-96 rounded-2xl bg-[#0d0f15] border border-[#caa457]/35 p-3.5 sm:p-4 shadow-2xl z-50 animate-scale-in">
                {/* Header: Title + Unread badge + 'All Read' Button */}
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#caa457]" />
                    <h3 className="font-bold text-xs text-white uppercase tracking-wider font-mono">Notifications</h3>
                    {unreadNotificationsCount > 0 && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-[#caa457]/20 text-[#edd295] border border-[#caa457]/40">
                        {unreadNotificationsCount} unread
                      </span>
                    )}
                  </div>

                  {/* 'All Read' Button */}
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-mono font-bold text-[#caa457] hover:text-[#edd295] hover:underline flex items-center gap-1 transition-colors px-2 py-0.5 rounded-lg hover:bg-white/5"
                    title="Mark all notifications as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>All Read</span>
                  </button>
                </div>

                {/* Notifications Stream with Hover & Click to Read */}
                <div className="mt-2.5 max-h-80 overflow-y-auto space-y-2 pr-0.5 scrollbar-thin">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-slate-500 text-xs">
                      <Inbox className="w-6 h-6 mx-auto mb-1 text-slate-600" />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onMouseEnter={() => {
                          if (!notif.read) markNotificationRead(notif.id);
                        }}
                        onClick={() => {
                          if (!notif.read) markNotificationRead(notif.id);
                          if (notif.link) {
                            if (notif.link.includes('calendar')) setActiveView('calendar');
                            else if (notif.link.includes('kanban')) setActiveView('kanban');
                            else if (notif.link.includes('team')) setActiveView('team');
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all cursor-pointer ${
                          !notif.read
                            ? 'bg-[#151722] border-[#caa457]/40 text-slate-100 shadow-sm hover:border-[#caa457]'
                            : 'bg-white/[0.02] hover:bg-white/[0.04] border-white/[0.04] text-slate-400 opacity-80'
                        }`}
                      >
                        {/* Avatar / Icon */}
                        <div className="relative flex-shrink-0 mt-0.5">
                          <img
                            src={notif.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt="User"
                            className="w-7 h-7 rounded-lg object-cover border border-white/10"
                          />
                          {!notif.read && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#caa457] ring-2 ring-[#0d0f15]" />
                          )}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <h4 className={`text-xs font-bold truncate ${!notif.read ? 'text-[#edd295]' : 'text-slate-300'}`}>
                              {notif.title}
                            </h4>
                            <span className="text-[9px] font-mono text-slate-500 flex-shrink-0">
                              {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-[11px] leading-snug text-slate-300 line-clamp-2">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Subtitle / Tip */}
                <div className="pt-2 mt-2 border-t border-white/[0.06] text-[10px] text-slate-500 font-mono text-center">
                  Hover or click any item to mark as read
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={personaRef}>
            <button
              onClick={() => setShowPersonaMenu(prev => !prev)}
              className="h-9 flex items-center gap-2 pl-1 pr-2 sm:pr-3 rounded-xl bg-[#0d0f15] hover:bg-[#141622] border border-white/[0.08] transition-colors"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user?.name || 'User'}
                className="w-6 h-6 rounded-lg object-cover border border-[#caa457]/30"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-200 leading-none truncate max-w-[90px] lg:max-w-[110px]">{user?.name || 'Alex Rivera'}</div>
                <div className="text-[10px] text-slate-500 font-mono truncate max-w-[90px] lg:max-w-[110px]">{user?.role || 'Tech Lead'}</div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-500 hidden sm:block" />
            </button>

            {showPersonaMenu && (
              <div className="fixed sm:absolute right-3 sm:right-0 top-16 sm:top-auto sm:mt-2 w-[calc(100vw-24px)] sm:w-64 rounded-2xl bg-[#0d0f15] border border-[#caa457]/25 p-3 shadow-2xl z-50 animate-scale-in">
                <div className="px-2.5 py-1.5 border-b border-white/[0.06] mb-1.5">
                  <p className="text-[10px] font-bold text-[#caa457] uppercase tracking-wider font-mono">Workspace Persona</p>
                  <p className="text-xs font-medium text-slate-200 truncate">{user?.name} ({user?.role})</p>
                </div>

                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {teamMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => {
                        demoLogin(member.id);
                        setShowPersonaMenu(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition-colors ${
                        user?.id === member.id
                          ? 'bg-[#caa457]/15 border border-[#caa457]/35 text-[#edd295] font-semibold'
                          : 'hover:bg-white/[0.04] text-slate-300'
                      }`}
                    >
                      <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-lg object-cover border border-white/10" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{member.name}</p>
                        <p className="text-[10px] text-slate-500 truncate">{member.role}</p>
                      </div>
                      {user?.id === member.id && <UserCheck className="w-3.5 h-3.5 text-[#caa457]" />}
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs px-1">
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setShowPersonaMenu(false);
                    }}
                    className="text-slate-400 hover:text-[#edd295]"
                  >
                    Custom Auth
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowPersonaMenu(false);
                    }}
                    className="flex items-center gap-1 text-rose-400 hover:text-rose-300"
                  >
                    <LogOut className="w-3 h-3" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Dedicated Search Row (< 768px) */}
      <div className="md:hidden pt-17 px-3.5 pb-2">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks, categories, or teammates..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full h-11 bg-[#0d0f15] hover:bg-[#12141c] focus:bg-[#141622] border border-white/[0.08] focus:border-[#caa457]/60 rounded-xl pl-10 pr-9 text-xs text-slate-200 placeholder:text-slate-500 transition-all focus:outline-none focus:ring-1 focus:ring-[#caa457]/30 shadow-sm"
          />
          {filters.search && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </>
  );
};
