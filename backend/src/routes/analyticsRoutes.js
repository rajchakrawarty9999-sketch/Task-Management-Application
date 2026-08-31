import express from 'express';
import { db } from '../db/database.js';

const router = express.Router();

// Get aggregated statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await db.getStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// Get real-time activity log
router.get('/activity', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 20;
    const activities = await db.getActivities(limit);
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
});

export default router;
