const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Get cold chain records
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*, d.tracking_number, v.registration_number
      FROM cold_chain_records c
      LEFT JOIN deliveries d ON c.delivery_id = d.id
      LEFT JOIN vehicles v ON c.vehicle_id = v.id
      ORDER BY c.timestamp DESC
    `);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching cold chain records:', error);
    res.status(500).json({ error: 'Failed to fetch cold chain records' });
  }
});

// Temperature monitoring
router.post('/monitor', async (req, res) => {
  try {
    const { delivery_id, vehicle_id, temperature, humidity } = req.body;
    
    // Call AI service for temperature prediction
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/coldchain/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ temperature, humidity, delivery_id })
    });

    const prediction = await aiResponse.json();
    
    // Save monitoring record
    const result = await db.query(`
      INSERT INTO cold_chain_records (delivery_id, vehicle_id, temperature, humidity, 
                                    ai_prediction, alert_triggered)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [delivery_id, vehicle_id, temperature, humidity, prediction.predicted_temp, prediction.alert]);

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error monitoring cold chain:', error);
    res.status(500).json({ error: 'Failed to monitor cold chain' });
  }
});

module.exports = router;