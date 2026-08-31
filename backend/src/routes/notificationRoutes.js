import express from 'express';
import { db } from '../db/database.js';

export const createNotificationRouter = (io) => {
  const router = express.Router();

  // GET /api/notifications
  router.get('/', async (req, res) => {
    try {
      const notifications = await db.getNotifications();
      const unreadCount = notifications.filter(n => !n.read).length;
      res.json({ success: true, notifications, unreadCount });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

  // PATCH /api/notifications/:id/read (Mark single notification as read on hover/click)
  router.patch('/:id/read', async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await db.markNotificationRead(id);
      if (!updated) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      // Broadcast to all connected clients
      io.emit('notification:read', { id, read: true });
      res.json({ success: true, notification: updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update notification' });
    }
  });

  // POST /api/notifications/read-all (Mark all as read)
  router.post('/read-all', async (req, res) => {
    try {
      const updatedList = await db.markAllNotificationsRead();
      io.emit('notification:all_read', { success: true });
      res.json({ success: true, notifications: updatedList, unreadCount: 0 });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to mark all as read' });
    }
  });

  // POST /api/notifications (Create a notification)
  router.post('/', async (req, res) => {
    try {
      const { user_id, type, title, message, link, avatar } = req.body;
      if (!title || !message) {
        return res.status(400).json({ error: 'Title and message are required' });
      }

      const notif = await db.addNotification({
        user_id,
        type,
        title,
        message,
        link,
        avatar
      });

      io.emit('notification:new', notif);
      res.status(201).json({ success: true, notification: notif });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create notification' });
    }
  });

  // DELETE /api/notifications/:id
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await db.deleteNotification(id);
      io.emit('notification:deleted', { id });
      res.json({ success: true, message: 'Notification deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete notification' });
    }
  });

  return router;
};

export default createNotificationRouter;
