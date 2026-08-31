import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { createTaskRouter } from './routes/taskRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import createCalendarRouter from './routes/calendarRoutes.js';
import createNotificationRouter from './routes/notificationRoutes.js';
import { db, isSupabaseConfigured } from './db/database.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || '*';

// Socket.io initialization with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Track online users
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`🔌 [Socket.io] Client connected: ${socket.id}`);

  // User online presence announcement
  socket.on('user:join', (userData) => {
    if (userData && userData.id) {
      onlineUsers.set(socket.id, {
        socketId: socket.id,
        id: userData.id,
        name: userData.name,
        avatar: userData.avatar,
        role: userData.role
      });
      // Broadcast unique online users
      const uniqueUsers = Array.from(
        new Map(Array.from(onlineUsers.values()).map(u => [u.id, u])).values()
      );
      io.emit('presence:online_users', uniqueUsers);
    }
  });

  socket.on('disconnect', () => {
    onlineUsers.delete(socket.id);
    const uniqueUsers = Array.from(
      new Map(Array.from(onlineUsers.values()).map(u => [u.id, u])).values()
    );
    io.emit('presence:online_users', uniqueUsers);
    console.log(`🔌 [Socket.io] Client disconnected: ${socket.id}`);
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', createTaskRouter(io));
app.use('/api/analytics', analyticsRoutes);
app.use('/api/calendar', createCalendarRouter(io));
app.use('/api/notifications', createNotificationRouter(io));

// Health check endpoint
app.get('/api/health', async (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: isSupabaseConfigured ? 'Supabase (PostgreSQL)' : 'Local High-Performance Store',
    supabaseConnected: isSupabaseConfigured
  });
});

// Root welcome
app.get('/', (req, res) => {
  res.json({
    name: 'TaskEngine API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: [
      '/api/health',
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/demo-login',
      '/api/auth/users',
      '/api/tasks',
      '/api/analytics/stats',
      '/api/analytics/activity',
      '/api/calendar/holidays',
      '/api/calendar/events',
      '/api/notifications'
    ]
  });
});

server.listen(PORT, () => {
  console.log(`🚀 [TaskEngine API] Server running on http://localhost:${PORT}`);
  console.log(`🗄️  [Database] Storage Mode: ${isSupabaseConfigured ? 'Supabase (Live)' : 'Local Engine (Ready)'}`);
});
