import express from 'express';
import { db } from '../db/database.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.js';

export const createTaskRouter = (io) => {
  const router = express.Router();

  // Get tasks with filtering and search (Public / Authenticated read)
  router.get('/', async (req, res) => {
    try {
      const { status, priority, category, assignee_id, search } = req.query;
      const tasks = await db.getTasks({ status, priority, category, assignee_id, search });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
  });

  // Get single task by ID
  router.get('/:id', async (req, res) => {
    try {
      const task = await db.getTaskById(req.params.id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching task', error: error.message });
    }
  });

  // Create a new task (Protected by JWT Auth)
  router.post('/', authMiddleware, async (req, res) => {
    try {
      const { title, description, status, priority, category, due_date, estimated_hours, assignee_id, subtasks } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ message: 'Task title is required' });
      }

      const userId = req.user.id;
      const createdTask = await db.createTask({
        title: title.trim(),
        description,
        status: status || 'backlog',
        priority: priority || 'medium',
        category: category || 'General',
        due_date,
        estimated_hours,
        user_id: userId,
        assignee_id: assignee_id || userId,
        subtasks
      });

      // Log activity
      const activity = await db.addActivity(
        createdTask.id,
        userId,
        'task_created',
        `Created task "${createdTask.title}"`
      );

      // Emit WebSocket real-time events
      if (io) {
        io.emit('task:created', createdTask);
        io.emit('activity:new', activity);
        const stats = await db.getStats();
        io.emit('stats:updated', stats);
      }

      res.status(201).json(createdTask);
    } catch (error) {
      res.status(500).json({ message: 'Error creating task', error: error.message });
    }
  });

  // Update existing task (Protected by JWT Auth)
  router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTask = await db.updateTask(id, req.body);

      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const userId = req.user.id;
      const activity = await db.addActivity(
        id,
        userId,
        'task_updated',
        `Updated task "${updatedTask.title}"`
      );

      if (io) {
        io.emit('task:updated', updatedTask);
        io.emit('activity:new', activity);
        const stats = await db.getStats();
        io.emit('stats:updated', stats);
      }

      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: 'Error updating task', error: error.message });
    }
  });

  // Update Task Status (Protected by JWT Auth)
  router.patch('/:id/status', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, position } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      const updatedTask = await db.updateTaskStatus(id, status, position);
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const userId = req.user.id;
      const statusLabels = {
        backlog: 'Backlog',
        in_progress: 'In Progress',
        in_review: 'In Review',
        completed: 'Completed'
      };

      const activity = await db.addActivity(
        id,
        userId,
        status === 'completed' ? 'task_completed' : 'status_change',
        `Moved "${updatedTask.title}" to ${statusLabels[status] || status}`
      );

      if (io) {
        io.emit('task:status_changed', { taskId: id, status, task: updatedTask });
        io.emit('activity:new', activity);
        const stats = await db.getStats();
        io.emit('stats:updated', stats);
      }

      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: 'Error updating status', error: error.message });
    }
  });

  // Update Task Assignee (Protected by JWT Auth)
  router.patch('/:id/assignee', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { assignee_id } = req.body;

      if (!assignee_id) {
        return res.status(400).json({ message: 'assignee_id is required' });
      }

      const updatedTask = await db.updateTask(id, { assignee_id });
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const userId = req.user.id;
      const activity = await db.addActivity(
        id,
        userId,
        'task_reassigned',
        `Reassigned "${updatedTask.title}" to ${updatedTask.assignee?.name || assignee_id}`
      );

      // Create notification for the assignee
      await db.addNotification({
        user_id: assignee_id,
        type: 'task_assigned',
        title: 'Task Reassigned',
        message: `You were assigned to "${updatedTask.title}"`,
        link: '/kanban'
      });

      if (io) {
        io.emit('task:updated', updatedTask);
        io.emit('activity:new', activity);
        io.emit('notification:new', {
          user_id: assignee_id,
          type: 'task_assigned',
          title: 'Task Reassigned',
          message: `You were assigned to "${updatedTask.title}"`
        });
      }

      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: 'Error updating assignee', error: error.message });
    }
  });

  // Delete task (Protected by JWT Auth)
  router.delete('/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const task = await db.getTaskById(id);
      const success = await db.deleteTask(id);

      if (!success) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const userId = req.user.id;
      const activity = await db.addActivity(
        id,
        userId,
        'task_deleted',
        `Deleted task "${task?.title || id}"`
      );

      if (io) {
        io.emit('task:deleted', { taskId: id });
        io.emit('activity:new', activity);
        const stats = await db.getStats();
        io.emit('stats:updated', stats);
      }

      res.json({ message: 'Task deleted successfully', id });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
  });

  // Subtasks endpoints (Protected by JWT Auth)
  router.post('/:id/subtasks', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { title } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ message: 'Subtask title is required' });
      }

      const subtask = await db.addSubtask(id, title.trim());
      if (!subtask) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const updatedTask = await db.getTaskById(id);
      if (io) {
        io.emit('task:updated', updatedTask);
      }

      res.status(201).json({ subtask, task: updatedTask });
    } catch (error) {
      res.status(500).json({ message: 'Error adding subtask', error: error.message });
    }
  });

  router.patch('/:id/subtasks/:subtaskId', authMiddleware, async (req, res) => {
    try {
      const { id, subtaskId } = req.params;
      const subtask = await db.toggleSubtask(id, subtaskId);

      if (!subtask) {
        return res.status(404).json({ message: 'Subtask or Task not found' });
      }

      const updatedTask = await db.getTaskById(id);
      if (io) {
        io.emit('task:updated', updatedTask);
      }

      res.json({ subtask, task: updatedTask });
    } catch (error) {
      res.status(500).json({ message: 'Error toggling subtask', error: error.message });
    }
  });

  router.delete('/:id/subtasks/:subtaskId', authMiddleware, async (req, res) => {
    try {
      const { id, subtaskId } = req.params;
      const deleted = await db.deleteSubtask(id, subtaskId);

      if (!deleted) {
        return res.status(404).json({ message: 'Subtask not found' });
      }

      const updatedTask = await db.getTaskById(id);
      if (io) {
        io.emit('task:updated', updatedTask);
      }

      res.json({ message: 'Subtask removed', task: updatedTask });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting subtask', error: error.message });
    }
  });

  // Comments endpoints (Protected by JWT Auth)
  router.post('/:id/comments', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { content } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ message: 'Comment content is required' });
      }

      const userId = req.user.id;
      const comment = await db.addComment(id, userId, content.trim());

      if (!comment) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const updatedTask = await db.getTaskById(id);
      const activity = await db.addActivity(
        id,
        userId,
        'comment_added',
        `Commented on "${updatedTask?.title}"`
      );

      if (io) {
        io.emit('task:updated', updatedTask);
        io.emit('activity:new', activity);
      }

      res.status(201).json({ comment, task: updatedTask });
    } catch (error) {
      res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
  });

  return router;
};
