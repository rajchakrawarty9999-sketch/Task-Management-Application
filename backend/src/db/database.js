import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../../data');
const BACKUP_FILE = path.join(DATA_DIR, 'persistent_store.json');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Initial Seed Users
const initialUsers = [
  {
    id: 'u-1',
    name: 'Alex Rivera',
    email: 'alex@taskengine.dev',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Lead Architect',
    passwordHash: bcrypt.hashSync('password123', 10),
    created_at: new Date('2026-01-10T10:00:00Z').toISOString()
  },
  {
    id: 'u-2',
    name: 'Sarah Connor',
    email: 'sarah@taskengine.dev',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Senior Fullstack Dev',
    passwordHash: bcrypt.hashSync('password123', 10),
    created_at: new Date('2026-01-12T11:00:00Z').toISOString()
  },
  {
    id: 'u-3',
    name: 'David Kim',
    email: 'david@taskengine.dev',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    role: 'UI/UX Designer',
    passwordHash: bcrypt.hashSync('password123', 10),
    created_at: new Date('2026-01-15T09:30:00Z').toISOString()
  },
  {
    id: 'u-4',
    name: 'Elena Rostova',
    email: 'elena@taskengine.dev',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'DevOps Specialist',
    passwordHash: bcrypt.hashSync('password123', 10),
    created_at: new Date('2026-01-18T14:20:00Z').toISOString()
  }
];

