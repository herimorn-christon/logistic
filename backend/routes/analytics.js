const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  try {
    const analytics = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM vehicles WHERE status = 'active') as active_vehicles,
        (SELECT COUNT(*) FROM deliveries WHERE status = 'completed' AND DATE(created_at) = CURRENT_DATE) as today_deliveries,
        (SELECT AVG(rating) FROM drivers WHERE status = 'active') as avg_driver_rating,
        (SELECT SUM(amount) FROM fuel_records WHERE DATE(timestamp) = CURRENT_DATE) as today_fuel_cost
    `);
    
    res.json(analytics.rows[0]);
  } catch (error) {
    logger.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get fleet insights
router.post('/fleet-insights', async (req, res) => {
  try {
    const analyticsData = req.body;
    
    // Call AI service for fleet insights
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/analytics/fleet-insights`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(analyticsData)
    });

    const insights = await aiResponse.json();
    res.json(insights);
  } catch (error) {
    logger.error('Error generating fleet insights:', error);
    res.status(500).json({ error: 'Failed to generate fleet insights' });
  }
});

module.exports = router;