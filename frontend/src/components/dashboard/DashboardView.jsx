import React from 'react';
import { MetricsOverview } from './MetricsOverview';
import { KanbanBoard } from '../kanban/KanbanBoard';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { Plus, Kanban } from 'lucide-react';

export const DashboardView = () => {
  const { user } = useAuth();
  const { setActiveView, openCreateModal } = useTasks();

  const inProgressCount = 2;

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in w-full">
      {/* Luxury Obsidian & Gold Hero Banner (Desktop) */}
      <div className="hidden sm:flex p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#10131a] via-[#0d0f15] to-[#0a0b10] border border-[#caa457]/20 shadow-[0_4px_25px_rgba(0,0,0,0.6)] items-center justify-between gap-4 relative overflow-hidden">
        {/* Subtle ambient gold glow */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-[#caa457]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] sm:text-[11px] font-mono text-[#caa457] uppercase tracking-widest font-bold">
              ACTIVE SPRINT • Week 35
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Good evening, {user?.name || 'Alex Rivera'}</span>
            <span className="text-[#edd295]">✨</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
            You have <span className="text-[#edd295] font-semibold">{inProgressCount} tasks in progress</span> across your workspace.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 flex-shrink-0">
          <button
            onClick={() => openCreateModal('backlog')}
            className="h-10 px-4 rounded-xl btn-gold text-xs flex items-center gap-1.5 whitespace-nowrap shadow-gold-sm"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Task</span>
          </button>
          <button
            onClick={() => setActiveView('kanban')}
            className="h-10 px-4 rounded-xl btn-dark-gold text-xs flex items-center gap-2 whitespace-nowrap"
          >
            <Kanban className="w-3.5 h-3.5 text-[#caa457]" />
            <span>Kanban Board</span>
          </button>
        </div>
      </div>

      {/* Mobile Greeting (Exactly matching reference mobile screen) */}
      <div className="sm:hidden pt-1 space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
          <span>Good evening, {user?.name ? user.name.split(' ')[0] : 'Alex'}!</span>
          <span className="text-[#edd295]">✨</span>
        </h2>
        <p className="text-xs text-slate-400">
          You have <span className="text-[#edd295] font-semibold">{inProgressCount} tasks in progress</span>.
        </p>
      </div>

      {/* Metrics Section (4 Bento Cards - 2x2 on mobile, 4 columns on desktop) */}
      <div>
        <MetricsOverview />
      </div>

      {/* Mobile Full-Width Create Task Button (Matching reference mobile phone UI) */}
      <div className="sm:hidden">
        <button
          onClick={() => openCreateModal('backlog')}
          className="w-full h-11 rounded-xl btn-gold text-xs font-bold flex items-center justify-center gap-2 shadow-gold-sm"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Active Sprint Workflow Section */}
      <div className="space-y-3.5 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#caa457] font-mono">
            <span className="hidden sm:inline">ACTIVE SPRINT WORKFLOW</span>
            <span className="sm:hidden">WORKFLOW</span>
          </h3>
        </div>
        <KanbanBoard />
      </div>
    </div>
  );
};
