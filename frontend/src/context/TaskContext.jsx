import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { getSocket } from '../services/socket';
import confetti from 'canvas-confetti';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'kanban' | 'list' | 'calendar' | 'analytics' | 'team'
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Search & Filter state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    assignee_id: 'all'
  });

  const addToast = (message, type = 'info', title = 'Update') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [{ id, message, type, title }, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [tasksData, statsData, activityData, notifData] = await Promise.all([
        api.getTasks(filters),
        api.getStats(),
        api.getActivities(),
        api.getNotifications()
      ]);
      setTasks(tasksData || []);
      setStats(statsData);
      setActivities(activityData || []);
      if (notifData && notifData.notifications) {
        setNotifications(notifData.notifications);
      }
    } catch (err) {
      console.error('Error loading tasks data:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Notifications API Actions
  const markNotificationRead = async (id) => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      await api.markNotificationRead(id);
    } catch (err) {
      console.error('Failed to mark notification read:', err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      await api.markAllNotificationsRead();
      addToast('All notifications marked as read', 'success', 'Inbox Cleared');
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
    }
  };

  // WebSocket Real-time event listeners
  useEffect(() => {
    const socket = getSocket();

    const handleTaskCreated = (newTask) => {
      setTasks(prev => {
        if (prev.some(t => t.id === newTask.id)) return prev;
        return [newTask, ...prev];
      });
      addToast(`New task "${newTask.title}" was added`, 'success', 'Task Created');
    };

    const handleTaskUpdated = (updatedTask) => {
      setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
      if (selectedTask && selectedTask.id === updatedTask.id) {
        setSelectedTask(updatedTask);
      }
    };

    const handleStatusChanged = ({ taskId, status, task }) => {
      setTasks(prev => prev.map(t => t.id === taskId ? (task || { ...t, status }) : t));
      if (status === 'completed') {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#edd295', '#caa457', '#8c6628']
        });
      }
    };

    const handleTaskDeleted = ({ taskId }) => {
      setTasks(prev => prev.filter(t => t.id !== taskId));
      addToast('A task was deleted', 'info', 'Task Removed');
    };

    const handleNewActivity = (activity) => {
      setActivities(prev => [activity, ...prev.slice(0, 40)]);
    };

    const handleNewNotification = (notif) => {
      setNotifications(prev => [notif, ...prev]);
      addToast(notif.message, 'info', notif.title);
    };

    const handleNotificationRead = ({ id }) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const handleNotificationAllRead = () => {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    socket.on('task:created', handleTaskCreated);
    socket.on('task:updated', handleTaskUpdated);
    socket.on('task:status_changed', handleStatusChanged);
    socket.on('task:deleted', handleTaskDeleted);
    socket.on('activity:new', handleNewActivity);
    socket.on('notification:new', handleNewNotification);
    socket.on('notification:read', handleNotificationRead);
    socket.on('notification:all_read', handleNotificationAllRead);

    return () => {
      socket.off('task:created', handleTaskCreated);
      socket.off('task:updated', handleTaskUpdated);
      socket.off('task:status_changed', handleStatusChanged);
      socket.off('task:deleted', handleTaskDeleted);
      socket.off('activity:new', handleNewActivity);
      socket.off('notification:new', handleNewNotification);
      socket.off('notification:read', handleNotificationRead);
      socket.off('notification:all_read', handleNotificationAllRead);
    };
  }, [selectedTask]);

  // Task Actions
  const createTask = async (taskData) => {
    try {
      const created = await api.createTask(taskData);
      setTasks(prev => [created, ...prev]);
      addToast(`Task "${created.title}" created successfully!`, 'success');
      return created;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const updated = await api.updateTask(id, taskData);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
      if (selectedTask && selectedTask.id === id) {
        setSelectedTask(updated);
      }
      addToast('Task updated successfully', 'success');
      return updated;
    } catch (err) {
      addToast(err.message, 'error');
      throw err;
    }
  };

  const updateStatus = async (id, newStatus, newPosition = 0) => {
    try {
      // Optimistic update
      setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
      const updated = await api.updateTaskStatus(id, newStatus, newPosition);
      if (newStatus === 'completed') {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#caa457', '#edd295', '#af842f']
        });
      }
      return updated;
    } catch (err) {
      fetchData(); // Rollback
      addToast('Failed to update status', 'error');
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      if (selectedTask && selectedTask.id === id) {
        setIsTaskModalOpen(false);
        setSelectedTask(null);
      }
      addToast('Task deleted', 'info');
    } catch (err) {
      addToast('Failed to delete task', 'error');
    }
  };

  const openCreateModal = (defaultStatus = 'backlog') => {
    setSelectedTask({
      title: '',
      description: '',
      status: defaultStatus,
      priority: 'medium',
      category: 'Frontend',
      due_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      estimated_hours: 4,
      subtasks: [],
      comments: []
    });
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setSelectedTask(null);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        activities,
        notifications,
        unreadNotificationsCount,
        markNotificationRead,
        markAllNotificationsRead,
        stats,
        loading,
        activeView,
        setActiveView,
        filters,
        setFilters,
        isTaskModalOpen,
        selectedTask,
        openCreateModal,
        openEditModal,
        closeTaskModal,
        isAuthModalOpen,
        setIsAuthModalOpen,
        createTask,
        updateTask,
        updateStatus,
        deleteTask,
        toasts,
        addToast,
        removeToast,
        refreshData: fetchData
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
