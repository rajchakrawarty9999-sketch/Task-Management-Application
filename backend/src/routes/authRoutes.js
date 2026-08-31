import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../db/database.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_taskengine_jwt_key_2026';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await db.createUser({ name, email, password, role });
    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error registering user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { passwordHash, ...safeUser } = user;
    const token = generateToken(safeUser);

    res.json({
      message: 'Login successful',
      user: safeUser,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error logging in' });
  }
});

// Demo Login (Alex Rivera, Sarah Connor, David Kim, Elena Rostova)
router.post('/demo-login', async (req, res) => {
  try {
    const { userId } = req.body;
    const users = await db.getUsers();
    const targetUser = users.find(u => u.id === userId) || users[0];

    if (!targetUser) {
      return res.status(404).json({ message: 'Demo user not found' });
    }

    const token = generateToken(targetUser);

    res.json({
      message: `Switched to demo account: ${targetUser.name}`,
      user: targetUser,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error switching demo user' });
  }
});

// Get Current User Profile
router.get('/me', authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

// Get All Users (for assigning tasks)
router.get('/users', async (req, res) => {
  try {
    const users = await db.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

export default router;
