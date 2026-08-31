import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  CheckSquare, 
  MessageSquare, 
  Trash2, 
  Send, 
  Plus
} from 'lucide-react';

export const TaskModal = () => {
  const { isTaskModalOpen, selectedTask, closeModal, createTask, updateTask, deleteTask } = useTasks();
  const { user, teamMembers } = useAuth();

  const isEditing = Boolean(selectedTask && selectedTask.id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'backlog',
    priority: 'medium',
    category: 'Frontend',
    due_date: '',
    estimated_hours: 8,
    assignee_id: 'u-1'
  });

  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedTask) {
      setFormData({
        title: selectedTask.title || '',
        description: selectedTask.description || '',
        status: selectedTask.status || 'backlog',
        priority: selectedTask.priority || 'medium',
        category: selectedTask.category || 'Frontend',
        due_date: selectedTask.due_date ? selectedTask.due_date.split('T')[0] : '',
        estimated_hours: selectedTask.estimated_hours || 4,
        assignee_id: selectedTask.assignee_id || user?.id || 'u-1'
      });
      setSubtasks(selectedTask.subtasks || []);
      setComments(selectedTask.comments || []);
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'backlog',
        priority: 'medium',
        category: 'Frontend',
        due_date: '',
        estimated_hours: 4,
        assignee_id: user?.id || 'u-1'
      });
      setSubtasks([]);
      setComments([]);
    }
  }, [selectedTask, user]);

  if (!isTaskModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    try {
      if (isEditing) {
        await updateTask(selectedTask.id, {
          ...formData,
          subtasks
        });
      } else {
        await createTask({
          ...formData,
          subtasks
        });
      }
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;

    const newSt = {
      id: `st-temp-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false
    };

    setSubtasks(prev => [...prev, newSt]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = async (subtaskId) => {
    setSubtasks(prev => prev.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st));
    if (isEditing) {
      try {
        await api.toggleSubtask(selectedTask.id, subtaskId);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    setSubtasks(prev => prev.filter(st => st.id !== subtaskId));
    if (isEditing) {
      try {
        await api.deleteSubtask(selectedTask.id, subtaskId);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !isEditing) return;

    try {
      const res = await api.addComment(selectedTask.id, newComment.trim());
      if (res && res.comment) {
        setComments(prev => [...prev, res.comment]);
        setNewComment('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(selectedTask.id);
      closeModal();
    }
  };

  const completedSubtasksCount = subtasks.filter(st => st.completed).length;

  const priorities = [
    { id: 'low', label: 'Low', color: 'badge-low' },
    { id: 'medium', label: 'Medium', color: 'badge-medium' },
    { id: 'high', label: 'High', color: 'badge-high' },
    { id: 'urgent', label: 'Urgent 🔥', color: 'badge-urgent' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] bg-[#0f1118] rounded-t-3xl sm:rounded-2xl border-t sm:border border-[#caa457]/30 shadow-2xl overflow-hidden flex flex-col safe-bottom animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with 44px close target */}
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between bg-[#090b10] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-mono uppercase tracking-wider text-[#edd295] font-bold">
              {isEditing ? `Task Details #${selectedTask.id}` : 'Create New Task'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {isEditing && (
              <button
                type="button"
                onClick={handleDeleteTask}
                className="w-10 h-10 rounded-xl text-rose-400 hover:bg-rose-500/10 active:bg-rose-500/20 flex items-center justify-center transition-colors"
                title="Delete task"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={closeModal}
              className="w-10 h-10 rounded-xl text-slate-400 hover:text-white active:bg-white/10 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto pr-3 flex-1 scrollbar-thin">
          {/* Title */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Interactive Drag & Drop Kanban Board"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full h-11 gold-input rounded-xl px-3 text-sm text-slate-100 placeholder:text-slate-500 font-semibold"
            />
          </div>

          {/* Priority Pill Selectors */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {priorities.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setFormData(prev => ({ ...prev, priority: p.id }))}
                  className={`h-9 sm:h-8 rounded-xl text-xs font-mono font-bold border transition-colors ${
                    formData.priority === p.id
                      ? `${p.color} ring-1 ring-[#caa457]/50 font-extrabold`
                      : 'border-white/[0.06] text-slate-400 hover:text-white bg-white/[0.02]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Selectors Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Status */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full h-11 sm:h-9 gold-input rounded-xl px-3 text-xs text-slate-200 cursor-pointer"
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed / Done</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full h-11 sm:h-9 gold-input rounded-xl px-3 text-xs text-slate-200 cursor-pointer"
              >
                <option value="FRONTEND">FRONTEND</option>
                <option value="BACKEND">BACKEND</option>
                <option value="DESIGN">DESIGN</option>
                <option value="DATABASE">DATABASE</option>
                <option value="DEVOPS">DEVOPS</option>
                <option value="ANALYTICS">ANALYTICS</option>
                <option value="GENERAL">GENERAL</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                Assignee
              </label>
              <select
                value={formData.assignee_id}
                onChange={(e) => setFormData(prev => ({ ...prev, assignee_id: e.target.value }))}
                className="w-full h-11 sm:h-9 gold-input rounded-xl px-3 text-xs text-slate-200 cursor-pointer"
              >
                {teamMembers.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates & Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5 font-semibold">
                <Calendar className="w-3.5 h-3.5 text-[#caa457]" /> Due Date
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                className="w-full h-11 sm:h-9 gold-input rounded-xl px-3 text-xs text-slate-200 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5 font-semibold">
                <Clock className="w-3.5 h-3.5 text-[#caa457]" /> Estimated Hours
              </label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.estimated_hours}
                onChange={(e) => setFormData(prev => ({ ...prev, estimated_hours: e.target.value }))}
                className="w-full h-11 sm:h-9 gold-input rounded-xl px-3 text-xs text-slate-200"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-mono">
              Description & Specifications
            </label>
            <textarea
              rows={3}
              placeholder="Add key deliverable details or acceptance criteria..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full gold-input rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-500 resize-none"
            />
          </div>

          {/* Subtasks Section */}
          <div className="p-3.5 rounded-xl bg-[#090b10] border border-white/[0.06] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-200 font-mono text-xs font-bold">
                <CheckSquare className="w-3.5 h-3.5 text-[#caa457]" />
                <span>Subtasks ({completedSubtasksCount}/{subtasks.length})</span>
              </div>
            </div>

            {/* Subtask Items */}
            <div className="space-y-1.5">
              {subtasks.map((st) => (
                <div key={st.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[#141620] border border-white/[0.04] group text-xs">
                  <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => handleToggleSubtask(st.id)}
                      className="w-4 h-4 rounded border-white/20 text-[#caa457] bg-black/40 cursor-pointer"
                    />
                    <span className={`text-xs ${st.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {st.title}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubtask(st.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Subtask Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Add new subtask item..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(e); } }}
                className="flex-1 h-10 sm:h-8 gold-input rounded-xl px-3 text-xs text-slate-200 placeholder:text-slate-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="h-10 sm:h-8 px-3.5 rounded-xl btn-dark-gold text-xs flex items-center gap-1 font-bold"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
          </div>

          {/* Comments Section */}
          {isEditing && (
            <div className="p-3.5 rounded-xl bg-[#090b10] border border-white/[0.06] space-y-2.5">
              <div className="flex items-center gap-1.5 text-slate-200 font-mono text-xs font-bold">
                <MessageSquare className="w-3.5 h-3.5 text-[#caa457]" />
                <span>Comments ({comments.length})</span>
              </div>

              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {comments.length === 0 ? (
                  <p className="text-xs text-slate-500 py-1">No comments yet</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="p-2.5 rounded-xl bg-[#141620] border border-white/[0.04] text-xs space-y-0.5">
                      <div className="flex items-center justify-between text-slate-400 text-[10px]">
                        <span className="font-bold text-[#edd295]">{comment.user?.name || 'Teammate'}</span>
                        <span className="font-mono">{new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-slate-300">{comment.text}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-white/[0.06]">
                <input
                  type="text"
                  placeholder="Post comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddComment(e); } }}
                  className="flex-1 h-10 sm:h-8 gold-input rounded-xl px-3 text-xs text-slate-200 placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  className="h-10 sm:h-8 px-3.5 rounded-xl btn-dark-gold text-xs flex items-center gap-1 text-[#caa457]"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Sticky Modal Action Footer */}
          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-end gap-3 pb-2">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 sm:flex-none h-11 sm:h-9 px-4 rounded-xl btn-dark-gold text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none h-11 sm:h-9 px-5 rounded-xl btn-gold text-xs font-bold flex items-center justify-center gap-1.5 shadow-gold-sm"
            >
              <span>{isEditing ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