const initialTasks = [
  {
    id: 't-1',
    title: 'Implement WebSocket Real-time Collaboration Engine',
    description: 'Set up bi-directional Socket.io server to broadcast task updates, live member presence, and immediate kanban board syncing.',
    status: 'in_progress',
    priority: 'urgent',
    category: 'Backend',
    due_date: new Date(Date.now() + 86400000 * 2).toISOString(),
    estimated_hours: 16,
    user_id: 'u-1',
    assignee_id: 'u-2',
    position: 0,
    subtasks: [
      { id: 'st-101', title: 'Initialize socket server & events schema', completed: true },
      { id: 'st-102', title: 'Implement room joins and user heartbeat', completed: true },
      { id: 'st-103', title: 'Connect client toast alert listener', completed: false }
    ],
    comments: [
      { id: 'c-1', userId: 'u-1', text: 'Socket server baseline is configured. Testing payload throughput.', created_at: new Date(Date.now() - 3600000 * 4).toISOString() }
    ],
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 't-2',
    title: 'Warm Ivory Design System & Calendar Integration',
    description: 'Refine Tailwind tokens, ivory paper surfaces, neon accent gradients, and typography hierarchy for high-contrast dark aesthetic.',
    status: 'in_review',
    priority: 'high',
    category: 'Design',
    due_date: new Date(Date.now() + 86400000 * 1).toISOString(),
    estimated_hours: 12,
    user_id: 'u-3',
    assignee_id: 'u-3',
    position: 0,
    subtasks: [
      { id: 'st-201', title: 'Create warm ivory calendar tokens', completed: true },
      { id: 'st-202', title: 'Configure Inter typography', completed: true }
    ],
    comments: [],
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 't-3',
    title: 'Deploy Supabase PostgreSQL Database & Real-time Engine',
    description: 'Deploy database migration schema, verify foreign keys, indexes, and configure automated data synchronization policies.',
    status: 'completed',
    priority: 'high',
    category: 'Database',
    due_date: new Date(Date.now() - 86400000 * 1).toISOString(),
    estimated_hours: 8,
    user_id: 'u-1',
    assignee_id: 'u-4',
    position: 0,
    subtasks: [
      { id: 'st-301', title: 'Design normalized tables schema', completed: true },
      { id: 'st-302', title: 'Write SQL migration script', completed: true }
    ],
    comments: [],
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 't-4',
    title: 'Interactive Drag & Drop Kanban Board',
    description: 'Build smooth drag-drop functionality between Backlog, In Progress, In Review, and Completed columns with optimistic UI updates.',
    status: 'in_progress',
    priority: 'urgent',
    category: 'Frontend',
    due_date: new Date(Date.now() + 86400000 * 3).toISOString(),
    estimated_hours: 20,
    user_id: 'u-2',
    assignee_id: 'u-2',
    position: 1,
    subtasks: [
      { id: 'st-401', title: 'Column layout with column counters', completed: true },
      { id: 'st-402', title: 'Drag event handlers and drop zones', completed: true }
    ],
    comments: [],
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 't-5',
    title: 'Automated CI/CD Pipeline & Health Check',
    description: 'Configure automated build pipeline, backend health endpoints, and integration test runner.',
    status: 'backlog',
    priority: 'medium',
    category: 'DevOps',
    due_date: new Date(Date.now() + 86400000 * 5).toISOString(),
    estimated_hours: 10,
    user_id: 'u-4',
    assignee_id: 'u-4',
    position: 0,
    subtasks: [],
    comments: [],
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];

const initialNotifications = [
  {
    id: 'notif-1',
    user_id: 'u-1',
    type: 'team_join',
    title: 'New Teammate Joined',
    message: 'Elena Rostova (DevOps Specialist) joined TaskEngine PRO workspace.',
    read: false,
    link: '/team',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 'notif-2',
    user_id: 'u-1',
    type: 'task_assigned',
    title: 'Task Assigned To You',
    message: 'Sarah assigned you: "Implement WebSocket Real-time Collaboration Engine".',
    read: false,
    link: '/kanban',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    id: 'notif-3',
    user_id: 'u-1',
    type: 'deadline',
    title: 'Upcoming Sprint Deadline',
    message: 'Deliverable "Supabase PostgreSQL Migration" is due for deployment review today.',
    read: false,
    link: '/calendar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  }
];

class LocalStore {
  constructor() {
    this.users = [...initialUsers];
    this.tasks = [...initialTasks];
    this.notifications = [...initialNotifications];
    this.activities = [];

    // Load persisted state from disk if available
    this.loadFromDisk();
  }

  loadFromDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(BACKUP_FILE)) {
        const raw = fs.readFileSync(BACKUP_FILE, 'utf8');
        const data = JSON.parse(raw);
        if (data.users?.length) this.users = data.users;
        if (data.tasks?.length) this.tasks = data.tasks;
        if (data.notifications?.length) this.notifications = data.notifications;
        if (data.activities?.length) this.activities = data.activities;
        console.log(`💾 [Persistence] Restored ${this.tasks.length} tasks, ${this.notifications.length} notifications from disk.`);
      }
    } catch (e) {
      console.warn('⚠️ Could not load backup from disk:', e.message);
    }
  }

  saveToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const state = {
        users: this.users,
        tasks: this.tasks,
        notifications: this.notifications,
        activities: this.activities,
        timestamp: new Date().toISOString()
      };
      fs.writeFileSync(BACKUP_FILE, JSON.stringify(state, null, 2), 'utf8');
    } catch (e) {
      console.warn('⚠️ Could not save backup to disk:', e.message);
    }
  }

  // Users
  async findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async getUserByEmail(email) {
    return this.findUserByEmail(email);
  }

  async findUserById(id) {
    return this.users.find(u => u.id === id) || null;
  }

  async getUserById(id) {
    return this.findUserById(id);
  }

  async createUser(userData) {
    const newUser = {
      id: `u-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      role: userData.role || 'Software Engineer',
      passwordHash: userData.passwordHash,
      created_at: new Date().toISOString()
    };
    this.users.push(newUser);
    this.saveToDisk();
    return newUser;
  }

  async getAllUsers() {
    return this.users.map(({ passwordHash, ...user }) => user);
  }

  async getUsers() {
    return this.getAllUsers();
  }

  // Tasks
  async getTasks(filters = {}) {
    let result = [...this.tasks];

    if (filters.status && filters.status !== 'all') {
      result = result.filter(t => t.status === filters.status);
    }
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter(t => t.priority === filters.priority);
    }
    if (filters.category && filters.category !== 'all') {
      result = result.filter(t => t.category?.toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.assignee_id && filters.assignee_id !== 'all') {
      result = result.filter(t => t.assignee_id === filters.assignee_id);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.description?.toLowerCase().includes(q) ||
        t.category?.toLowerCase().includes(q)
      );
    }

    return result.map(task => {
      const assignee = this.users.find(u => u.id === task.assignee_id);
      const creator = this.users.find(u => u.id === task.user_id);
      return {
        ...task,
        assignee: assignee ? { id: assignee.id, name: assignee.name, avatar: assignee.avatar, role: assignee.role } : null,
        creator: creator ? { id: creator.id, name: creator.name, avatar: creator.avatar } : null
      };
    });
  }

  async getTaskById(id) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;
    const assignee = this.users.find(u => u.id === task.assignee_id);
    const creator = this.users.find(u => u.id === task.user_id);
    return {
      ...task,
      assignee: assignee ? { id: assignee.id, name: assignee.name, avatar: assignee.avatar, role: assignee.role } : null,
      creator: creator ? { id: creator.id, name: creator.name, avatar: creator.avatar } : null
    };
  }

  async createTask(data) {
    const newTask = {
      id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: data.title,
      description: data.description || '',
      status: data.status || 'backlog',
      priority: data.priority || 'medium',
      category: data.category || 'General',
      due_date: data.due_date || null,
      estimated_hours: Number(data.estimated_hours) || 0,
      user_id: data.user_id || 'u-1',
      assignee_id: data.assignee_id || 'u-1',
      position: this.tasks.filter(t => t.status === (data.status || 'backlog')).length,
      subtasks: Array.isArray(data.subtasks) ? data.subtasks.map((st, i) => ({
        id: `st-${Date.now()}-${i}`,
        title: typeof st === 'string' ? st : st.title,
        completed: typeof st === 'object' ? Boolean(st.completed) : false
      })) : [],
      comments: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.tasks.unshift(newTask);
    this.saveToDisk();
    return this.getTaskById(newTask.id);
  }

  async updateTask(id, data) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;

    const current = this.tasks[index];
    this.tasks[index] = {
      ...current,
      ...data,
      id: current.id,
      updated_at: new Date().toISOString()
    };
    this.saveToDisk();
    return this.getTaskById(id);
  }

  async deleteTask(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    this.saveToDisk();
    return true;
  }

  async updateTaskStatus(id, status, position = 0) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;
    task.status = status;
    task.position = position;
    task.updated_at = new Date().toISOString();
    this.saveToDisk();
    return this.getTaskById(id);
  }

  async addSubtask(taskId, title) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return null;
    const subtask = {
      id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      completed: false
    };
    if (!task.subtasks) task.subtasks = [];
    task.subtasks.push(subtask);
    task.updated_at = new Date().toISOString();
    this.saveToDisk();
    return subtask;
  }

  async toggleSubtask(taskId, subtaskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) return null;
    const subtask = task.subtasks.find(st => st.id === subtaskId);
    if (!subtask) return null;
    subtask.completed = !subtask.completed;
    task.updated_at = new Date().toISOString();
    this.saveToDisk();
    return subtask;
  }

  async deleteSubtask(taskId, subtaskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task || !task.subtasks) return false;
    const index = task.subtasks.findIndex(st => st.id === subtaskId);
    if (index === -1) return false;
    task.subtasks.splice(index, 1);
    task.updated_at = new Date().toISOString();
    this.saveToDisk();
    return true;
  }

  async addComment(taskId, userId, content) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return null;
    const user = this.users.find(u => u.id === userId);
    const comment = {
      id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId,
      user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
      text: content,
      created_at: new Date().toISOString()
    };
    if (!task.comments) task.comments = [];
    task.comments.push(comment);
    task.updated_at = new Date().toISOString();
    this.saveToDisk();
    return comment;
  }

  // Notifications
  async getNotifications(userId) {
    return this.notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  async markNotificationRead(id) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveToDisk();
      return notif;
    }
    return null;
  }

  async markAllNotificationsRead() {
    this.notifications.forEach(n => { n.read = true; });
    this.saveToDisk();
    return this.notifications;
  }

  async addNotification(data) {
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      user_id: data.user_id || 'u-1',
      type: data.type || 'info',
      title: data.title || 'Notification',
      message: data.message || '',
      read: false,
      link: data.link || '',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      created_at: new Date().toISOString()
    };
    this.notifications.unshift(newNotif);
    this.saveToDisk();
    return newNotif;
  }

  async deleteNotification(id) {
    const idx = this.notifications.findIndex(n => n.id === id);
    if (idx !== -1) {
      this.notifications.splice(idx, 1);
      this.saveToDisk();
      return true;
    }
    return false;
  }

  // Activities
  async addActivity(taskId, userId, action, details) {
    const activity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      taskId,
      userId,
      action,
      details,
      created_at: new Date().toISOString()
    };
    this.activities.unshift(activity);
    if (this.activities.length > 50) this.activities.pop();
    this.saveToDisk();
    return activity;
  }

  async getActivities(limit = 20) {
    return this.activities.slice(0, limit).map(act => {
      const user = this.users.find(u => u.id === act.userId);
      const task = this.tasks.find(t => t.id === act.taskId);
      return {
        ...act,
        user: user ? { id: user.id, name: user.name, avatar: user.avatar } : null,
        taskTitle: task ? task.title : 'Task'
      };
    });
  }

  async getStats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.status === 'completed').length;
    const inProgress = this.tasks.filter(t => t.status === 'in_progress').length;
    const inReview = this.tasks.filter(t => t.status === 'in_review').length;
    const backlog = this.tasks.filter(t => t.status === 'backlog').length;

    const now = new Date();
    const dueThisWeek = this.tasks.filter(t => {
      if (!t.due_date || t.status === 'completed') return false;
      const d = new Date(t.due_date);
      const diffDays = (d - now) / (1000 * 60 * 60 * 24);
      return diffDays >= -1 && diffDays <= 7;
    }).length;

    const urgentCount = this.tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length;
    const highCount = this.tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      inReview,
      backlog,
      dueThisWeek,
      urgentCount,
      highCount,
      completionRate
    };
  }
}

export const db = new LocalStore();
