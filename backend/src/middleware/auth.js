import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db } from '../db/database.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_taskengine_jwt_key_2026';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization header missing or invalid' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.getUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

export const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await db.getUserById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
  } catch (e) {
    // Ignore token errors for optional auth
  }
  next();
};
