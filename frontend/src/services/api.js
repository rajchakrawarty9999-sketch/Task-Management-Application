const API_BASE = import.meta.env.VITE_API_URL || '/api';

const getHeaders = () => {
  const token = localStorage.getItem('taskengine_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async register(name, email, password, role) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async demoLogin(userId) {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Demo login failed');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    if (!res.ok) return null;
    return res.json();
  },

  async getUsers() {
    const res = await fetch(`${API_BASE}/auth/users`, {
      headers: getHeaders()
    });
    return res.json();
  },

  // Tasks
  async getTasks(params = {}) {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.priority && params.priority !== 'all') query.append('priority', params.priority);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.assignee_id && params.assignee_id !== 'all') query.append('assignee_id', params.assignee_id);
    if (params.search) query.append('search', params.search);

    const queryString = query.toString();
    const url = `${API_BASE}/tasks${queryString ? `?${queryString}` : ''}`;
    const res = await fetch(url, { headers: getHeaders() });
    return res.json();
  },

  async getTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Task not found');
    return res.json();
  },

  async createTask(taskData) {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(taskData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create task');
    return data;
  },

  async updateTask(id, taskData) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(taskData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update task');
    return data;
  },

  async updateTaskStatus(id, status, position = 0) {
    const res = await fetch(`${API_BASE}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, position })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update status');
    return data;
  },

  async updateTaskAssignee(id, assigneeId) {
    const res = await fetch(`${API_BASE}/tasks/${id}/assignee`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ assignee_id: assigneeId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update assignee');
    return data;
  },

  async deleteTask(id) {
    const res = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete task');
    return data;
  },

  async addSubtask(taskId, title) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/subtasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title })
    });
    return res.json();
  },

  async toggleSubtask(taskId, subtaskId) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return res.json();
  },

  async deleteSubtask(taskId, subtaskId) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  async addComment(taskId, content) {
    const res = await fetch(`${API_BASE}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content })
    });
    return res.json();
  },

  // Notifications
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, { headers: getHeaders() });
    return res.json();
  },

  async markNotificationRead(id) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    return res.json();
  },

  async markAllNotificationsRead() {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'POST',
      headers: getHeaders()
    });
    return res.json();
  },

  async createNotification(data) {
    const res = await fetch(`${API_BASE}/notifications`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Calendar
  async getHolidays(year) {
    const res = await fetch(`${API_BASE}/calendar/holidays?year=${year || new Date().getFullYear()}`);
    return res.json();
  },

  async getCalendarEvents() {
    const res = await fetch(`${API_BASE}/calendar/events`);
    return res.json();
  },

  async createCalendarEvent(eventData) {
    const res = await fetch(`${API_BASE}/calendar/events`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(eventData)
    });
    return res.json();
  },

  async deleteCalendarEvent(id) {
    const res = await fetch(`${API_BASE}/calendar/events/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    return res.json();
  },

  async updateTaskDueDate(taskId, dueDate) {
    const res = await fetch(`${API_BASE}/calendar/tasks/${taskId}/due-date`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ due_date: dueDate })
    });
    return res.json();
  },

  // Analytics & Activity
  async getStats() {
    const res = await fetch(`${API_BASE}/analytics/stats`, { headers: getHeaders() });
    return res.json();
  },

  async getActivities() {
    const res = await fetch(`${API_BASE}/analytics/activity`, { headers: getHeaders() });
    return res.json();
  },

  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  }
};
