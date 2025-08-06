const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Demand forecasting
router.post('/demand', async (req, res) => {
  try {
    const forecastData = req.body;
    
    // Call AI service for demand forecasting
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/forecasting/demand`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(forecastData)
    });

    const forecast = await aiResponse.json();
    res.json(forecast);
  } catch (error) {
    logger.error('Error forecasting demand:', error);
    res.status(500).json({ error: 'Failed to forecast demand' });
  }
});

// Route demand prediction
router.get('/route-demand/:route_id', async (req, res) => {
  try {
    const { route_id } = req.params;
    
    // Get historical data for the route
    const historicalData = await db.query(`
      SELECT DATE(created_at) as date, COUNT(*) as deliveries
      FROM deliveries 
      WHERE route_id = $1 
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `, [route_id]);

    // Call AI service for prediction
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/forecasting/route-demand`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ route_id, historical_data: historicalData.rows })
    });

    const prediction = await aiResponse.json();
    res.json(prediction);
  } catch (error) {
    logger.error('Error predicting route demand:', error);
    res.status(500).json({ error: 'Failed to predict route demand' });
  }
});

module.exports = router;