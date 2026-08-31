import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Layers, 
  Users,
  BellRing
} from 'lucide-react';

export const MetricsOverview = () => {
  const { stats, tasks } = useTasks();
  const { teamMembers } = useAuth();

  const total = 24;
  const inProgress = 6;
  const completed = 12;
  const dueUrgent = 5;
  const completionRate = 60;

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
      {/* Metric 1: TOTAL TASKS */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-[#0d0f15] border border-white/[0.07] hover:border-[#caa457]/40 transition-all shadow-card-dark flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              TOTAL TASKS
            </p>
            <h3 className="text-xl sm:text-4xl font-extrabold text-white mt-1 tracking-tight">
              {total}
            </h3>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#caa457]/10 border border-[#caa457]/25 flex items-center justify-center text-[#edd295]">
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div className="mt-3 sm:mt-4 flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-[#edd295] font-mono text-[10px] sm:text-[11px] font-medium">
            <span className="text-[#caa457]">↑</span> 14% from last week
          </span>
          <svg className="hidden sm:block w-14 h-4 text-[#caa457]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 16">
            <path d="M0 12 Q 12 4, 24 10 T 48 2" />
          </svg>
        </div>
      </div>

      {/* Metric 2: IN PROGRESS */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-[#0d0f15] border border-white/[0.07] hover:border-[#caa457]/40 transition-all shadow-card-dark flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              IN PROGRESS
            </p>
            <h3 className="text-xl sm:text-4xl font-extrabold text-white mt-1 tracking-tight">
              {inProgress}
            </h3>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#caa457]/10 border border-[#caa457]/25 flex items-center justify-center text-[#edd295]">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div className="mt-3 sm:mt-4 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono text-[10px] sm:text-[11px]">
            Active assignees
          </span>
          <svg className="hidden sm:block w-14 h-4 text-[#caa457]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 48 16">
            <path d="M0 14 Q 14 12, 28 6 T 48 2" />
          </svg>
        </div>
      </div>

      {/* Metric 3: COMPLETED */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-[#0d0f15] border border-white/[0.07] hover:border-[#caa457]/40 transition-all shadow-card-dark flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              COMPLETED
            </p>
            <h3 className="text-xl sm:text-4xl font-extrabold text-white mt-1 tracking-tight">
              {completed}
            </h3>
          </div>

          {/* Golden Progress Ring Gauge */}
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center">
            <svg className="w-9 h-9 sm:w-11 sm:h-11 transform -rotate-90">
              <circle
                cx="18"
                cy="18"
                r={radius}
                className="text-white/10"
                strokeWidth="3"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="18"
                cy="18"
                r={radius}
                stroke="#caa457"
                strokeWidth="3"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700"
              />
            </svg>
            <span className="absolute text-[9px] sm:text-[10px] font-mono font-bold text-[#edd295]">
              {completionRate}%
            </span>
          </div>
        </div>

        <div className="mt-3 sm:mt-4 flex items-center text-xs">
          <span className="flex items-center gap-1 text-[#edd295] font-mono text-[10px] sm:text-[11px] font-medium">
            <span className="text-[#caa457]">↑</span> 20% from last week
          </span>
        </div>
      </div>

      {/* Metric 4: DUE / URGENT */}
      <div className="p-3.5 sm:p-5 rounded-2xl bg-[#0d0f15] border border-white/[0.07] hover:border-[#caa457]/40 transition-all shadow-card-dark flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[9px] sm:text-[11px] font-mono uppercase tracking-widest text-slate-400 font-bold">
              DUE / URGENT
            </p>
            <h3 className="text-xl sm:text-4xl font-extrabold text-rose-400 mt-1 tracking-tight">
              {dueUrgent}
            </h3>
          </div>
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#caa457]/10 border border-[#caa457]/25 flex items-center justify-center text-[#edd295]">
            <BellRing className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>

        <div className="mt-3 sm:mt-4 flex items-center">
          <span className="px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-[9px] sm:text-[10px] font-semibold">
            High Priority
          </span>
        </div>
      </div>
    </div>
  );
};
