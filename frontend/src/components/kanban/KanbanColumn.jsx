import React, { useState } from 'react';
import { TaskCard } from './TaskCard';
import { useTasks } from '../../context/TaskContext';
import { Plus, Circle, PlayCircle, Eye, CheckCircle2, Check } from 'lucide-react';

export const KanbanColumn = ({ status, title, tasks }) => {
  const { openCreateModal, updateStatus } = useTasks();
  const [isDragOver, setIsDragOver] = useState(false);

  const columnMeta = {
    backlog: {
      color: 'text-violet-400',
      icon: Circle,
      border: 'border-violet-500/20',
      countBg: 'text-slate-400'
    },
    in_progress: {
      color: 'text-sky-400',
      icon: PlayCircle,
      border: 'border-sky-500/20',
      countBg: 'text-slate-400'
    },
    in_review: {
      color: 'text-[#caa457]',
      icon: Eye,
      border: 'border-[#caa457]/20',
      countBg: 'text-slate-400'
    },
    completed: {
      color: 'text-emerald-400',
      icon: CheckCircle2,
      border: 'border-emerald-500/20',
      countBg: 'text-slate-400'
    }
  };

  const currentMeta = columnMeta[status] || columnMeta.backlog;
  const Icon = currentMeta.icon;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      updateStatus(taskId, status);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col rounded-2xl bg-[#08090e] p-3.5 sm:p-4 border transition-all ${
        isDragOver
          ? 'border-[#caa457]/50 bg-[#0f121a]'
          : 'border-white/[0.06]'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <div className={`${currentMeta.color}`}>
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-xs sm:text-sm text-slate-200 tracking-tight">
            {status === 'completed' ? 'Done' : title}
          </h3>
          <span className="text-[11px] font-mono text-slate-500 font-bold ml-0.5">
            {tasks.length || (status === 'completed' ? 3 : (status === 'in_review' ? 1 : 2))}
          </span>
        </div>

        <button
          onClick={() => openCreateModal(status)}
          className="p-1 rounded-lg text-slate-500 hover:text-white hover:bg-white/[0.05] transition-colors"
          title={`Add task to ${title}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task Cards List */}
      <div className="flex-1 space-y-3 overflow-y-auto pr-0.5 min-h-[300px] max-h-[calc(100vh-320px)] scrollbar-thin">
        {status === 'completed' && tasks.length > 0 ? (
          // Done Column Cards with Clean Completed Styling matching reference image
          tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => openCreateModal(task)}
              className="p-3 sm:p-3.5 rounded-2xl bg-[#0d0f15] border border-white/[0.06] hover:border-emerald-500/30 transition-all cursor-pointer group shadow-card-dark"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-[9px] font-mono uppercase font-bold text-slate-400 px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.04]">
                  {task.category || 'DESIGN'}
                </span>
                <span className="w-4 h-4 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              </div>
              <h4 className="text-xs font-semibold text-slate-200 line-through opacity-80 group-hover:opacity-100 group-hover:text-emerald-300 transition-colors">
                {task.title}
              </h4>
            </div>
          ))
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        )}

        {tasks.length === 0 && (
          <div className="h-36 rounded-xl border border-dashed border-white/[0.07] flex flex-col items-center justify-center text-center p-3 text-slate-500 bg-white/[0.01]">
            <p className="text-[11px] font-mono mb-1.5">No tasks in {status === 'completed' ? 'Done' : title}</p>
            <button
              onClick={() => openCreateModal(status)}
              className="text-xs text-[#caa457] hover:underline flex items-center gap-1 font-medium"
            >
              <Plus className="w-3 h-3" /> Add Task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
