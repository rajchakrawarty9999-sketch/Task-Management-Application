import express from 'express';
import { db } from '../db/database.js';

export const createCalendarRouter = (io) => {
  const router = express.Router();

  // In-memory calendar events / reminders store (with rich default data)
  let calendarEvents = [
    {
      id: 'evt-1',
      type: 'meeting',
      title: 'Sprint Planning & Backlog Grooming',
      date: '2026-09-08',
      start_time: '10:00 AM',
      end_time: '11:00 AM',
      priority: 'high',
      assignee: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      location: 'Google Meet (Room Alpha)',
      created_at: new Date().toISOString()
    },
    {
      id: 'evt-2',
      type: 'reminder',
      title: 'Submit Q3 Performance Review & Deliverables',
      date: '2026-09-10',
      start_time: '02:30 PM',
      end_time: '03:00 PM',
      priority: 'urgent',
      assignee: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
      location: 'TaskEngine Portal',
      created_at: new Date().toISOString()
    },
    {
      id: 'evt-3',
      type: 'meeting',
      title: 'Architecture Review: WebSocket Latency & Scale',
      date: '2026-09-15',
      start_time: '04:00 PM',
      end_time: '05:00 PM',
      priority: 'medium',
      assignee: { name: 'Devon Vance', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
      location: 'Conference Room 3B',
      created_at: new Date().toISOString()
    },
    {
      id: 'evt-4',
      type: 'deadline',
      title: 'Security Audit & Penetration Testing Deadline',
      date: '2026-09-22',
      start_time: '06:00 PM',
      end_time: '06:30 PM',
      priority: 'urgent',
      assignee: { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      location: 'Cloud Security Center',
      created_at: new Date().toISOString()
    }
  ];

  // Dynamic Indian Festivals & National Holidays Generator for any year
  const getIndianHolidays = (year) => {
    const y = parseInt(year) || new Date().getFullYear();

    const holidaysMap = {
      2025: [
        { name: 'New Year Day', date: `${y}-01-01`, type: 'holiday', icon: '🎉', national: false },
        { name: 'Republic Day', date: `${y}-01-26`, type: 'holiday', icon: '🇮🇳', national: true },
        { name: 'Maha Shivratri', date: `${y}-02-26`, type: 'holiday', icon: '🕉️', national: false },
        { name: 'Holi', date: `${y}-03-14`, type: 'holiday', icon: '🎨', national: true },
        { name: 'Eid-ul-Fitr', date: `${y}-03-31`, type: 'holiday', icon: '🌙', national: true },
        { name: 'Ram Navami', date: `${y}-04-06`, type: 'holiday', icon: '🏹', national: false },
        { name: 'Independence Day', date: `${y}-08-15`, type: 'holiday', icon: '🇮🇳', national: true },
        { name: 'Janmashtami', date: `${y}-08-16`, type: 'holiday', icon: '🦚', national: false },
        { name: 'Ganesh Chaturthi', date: `${y}-08-27`, type: 'holiday', icon: '🐘', national: false },
        { name: 'Gandhi Jayanti', date: `${y}-10-02`, type: 'holiday', icon: '🕊️', national: true },
        { name: 'Dussehra', date: `${y}-10-02`, type: 'holiday', icon: '🏹', national: true },
        { name: 'Diwali', date: `${y}-10-20`, type: 'holiday', icon: '🪔', national: true },
        { name: 'Bhai Dooj', date: `${y}-10-22`, type: 'holiday', icon: '✨', national: false },
        { name: 'Guru Nanak Jayanti', date: `${y}-11-05`, type: 'holiday', icon: '🙏', national: true },
        { name: 'Christmas', date: `${y}-12-25`, type: 'holiday', icon: '🎄', national: true }
      ],
      2026: [
        { name: 'New Year Day', date: `${y}-01-01`, type: 'holiday', icon: '🎉', national: false },
        { name: 'Republic Day', date: `${y}-01-26`, type: 'holiday', icon: '🇮🇳', national: true },
        { name: 'Maha Shivratri', date: `${y}-02-15`, type: 'holiday', icon: '🕉️', national: false },
        { name: 'Holi', date: `${y}-03-04`, type: 'holiday', icon: '🎨', national: true },
        { name: 'Eid-ul-Fitr', date: `${y}-03-20`, type: 'holiday', icon: '🌙', national: true },
        { name: 'Ram Navami', date: `${y}-03-27`, type: 'holiday', icon: '🏹', national: false },
        { name: 'Independence Day', date: `${y}-08-15`, type: 'holiday', icon: '🇮🇳', national: true },
        { name: 'Raksha Bandhan', date: `${y}-08-28`, type: 'holiday', icon: '🧵', national: false },
        { name: 'Janmashtami', date: `${y}-09-04`, type: 'holiday', icon: '🦚', national: false },
        { name: 'Ganesh Chaturthi', date: `${y}-09-14`, type: 'holiday', icon: '🐘', national: false },
        { name: 'Gandhi Jayanti', date: `${y}-10-02`, type: 'holiday', icon: '🕊️', national: true },
        { name: 'Dussehra', date: `${y}-10-20`, type: 'holiday', icon: '🏹', national: true },
        { name: 'Diwali', date: `${y}-11-08`, type: 'holiday', icon: '🪔', national: true },
        { name: 'Bhai Dooj', date: `${y}-11-10`, type: 'holiday', icon: '✨', national: false },
        { name: 'Guru Nanak Jayanti', date: `${y}-11-24`, type: 'holiday', icon: '🙏', national: true },
        { name: 'Christmas', date: `${y}-12-25`, type: 'holiday', icon: '🎄', national: true }
      ]
    };

    if (holidaysMap[y]) return holidaysMap[y];

    return [
      { name: 'New Year Day', date: `${y}-01-01`, type: 'holiday', icon: '🎉', national: false },
      { name: 'Republic Day', date: `${y}-01-26`, type: 'holiday', icon: '🇮🇳', national: true },
      { name: 'Holi', date: `${y}-03-15`, type: 'holiday', icon: '🎨', national: true },
      { name: 'Independence Day', date: `${y}-08-15`, type: 'holiday', icon: '🇮🇳', national: true },
      { name: 'Gandhi Jayanti', date: `${y}-10-02`, type: 'holiday', icon: '🕊️', national: true },
      { name: 'Diwali', date: `${y}-11-01`, type: 'holiday', icon: '🪔', national: true },
      { name: 'Christmas', date: `${y}-12-25`, type: 'holiday', icon: '🎄', national: true }
    ];
  };

  // GET /api/calendar/holidays
  router.get('/holidays', (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const holidays = getIndianHolidays(year);
    res.json({ success: true, year, holidays });
  });

  // GET /api/calendar/events
  router.get('/events', (req, res) => {
    res.json({ success: true, events: calendarEvents });
  });

  // POST /api/calendar/events
  router.post('/events', (req, res) => {
    const { title, type, date, start_time, end_time, priority, location, assignee } = req.body;
    if (!title || !date) {
      return res.status(400).json({ error: 'Title and Date are required' });
    }

    const newEvent = {
      id: `evt-${Date.now()}`,
      title,
      type: type || 'reminder',
      date,
      start_time: start_time || '10:00 AM',
      end_time: end_time || '11:00 AM',
      priority: priority || 'medium',
      location: location || 'Remote',
      assignee: assignee || { name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
      created_at: new Date().toISOString()
    };

    calendarEvents.unshift(newEvent);

    // Broadcast over WebSocket
    io.emit('calendar:event_created', newEvent);
    io.emit('activity:new', {
      id: `act-${Date.now()}`,
      user: newEvent.assignee,
      action: 'calendar_event',
      details: `scheduled ${newEvent.type}: "${newEvent.title}" on ${newEvent.date}`,
      created_at: new Date().toISOString()
    });

    res.status(201).json({ success: true, event: newEvent });
  });

  // DELETE /api/calendar/events/:id
  router.delete('/events/:id', (req, res) => {
    const { id } = req.params;
    calendarEvents = calendarEvents.filter(e => e.id !== id);
    io.emit('calendar:event_deleted', { id });
    res.json({ success: true, message: 'Event deleted' });
  });

  // PATCH /api/calendar/tasks/:id/due-date
  router.patch('/tasks/:id/due-date', async (req, res) => {
    const { id } = req.params;
    const { due_date } = req.body;

    try {
      let updatedTask = null;
      if (db.tasks) {
        const taskIdx = db.tasks.findIndex(t => t.id === id);
        if (taskIdx !== -1) {
          db.tasks[taskIdx].due_date = due_date;
          db.tasks[taskIdx].updated_at = new Date().toISOString();
          updatedTask = db.tasks[taskIdx];
        }
      }

      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Broadcast real-time events
      io.emit('task:updated', updatedTask);
      io.emit('task:due_date_changed', { id, due_date, task: updatedTask });
      io.emit('activity:new', {
        id: `act-${Date.now()}`,
        user: updatedTask.assignee || { name: 'Alex Rivera' },
        action: 'due_date_changed',
        details: `rescheduled "${updatedTask.title}" to ${due_date}`,
        created_at: new Date().toISOString()
      });

      res.json({ success: true, task: updatedTask });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update due date' });
    }
  });

  return router;
};

export default createCalendarRouter;
