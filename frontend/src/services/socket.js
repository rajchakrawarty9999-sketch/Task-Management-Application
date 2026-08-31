import { io } from 'socket.io-client';

let socket = null;

export const initSocket = () => {
  if (!socket) {
    const wsUrl = import.meta.env.VITE_WS_URL || import.meta.env.VITE_BACKEND_URL || window.location.origin;
    socket = io(wsUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('⚡ [WebSocket] Connected to real-time server:', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('⚡ [WebSocket] Disconnected');
    });
  }
  return socket;
};

export const getSocket = () => socket || initSocket();

export const emitUserJoin = (userData) => {
  const s = getSocket();
  if (s && userData) {
    s.emit('user:join', userData);
  }
};
