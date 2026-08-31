import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Kanban, 
  ListTodo, 
  CalendarDays, 
  BarChart3, 
  Users2, 
  Settings,
  Plus, 
  Database,
  X,
  ChevronRight,
  LogOut,
  Shield,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';

export const Sidebar = ({ isMobileOpen, onCloseMobile, isCollapsed, onToggleCollapse }) => {
  const { activeView, setActiveView, openCreateModal, tasks, setIsAuthModalOpen } = useTasks();
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'kanban', label: 'Kanban Board', icon: Kanban, badge: tasks.length },
    { id: 'list', label: 'Task List', icon: ListTodo, badge: null },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays, badge: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'team', label: 'Team Workspace', icon: Users2, badge: null },
    { id: 'settings', label: 'Settings', icon: Settings, badge: null },
  ];

  const handleNavClick = (id) => {
    setActiveView(id);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile/Tablet Drawer Backdrop Overlay (< 1024px) */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="lg:hidden fixed inset-0 bg-black/85 backdrop-blur-md z-50 animate-fade-in"
        />
      )}

      {/* Navigation Sidebar (Desktop fixed ≥ 1024px + Mobile/Tablet Drawer < 1024px) */}
      <aside
        className={`fixed left-0 top-0 h-full w-[290px] sm:w-[320px] lg:w-[240px] xl:w-[260px] max-w-[85vw] lg:max-w-none bg-[#08090d] border-r border-white/[0.06] flex flex-col z-50 transition-all duration-300 ease-out shadow-2xl lg:shadow-none ${
          isMobileOpen
            ? 'translate-x-0'
            : isCollapsed
            ? '-translate-x-full'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header with Close/Hide Toggle */}
        <div className="h-16 px-4 xl:px-5 border-b border-white/[0.05] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Folded Metallic Gold Logo */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#edd295] via-[#caa457] to-[#8c6628] flex items-center justify-center text-[#140e04] shadow-[0_0_12px_rgba(202,164,87,0.25)] border border-white/20 flex-shrink-0">
              <svg className="w-4 h-4 text-[#140e04]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-100 tracking-tight">TaskEngine</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border border-[#caa457]/50 text-[#edd295] bg-[#caa457]/10">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5 truncate">Workspace</p>
            </div>
          </div>

          {/* Desktop/Tablet Hide Sidebar Button */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-8 h-8 rounded-lg text-slate-400 hover:text-[#edd295] hover:bg-white/5 active:bg-white/10 items-center justify-center transition-colors -mr-1"
            title="Hide Sidebar (Ctrl + B)"
            aria-label="Hide Sidebar"
          >
            <PanelLeftClose className="w-4.5 h-4.5" />
          </button>

          {/* Mobile Drawer Close Button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden w-10 h-10 -mr-2 rounded-xl text-slate-400 hover:text-white active:bg-white/10 flex items-center justify-center transition-colors"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Gold CTA (New Task) */}
        <div className="p-3.5 xl:p-4 pb-2 flex-shrink-0">
          <button
            onClick={() => {
              openCreateModal('backlog');
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full h-11 lg:h-10 px-3 rounded-xl btn-gold text-xs font-bold flex items-center justify-center gap-2 shadow-gold-sm"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="tracking-wide">New Task</span>
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-2.5 xl:px-3 space-y-1 overflow-y-auto pr-1 mt-2 scrollbar-thin">
          <div className="px-2 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full h-11 lg:h-9.5 xl:h-10 flex items-center justify-between px-3 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'nav-item-active font-semibold'
                    : 'text-slate-400 hover:text-slate-200 active:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-[#edd295]' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-semibold ${
                    isActive 
                      ? 'bg-[#caa457]/20 text-[#edd295]' 
                      : 'bg-white/5 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Engine Status & User Box */}
        <div className="p-3 border-t border-white/[0.06] space-y-2 flex-shrink-0 bg-[#08090d]">
          {/* Engine Status */}
          <div className="p-2.5 rounded-xl bg-[#0d0f15] border border-[#caa457]/25 flex items-center justify-between text-xs shadow-sm">
            <div className="flex items-center gap-2 text-slate-400">
              <Database className="w-3.5 h-3.5 text-[#caa457]" />
              <span className="text-[11px] font-medium">Engine Status</span>
            </div>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
              Live
            </span>
          </div>

          {/* User Profile Mini Footer */}
          <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={user?.name || 'User'}
                className="w-8 h-8 rounded-lg object-cover border border-[#caa457]/30"
              />
              <div className="min-w-0 text-left">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Alex Rivera'}</p>
                <p className="text-[10px] text-slate-500 font-mono truncate">{user?.role || 'Tech Lead'}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                if (onCloseMobile) onCloseMobile();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Fixed Mobile Bottom Navigation Bar (< 768px) */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#08090d]/95 backdrop-blur-xl border-t border-[#caa457]/20 flex items-center justify-around px-2 z-40 shadow-2xl safe-bottom"
        aria-label="Mobile Navigation"
      >
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeView === 'dashboard' ? 'text-[#edd295] font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveView('kanban')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeView === 'kanban' ? 'text-[#edd295] font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Kanban className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Kanban</span>
        </button>

        {/* Center Floating Gold Action Button (+) */}
        <button
          onClick={() => openCreateModal('backlog')}
          className="w-13 h-13 -mt-6 rounded-full btn-gold flex items-center justify-center text-[#120d04] shadow-[0_4px_20px_rgba(202,164,87,0.45)] border-2 border-[#edd295] active:scale-95 transition-transform"
          aria-label="Create New Task"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        <button
          onClick={() => setActiveView('list')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeView === 'list' ? 'text-[#edd295] font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ListTodo className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Tasks</span>
        </button>

        <button
          onClick={() => setActiveView('calendar')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeView === 'calendar' ? 'text-[#edd295] font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span className="text-[10px] tracking-tight">Calendar</span>
        </button>
      </nav>
    </>
  );
};
