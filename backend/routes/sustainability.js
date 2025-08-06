const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Get emissions data
router.get('/emissions', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    const result = await db.query(`
      SELECT 
        v.registration_number,
        SUM(f.amount * 2.31) as co2_emissions, -- kg CO2 per liter diesel
        SUM(f.amount) as fuel_consumed,
        COUNT(d.id) as deliveries_completed
      FROM vehicles v
      LEFT JOIN fuel_records f ON v.id = f.vehicle_id
      LEFT JOIN deliveries d ON v.id = d.vehicle_id
      WHERE f.timestamp BETWEEN $1 AND $2
      GROUP BY v.id, v.registration_number
    `, [start_date, end_date]);
    
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching emissions data:', error);
    res.status(500).json({ error: 'Failed to fetch emissions data' });
  }
});

// Green route optimization
router.post('/green-route', async (req, res) => {
  try {
    const routeData = req.body;
    
    // Call AI service for green routing
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/sustainability/green-route`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(routeData)
    });

    const greenRoute = await aiResponse.json();
    res.json(greenRoute);
  } catch (error) {
    logger.error('Error optimizing green route:', error);
    res.status(500).json({ error: 'Failed to optimize green route' });
  }
});

module.exports = router;