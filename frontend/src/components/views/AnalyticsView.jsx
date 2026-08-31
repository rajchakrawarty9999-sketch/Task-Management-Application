import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart3, 
  Target, 
  Flame, 
  Layers
} from 'lucide-react';

export const AnalyticsView = () => {
  const { tasks, stats } = useTasks();
  const { teamMembers } = useAuth();

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const inReview = tasks.filter(t => t.status === 'in_review').length;
  const backlog = tasks.filter(t => t.status === 'backlog').length;

  const categories = ['FRONTEND', 'BACKEND', 'DESIGN', 'DATABASE', 'DEVOPS', 'ANALYTICS'];
  const categoryCounts = categories.map(cat => ({
    name: cat,
    count: tasks.filter(t => t.category?.toUpperCase() === cat).length
  }));

  const priorities = [
    { name: 'Urgent', count: tasks.filter(t => t.priority === 'urgent').length, color: 'bg-rose-500', text: 'text-rose-400' },
    { name: 'High', count: tasks.filter(t => t.priority === 'high').length, color: 'bg-amber-500', text: 'text-amber-400' },
    { name: 'Medium', count: tasks.filter(t => t.priority === 'medium').length, color: 'bg-amber-300', text: 'text-amber-300' },
    { name: 'Low', count: tasks.filter(t => t.priority === 'low').length, color: 'bg-slate-400', text: 'text-slate-400' }
  ];

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090b10] border border-white/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            Sprint & Productivity Intelligence
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time performance metrics and velocity distribution</p>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <span className="text-[11px] font-mono text-slate-400">Completion Velocity</span>
            <p className="text-xl font-bold text-amber-300 font-mono">{completionRate}%</p>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status Distribution */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090b10] border border-white/[0.06] space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 font-mono">
            <Layers className="w-3.5 h-3.5 text-amber-400" /> Status Distribution
          </h4>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-slate-400">Done</span>
                <span className="text-emerald-400">{completed} ({total > 0 ? Math.round((completed / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-slate-400">In Progress</span>
                <span className="text-sky-400">{inProgress} ({total > 0 ? Math.round((inProgress / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full" style={{ width: `${total > 0 ? (inProgress / total) * 100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-slate-400">In Review</span>
                <span className="text-amber-400">{inReview} ({total > 0 ? Math.round((inReview / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${total > 0 ? (inReview / total) * 100 : 0}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 font-mono">
                <span className="text-slate-400">Backlog</span>
                <span className="text-violet-400">{backlog} ({total > 0 ? Math.round((backlog / total) * 100) : 0}%)</span>
              </div>
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full bg-violet-400 rounded-full" style={{ width: `${total > 0 ? (backlog / total) * 100 : 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090b10] border border-white/[0.06] space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 font-mono">
            <Flame className="w-3.5 h-3.5 text-rose-400" /> Priority Weighting
          </h4>

          <div className="grid grid-cols-2 gap-3">
            {priorities.map((p) => (
              <div key={p.name} className="p-3.5 rounded-xl bg-[#0e1017] border border-white/[0.04]">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">{p.name}</span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className={`text-2xl font-extrabold font-mono ${p.text}`}>{p.count}</span>
                  <span className="text-[10px] text-slate-500 font-mono">tasks</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090b10] border border-white/[0.06] md:col-span-2 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2 font-mono">
            <Target className="w-3.5 h-3.5 text-amber-400" /> Workload by Technical Domain
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {categoryCounts.map((cat) => (
              <div key={cat.name} className="p-3 rounded-xl bg-[#0e1017] border border-white/[0.04] text-center">
                <p className="text-xs font-bold text-slate-200 truncate">{cat.name}</p>
                <p className="text-xl font-extrabold font-mono text-amber-400 mt-1">{cat.count}</p>
                <span className="text-[10px] text-slate-500 font-mono">tasks</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
