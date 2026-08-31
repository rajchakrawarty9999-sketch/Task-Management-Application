import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { Users, ArrowRight } from 'lucide-react';

export const TeamView = () => {
  const { teamMembers, onlineUsers, user, demoLogin } = useAuth();
  const { tasks } = useTasks();

  return (
    <div className="space-y-4 animate-fade-in w-full">
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090b10] border border-white/[0.06] flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#caa457]" />
            Team Workspace & Presence
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">Multi-user active workspace participants & workloads</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
        {teamMembers.map((member) => {
          const isCurrent = user?.id === member.id;
          const isOnline = onlineUsers.some(u => u.id === member.id) || isCurrent;
          const memberTasks = tasks.filter(t => t.assignee_id === member.id);
          const completedCount = memberTasks.filter(t => t.status === 'completed').length;

          return (
            <div
              key={member.id}
              className={`p-4 sm:p-5 rounded-2xl bg-[#090b10] border transition-all ${
                isCurrent 
                  ? 'border-[#caa457]/60 bg-[#0e111a] shadow-[0_0_20px_rgba(202,164,87,0.12)]' 
                  : 'border-white/[0.06] hover:border-[#caa457]/30'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-12 h-12 rounded-xl object-cover border border-[#caa457]/30"
                  />
                  {isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#090b10] shadow-[0_0_6px_#10b981]" />
                  )}
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isOnline ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.04] text-slate-500'
                }`}>
                  {isOnline ? 'Active' : 'Offline'}
                </span>
              </div>

              <div className="mt-3.5">
                <h4 className="font-bold text-slate-100 text-sm">{member.name}</h4>
                <p className="text-xs text-[#edd295] font-mono font-semibold">{member.role}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 font-mono truncate">{member.email}</p>
              </div>

              <div className="mt-3.5 pt-3 border-t border-white/[0.05] grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-[#0e1017]">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Assigned</span>
                  <p className="text-sm font-extrabold font-mono text-slate-200">{memberTasks.length}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[#0e1017]">
                  <span className="text-[10px] text-slate-400 uppercase font-mono font-bold">Done</span>
                  <p className="text-sm font-extrabold font-mono text-emerald-400">{completedCount}</p>
                </div>
              </div>

              <div className="mt-3.5">
                <button
                  onClick={() => demoLogin(member.id)}
                  disabled={isCurrent}
                  className={`w-full h-8.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isCurrent
                      ? 'bg-[#caa457]/20 text-[#edd295] cursor-default border border-[#caa457]/40'
                      : 'btn-dark-gold text-slate-300 hover:text-[#edd295]'
                  }`}
                >
                  {isCurrent ? 'Current Persona' : 'Switch Persona'}
                  {!isCurrent && <ArrowRight className="w-3 h-3" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
