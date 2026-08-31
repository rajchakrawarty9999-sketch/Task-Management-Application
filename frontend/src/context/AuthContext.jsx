import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { emitUserJoin, initSocket } from '../services/socket';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('taskengine_token'));
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Fetch team members list
  const loadUsers = async () => {
    try {
      const data = await api.getUsers();
      if (Array.isArray(data)) {
        setTeamMembers(data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Check auth session
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        await loadUsers();
        if (token) {
          const res = await api.getMe();
          if (res && res.user) {
            setUser(res.user);
            emitUserJoin(res.user);
          } else {
            // Auto login as default demo persona Alex Rivera if token expired
            await handleDemoLogin('u-1');
          }
        } else {
          // Default initial demo persona
          await handleDemoLogin('u-1');
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Setup WebSocket presence listener
  useEffect(() => {
    const socket = initSocket();
    const handlePresence = (users) => {
      setOnlineUsers(users);
    };

    socket.on('presence:online_users', handlePresence);
    return () => {
      socket.off('presence:online_users', handlePresence);
    };
  }, []);

  const handleLogin = async (email, password) => {
    const res = await api.login(email, password);
    localStorage.setItem('taskengine_token', res.token);
    setToken(res.token);
    setUser(res.user);
    emitUserJoin(res.user);
    return res.user;
  };

  const handleRegister = async (name, email, password, role) => {
    const res = await api.register(name, email, password, role);
    localStorage.setItem('taskengine_token', res.token);
    setToken(res.token);
    setUser(res.user);
    emitUserJoin(res.user);
    await loadUsers();
    return res.user;
  };

  const handleDemoLogin = async (userId = 'u-1') => {
    try {
      const res = await api.demoLogin(userId);
      localStorage.setItem('taskengine_token', res.token);
      setToken(res.token);
      setUser(res.user);
      emitUserJoin(res.user);
      return res.user;
    } catch (e) {
      console.error('Demo login error:', e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('taskengine_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        teamMembers,
        onlineUsers,
        login: handleLogin,
        register: handleRegister,
        demoLogin: handleDemoLogin,
        logout: handleLogout,
        refreshUsers: loadUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
