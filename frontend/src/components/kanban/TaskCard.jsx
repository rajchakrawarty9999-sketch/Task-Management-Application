import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { 
  Calendar, 
  CheckSquare, 
  MessageSquare
} from 'lucide-react';

export const TaskCard = ({ task }) => {
  const { openEditModal, updateStatus } = useTasks();

  const isCompleted = task.status === 'completed';
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(st => st.completed).length;
  const subtaskProgress = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : (task.status === 'in_progress' ? 80 : 0);

  const priorityBadges = {
    urgent: {
      dot: 'bg-rose-500',
      text: 'text-rose-400',
      label: 'Urgent'
    },
    high: {
      dot: 'bg-[#caa457]',
      text: 'text-[#edd295]',
      label: 'High'
    },
    medium: {
      dot: 'bg-[#caa457]',
      text: 'text-[#edd295]',
      label: 'Medium'
    },
    low: {
      dot: 'bg-slate-400',
      text: 'text-slate-400',
      label: 'Low'
    }
  };

  const currentPriority = priorityBadges[task.priority] || priorityBadges.medium;

  const statusOptions = [
    { id: 'backlog', label: 'Backlog' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'in_review', label: 'In Review' },
    { id: 'completed', label: 'Done' }
  ];

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Sep 5';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => openEditModal(task)}
      className={`p-3.5 sm:p-4 rounded-2xl bg-[#0d0f15] border border-white/[0.07] hover:border-[#caa457]/40 cursor-grab active:cursor-grabbing group relative transition-all shadow-card-dark ${
        isCompleted ? 'opacity-80 hover:opacity-100' : ''
      }`}
    >
      {/* Top Header: Category & Priority */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[9px] font-mono uppercase font-bold text-slate-400 px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
          {task.category || 'GENERAL'}
        </span>

        <span className={`text-[10px] sm:text-[11px] font-mono font-medium flex items-center gap-1.5 ${currentPriority.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${currentPriority.dot}`} />
          <span>{currentPriority.label}</span>
        </span>
      </div>

      {/* Task Title */}
      <h4 className={`text-xs sm:text-[13px] font-bold text-white leading-snug mb-1 group-hover:text-[#edd295] transition-colors ${
        isCompleted ? 'line-through text-slate-500' : ''
      }`}>
        {task.title}
      </h4>

      {/* Task Description */}
      {task.description && (
        <p className="text-[11px] text-slate-400 line-clamp-2 mb-2.5 leading-relaxed font-normal">
          {task.description}
        </p>
      )}

      {/* Subtasks Progress Bar */}
      <div className="mb-2.5">
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 mb-1 font-mono">
          <span className="flex items-center gap-1.5 text-slate-300">
            <CheckSquare className="w-3.5 h-3.5 text-[#caa457]" />
            <span>Subtasks</span>
          </span>
          <span className="text-slate-400 font-mono text-[10px]">
            {subtasks.length > 0 ? completedSubtasks : (task.status === 'in_progress' ? 4 : (task.status === 'in_review' ? 2 : 0))}/{subtasks.length || (task.status === 'in_progress' ? 5 : (task.status === 'in_review' ? 2 : 3))}
          </span>
        </div>
        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isCompleted 
                ? 'bg-emerald-400' 
                : task.status === 'in_review' || subtaskProgress === 100
                ? 'bg-gradient-to-r from-emerald-400 to-teal-400' 
                : 'bg-gradient-to-r from-[#caa457] to-[#edd295]'
            }`}
            style={{ width: `${subtasks.length > 0 ? subtaskProgress : (task.status === 'in_progress' ? 80 : (task.status === 'in_review' ? 100 : 0))}%` }}
          />
        </div>
      </div>

      {/* Card Footer: Metadata & Assignee */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.05] text-[11px] text-slate-400">
        {/* Assignee Avatars */}
        <div className="flex items-center gap-1.5">
          {task.assignee ? (
            <div className="flex -space-x-1.5 items-center">
              <img
                src={task.assignee.avatar}
                alt={task.assignee.name}
                className="w-5 h-5 rounded-full object-cover border border-[#0d0f15]"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
                alt="Colleague"
                className="w-5 h-5 rounded-full object-cover border border-[#0d0f15]"
              />
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-[9px] text-slate-500 font-mono">
              ?
            </div>
          )}
        </div>

        {/* Due Date & Comments */}
        <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
          <span className="flex items-center gap-1" title="Due Date">
            <Calendar className="w-3 h-3 text-[#caa457]" />
            <span>{formatDate(task.due_date)}</span>
          </span>

          {task.comments && task.comments.length > 0 && (
            <span className="flex items-center gap-1" title="Comments">
              <MessageSquare className="w-3 h-3 text-slate-500" />
              <span>{task.comments.length}</span>
            </span>
          )}
        </div>
      </div>

      {/* Quick Move Selector Chips on Hover */}
      <div 
        className="mt-2 pt-2 border-t border-white/[0.04] flex items-center justify-between opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity" 
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-[9px] text-slate-500 font-mono uppercase">Move:</span>
        <div className="flex items-center gap-1">
          {statusOptions
            .filter(s => (s.id === 'completed' ? 'completed' : s.id) !== task.status)
            .map((status) => (
              <button
                key={status.id}
                onClick={() => updateStatus(task.id, status.id)}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] hover:bg-[#caa457]/20 hover:text-[#edd295] border border-white/[0.06] text-slate-400 transition-colors"
              >
                {status.label}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};
