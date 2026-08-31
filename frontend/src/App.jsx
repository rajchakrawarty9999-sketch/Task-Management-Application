import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider, useTasks } from './context/TaskContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { ListView } from './components/views/ListView';
import { CalendarView } from './components/views/CalendarView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { TeamView } from './components/views/TeamView';
import { SettingsView } from './components/views/SettingsView';
import { TaskModal } from './components/tasks/TaskModal';
import { AuthModal } from './components/auth/AuthModal';
import { ToastContainer } from './components/ui/Toast';
import { Shield, Sparkles, Database } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-12 pt-6 pb-8 border-t border-white/[0.06] text-center space-y-2 min-w-0">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#edd295] via-[#caa457] to-[#8c6628] flex items-center justify-center text-[#140e04] shadow-xs">
            <svg className="w-3 h-3 text-[#140e04]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="font-bold text-slate-200">TaskEngine PRO</span>
          <span className="text-[10px] text-slate-500">v2.0 Enterprise</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Supabase Live
          </span>
          <span className="text-slate-600">·</span>
          <span>WebSocket Realtime</span>
        </div>
      </div>

      <div className="pt-2 text-[11px] text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
        <span>© 2026 <strong className="text-slate-200">TaskEngine PRO</strong>. All Rights Reserved by <strong className="text-[#edd295] hover:text-[#caa457] transition-colors">Shakti Kumar</strong></span>
        <span className="hidden sm:inline text-slate-600">·</span>
        <span className="text-slate-400">Created by <strong className="text-[#edd295] hover:text-[#caa457] transition-colors">Shakti Kumar</strong></span>
      </div>
    </footer>
  );
};

const MainLayout = () => {
  const { activeView } = useTasks();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('taskengine_sidebar_collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Persist sidebar collapsed state
  useEffect(() => {
    localStorage.setItem('taskengine_sidebar_collapsed', JSON.stringify(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  // Global Keyboard Shortcut: Ctrl + B or Cmd + B to toggle Sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        setIsSidebarCollapsed(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderActiveView = () => {
    switch (activeView) {
      case 'kanban':
        return (
          <div className="space-y-4 animate-fade-in w-full min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-100 tracking-tight">Kanban Board</h2>
                <p className="text-xs text-slate-400 font-mono">Drag & drop deliverables across sprint workflow columns</p>
              </div>
            </div>
            <KanbanBoard />
          </div>
        );
      case 'list':
        return (
          <div className="animate-fade-in w-full min-w-0">
            <ListView />
          </div>
        );
      case 'calendar':
        return (
          <div className="animate-fade-in w-full min-w-0">
            <CalendarView />
          </div>
        );
      case 'analytics':
        return (
          <div className="animate-fade-in w-full min-w-0">
            <AnalyticsView />
          </div>
        );
      case 'team':
        return (
          <div className="animate-fade-in w-full min-w-0">
            <TeamView />
          </div>
        );
      case 'settings':
        return (
          <div className="animate-fade-in w-full min-w-0">
            <SettingsView />
          </div>
        );
      case 'dashboard':
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#07080a] text-slate-200 flex flex-col w-full max-w-[100vw] overflow-x-hidden selection:bg-[#caa457] selection:text-black">
      {/* Sidebar Navigation (Desktop collapsible + Mobile/Tablet Drawer) */}
      <Sidebar 
        isMobileOpen={isMobileMenuOpen} 
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
      />

      {/* Main Content Container with fluid dynamic margins */}
      <div 
        className={`flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300 ease-out ${
          isSidebarCollapsed ? 'ml-0' : 'ml-0 lg:ml-[240px] xl:ml-[260px]'
        }`}
      >
        <Header 
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)} 
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleDesktopSidebar={() => setIsSidebarCollapsed(prev => !prev)}
        />

        {/* Content Area with dynamic fluid responsive padding */}
        <main className="flex-1 pt-2 sm:pt-20 pb-28 sm:pb-12 px-3.5 sm:px-5 md:px-6 lg:px-7 xl:px-8 max-w-[1700px] w-full min-w-0 mx-auto transition-all flex flex-col justify-between">
          <div className="flex-1 min-w-0 w-full">
            {renderActiveView()}
          </div>
          <Footer />
        </main>
      </div>

      {/* Global Modals & Overlays */}
      <TaskModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <MainLayout />
      </TaskProvider>
    </AuthProvider>
  );
}
