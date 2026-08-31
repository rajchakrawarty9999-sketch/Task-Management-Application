import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { Activity, CheckCircle, MessageSquare, ArrowRightLeft, PlusCircle } from 'lucide-react';

export const ActivityFeed = () => {
  const { activities } = useTasks();

  const getActionIcon = (action) => {
    switch (action) {
      case 'task_created':
        return <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case 'task_completed':
        return <CheckCircle className="w-3.5 h-3.5 text-sky-400" />;
      case 'comment_added':
        return <MessageSquare className="w-3.5 h-3.5 text-violet-400" />;
      case 'status_change':
      default:
        return <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="p-4 rounded-xl bg-[#0f1118] border border-white/[0.06] space-y-3">
      <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-slate-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Live Activity
          </h4>
        </div>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
      </div>

      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {activities.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No workspace activity yet.</p>
        ) : (
          activities.slice(0, 15).map((act) => (
            <div key={act.id} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.03] text-xs hover:bg-white/[0.04] transition-colors">
              <img
                src={act.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={act.user?.name || 'Teammate'}
                className="w-5 h-5 rounded-full object-cover mt-0.5 border border-white/10"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="font-medium text-slate-200 truncate">{act.user?.name || 'Teammate'}</span>
                  <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap">
                    {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  {getActionIcon(act.action)}
                  <p className="leading-snug truncate text-[11px]">{act.details}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
