import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { KanbanColumn } from './KanbanColumn';
import { SlidersHorizontal, Plus, RotateCcw, ListTodo, ChevronDown, X, Check } from 'lucide-react';

export const KanbanBoard = () => {
  const { tasks, filters, setFilters, openCreateModal, setActiveView } = useTasks();
  const { teamMembers } = useAuth();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categories = ['all', 'Frontend', 'Backend', 'Design', 'Database', 'DevOps', 'Analytics', 'General'];
  const priorities = ['all', 'urgent', 'high', 'medium', 'low'];

  const backlogTasks = tasks.filter(t => t.status === 'backlog');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const inReviewTasks = tasks.filter(t => t.status === 'in_review');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const hasActiveFilters = filters.priority !== 'all' || filters.category !== 'all' || filters.assignee_id !== 'all';

  const resetFilters = () => {
    setFilters(prev => ({
      ...prev,
      priority: 'all',
      category: 'all',
      assignee_id: 'all'
    }));
  };

  return (
    <div className="space-y-3.5 sm:space-y-4 w-full">
      {/* Board Filter Bar */}
      <div className="p-3 sm:p-3.5 rounded-2xl bg-[#090b10] border border-white/[0.06] flex flex-wrap items-center justify-between gap-2.5">
        {/* Desktop Filter Row */}
        <div className="hidden sm:flex flex-wrap items-center gap-2.5">
          <span className="text-xs text-slate-500 font-medium">Filters:</span>

          {/* Domain Dropdown */}
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="h-8.5 bg-[#0d0f15] hover:bg-[#13151f] border border-white/[0.08] focus:border-[#caa457]/50 rounded-xl pl-3 pr-7 text-xs text-slate-300 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Domains</option>
              {categories.filter(c => c !== 'all').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Priority Dropdown */}
          <div className="relative">
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="h-8.5 bg-[#0d0f15] hover:bg-[#13151f] border border-white/[0.08] focus:border-[#caa457]/50 rounded-xl pl-3 pr-7 text-xs text-slate-300 focus:outline-none appearance-none capitalize cursor-pointer"
            >
              <option value="all">All Priorities</option>
              {priorities.filter(p => p !== 'all').map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Assignees Dropdown */}
          <div className="relative">
            <select
              value={filters.assignee_id}
              onChange={(e) => setFilters(prev => ({ ...prev, assignee_id: e.target.value }))}
              className="h-8.5 bg-[#0d0f15] hover:bg-[#13151f] border border-white/[0.08] focus:border-[#caa457]/50 rounded-xl pl-3 pr-7 text-xs text-slate-300 focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Assignees</option>
              {teamMembers.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="h-8.5 flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          )}
        </div>

        {/* Mobile Filter Trigger Button */}
        <div className="sm:hidden flex items-center gap-2 w-full justify-between">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="h-9 px-3.5 rounded-xl bg-[#0d0f15] border border-white/[0.08] text-xs font-semibold text-slate-200 flex items-center gap-2"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#caa457]" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#caa457]" />
            )}
            <ChevronDown className="w-3 h-3 text-slate-500 ml-1" />
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('list')}
              className="h-9 px-3 rounded-xl btn-dark-gold text-xs flex items-center gap-1.5"
            >
              <ListTodo className="w-3.5 h-3.5 text-[#caa457]" />
              <span>Table</span>
            </button>
            <button
              onClick={() => openCreateModal('backlog')}
              className="h-9 px-3 rounded-xl btn-gold text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <button
            onClick={() => setActiveView('list')}
            className="h-8.5 px-3 rounded-xl btn-dark-gold text-xs flex items-center gap-1.5"
          >
            <ListTodo className="w-3.5 h-3.5 text-[#caa457]" />
            <span>Table View</span>
          </button>
          <button
            onClick={() => openCreateModal('backlog')}
            className="h-8.5 px-3 rounded-xl btn-dark-gold text-xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#caa457]" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fade-in sm:hidden">
          <div 
            className="w-full bg-[#0f1118] border-t border-[#caa457]/30 rounded-t-3xl p-5 space-y-4 shadow-2xl safe-bottom animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#caa457]" />
                <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider">Filter Workflow</h3>
              </div>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Domain Filter */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Domain / Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full h-11 bg-[#090b10] border border-white/[0.08] focus:border-[#caa457]/50 rounded-xl px-3 text-xs text-slate-200"
              >
                <option value="all">All Domains</option>
                {categories.filter(c => c !== 'all').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full h-11 bg-[#090b10] border border-white/[0.08] focus:border-[#caa457]/50 rounded-xl px-3 text-xs text-slate-200 capitalize"
              >
                <option value="all">All Priorities</option>
                {priorities.filter(p => p !== 'all').map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            {/* Assignee Filter */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1.5 font-bold">Assignee</label>
              <select
                value={filters.assignee_id}
                onChange={(e) => setFilters(prev => ({ ...prev, assignee_id: e.target.value }))}
                className="w-full h-11 bg-[#090b10] border border-white/[0.08] focus:border-[#caa457]/50 rounded-xl px-3 text-xs text-slate-200"
              >
                <option value="all">All Assignees</option>
                {teamMembers.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    resetFilters();
                    setShowMobileFilters(false);
                  }}
                  className="flex-1 h-11 rounded-xl btn-dark-gold text-xs font-semibold"
                >
                  Reset
                </button>
              )}
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 h-11 rounded-xl btn-gold text-xs font-bold shadow-gold-sm"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Scrollable Kanban Columns Container (Mobile swipeable / Desktop grid) */}
      <div className="w-full overflow-x-auto pb-4 pt-1 flex md:grid md:grid-cols-2 xl:grid-cols-4 gap-3.5 snap-x snap-mandatory scrollbar-thin">
        <div className="min-w-[285px] max-w-[310px] md:min-w-0 md:max-w-none flex-shrink-0 md:flex-shrink snap-center">
          <KanbanColumn status="backlog" title="Backlog" tasks={backlogTasks} />
        </div>
        <div className="min-w-[285px] max-w-[310px] md:min-w-0 md:max-w-none flex-shrink-0 md:flex-shrink snap-center">
          <KanbanColumn status="in_progress" title="In Progress" tasks={inProgressTasks} />
        </div>
        <div className="min-w-[285px] max-w-[310px] md:min-w-0 md:max-w-none flex-shrink-0 md:flex-shrink snap-center">
          <KanbanColumn status="in_review" title="In Review" tasks={inReviewTasks} />
        </div>
        <div className="min-w-[285px] max-w-[310px] md:min-w-0 md:max-w-none flex-shrink-0 md:flex-shrink snap-center">
          <KanbanColumn status="completed" title="Done" tasks={completedTasks} />
        </div>
      </div>
    </div>
  );
};
