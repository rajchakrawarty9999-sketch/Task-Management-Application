import React, { useState } from 'react';
import { useTasks } from '../../context/TaskContext';
import { 
  ArrowUpDown, 
  Calendar, 
  CheckSquare, 
  Trash2, 
  Edit3
} from 'lucide-react';

export const ListView = () => {
  const { tasks, openEditModal, deleteTask, updateStatus } = useTasks();
  const [sortField, setSortField] = useState('due_date');
  const [sortAsc, setSortAsc] = useState(true);

  const priorityWeights = { urgent: 4, high: 3, medium: 2, low: 1 };

  const priorityBadges = {
    urgent: { dot: 'bg-rose-500', text: 'text-rose-400', label: 'Urgent' },
    high: { dot: 'bg-[#caa457]', text: 'text-[#edd295]', label: 'High' },
    medium: { dot: 'bg-[#caa457]', text: 'text-[#edd295]', label: 'Medium' },
    low: { dot: 'bg-slate-400', text: 'text-slate-400', label: 'Low' }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    let result = 0;
    if (sortField === 'priority') {
      result = (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
    } else if (sortField === 'title') {
      result = a.title.localeCompare(b.title);
    } else if (sortField === 'status') {
      result = a.status.localeCompare(b.status);
    } else if (sortField === 'due_date') {
      result = new Date(a.due_date || '2099').getTime() - new Date(b.due_date || '2099').getTime();
    }
    return sortAsc ? result : -result;
  });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="p-3.5 sm:p-5 rounded-2xl bg-[#090b10] border border-white/[0.06] space-y-4 animate-fade-in w-full">
      {/* View Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100">All Tasks & Workflow</h3>
          <p className="text-xs text-slate-400">Structured deliverables with inline updates</p>
        </div>
        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#caa457]/10 border border-[#caa457]/30 text-[#edd295] font-bold">
          {sortedTasks.length} tasks
        </span>
      </div>

      {/* Mobile Card List View (< 768px as specified in mobile spec) */}
      <div className="md:hidden space-y-2.5">
        {sortedTasks.map((task) => {
          const isDone = task.status === 'completed';
          const pBadge = priorityBadges[task.priority] || priorityBadges.medium;
          const subtasks = task.subtasks || [];
          const completedSt = subtasks.filter(st => st.completed).length;

          return (
            <div
              key={task.id}
              onClick={() => openEditModal(task)}
              className="p-3.5 rounded-2xl bg-[#0d0f15] border border-white/[0.06] active:border-[#caa457]/40 shadow-card-dark space-y-2.5 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[9px] font-mono uppercase font-bold text-slate-400 px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
                  {task.category || 'GENERAL'}
                </span>
                <span className={`text-[10px] font-mono font-medium flex items-center gap-1.5 ${pBadge.text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${pBadge.dot}`} />
                  <span>{pBadge.label}</span>
                </span>
              </div>

              <h4 className={`text-xs font-bold text-white leading-snug ${isDone ? 'line-through text-slate-500' : ''}`}>
                {task.title}
              </h4>

              {task.description && (
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-xs">
                {/* Status Picker */}
                <div onClick={(e) => e.stopPropagation()}>
                  <select
                    value={task.status}
                    onChange={(e) => updateStatus(task.id, e.target.value)}
                    className="text-[10px] font-mono rounded-lg px-2 py-1 bg-[#090b10] border border-white/[0.08] text-slate-300"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="in_progress">In Progress</option>
                    <option value="in_review">In Review</option>
                    <option value="completed">Done</option>
                  </select>
                </div>

                {/* Due Date & Assignee */}
                <div className="flex items-center gap-3 text-slate-400 text-[11px] font-mono">
                  {task.due_date && (
                    <span className="flex items-center gap-1 text-[10px]">
                      <Calendar className="w-3 h-3 text-[#caa457]" />
                      {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  {task.assignee && (
                    <img
                      src={task.assignee.avatar}
                      alt={task.assignee.name}
                      className="w-5 h-5 rounded-full object-cover border border-[#caa457]/30"
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Data Table (>= 768px) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/[0.06] text-[10px] font-mono uppercase tracking-widest text-slate-400">
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-3 cursor-pointer hover:text-[#edd295]" onClick={() => toggleSort('title')}>
                <div className="flex items-center gap-1">Task Title <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-3 cursor-pointer hover:text-[#edd295]" onClick={() => toggleSort('priority')}>
                <div className="flex items-center gap-1">Priority <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-3 cursor-pointer hover:text-[#edd295]" onClick={() => toggleSort('due_date')}>
                <div className="flex items-center gap-1">Due Date <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-3">Assignee</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {sortedTasks.map((task) => {
              const isDone = task.status === 'completed';
              const subtasks = task.subtasks || [];
              const completedSt = subtasks.filter(st => st.completed).length;
              const pBadge = priorityBadges[task.priority] || priorityBadges.medium;

              return (
                <tr 
                  key={task.id} 
                  onClick={() => openEditModal(task)}
                  className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                >
                  {/* Status Picker */}
                  <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={task.status}
                      onChange={(e) => updateStatus(task.id, e.target.value)}
                      className={`text-[11px] font-mono rounded-lg px-2 py-1 border transition-colors focus:outline-none cursor-pointer ${
                        isDone
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : task.status === 'in_progress'
                          ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                          : task.status === 'in_review'
                          ? 'bg-[#caa457]/15 border-[#caa457]/35 text-[#edd295]'
                          : 'bg-white/[0.04] border-white/[0.08] text-slate-300'
                      }`}
                    >
                      <option value="backlog">Backlog</option>
                      <option value="in_progress">In Progress</option>
                      <option value="in_review">In Review</option>
                      <option value="completed">Done</option>
                    </select>
                  </td>

                  {/* Title */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-100 group-hover:text-[#edd295] transition-colors">
                      <span className={isDone ? 'line-through text-slate-500' : ''}>{task.title}</span>
                    </div>
                    {subtasks.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono mt-0.5">
                        <CheckSquare className="w-3 h-3 text-[#caa457]" />
                        <span>{completedSt}/{subtasks.length} subtasks</span>
                      </div>
                    )}
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-mono font-medium flex items-center gap-1.5 ${pBadge.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pBadge.dot}`} />
                      <span>{pBadge.label}</span>
                    </span>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
                      {task.category || 'GENERAL'}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                    {task.due_date ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#caa457]" />
                        {new Date(task.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>

                  {/* Assignee */}
                  <td className="py-3 px-3">
                    {task.assignee ? (
                      <div className="flex items-center gap-1.5">
                        <img
                          src={task.assignee.avatar}
                          alt={task.assignee.name}
                          className="w-5 h-5 rounded-full object-cover border border-white/10"
                        />
                        <span className="text-slate-300 text-xs">{task.assignee.name.split(' ')[0]}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500">Unassigned</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(task)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#edd295] hover:bg-white/5 transition-colors"
                        title="Edit Task"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
