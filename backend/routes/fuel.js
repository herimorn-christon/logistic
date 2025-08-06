const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Get all fuel records
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT f.*, v.registration_number, d.first_name, d.last_name
      FROM fuel_records f
      LEFT JOIN vehicles v ON f.vehicle_id = v.id
      LEFT JOIN drivers dr ON f.driver_id = dr.id
      LEFT JOIN users d ON dr.user_id = d.id
      ORDER BY f.timestamp DESC
    `);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching fuel records:', error);
    res.status(500).json({ error: 'Failed to fetch fuel records' });
  }
});

// Fuel fraud detection
router.post('/fraud-detection', async (req, res) => {
  try {
    const fuelData = req.body;
    
    // Call AI service for fraud detection
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/fuel/fraud-detection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fuelData)
    });

    const fraudAnalysis = await aiResponse.json();
    res.json(fraudAnalysis);
  } catch (error) {
    logger.error('Error detecting fuel fraud:', error);
    res.status(500).json({ error: 'Failed to detect fuel fraud' });
  }
});

module.exports = router;