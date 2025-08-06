const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Get compliance records
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*, v.registration_number, d.first_name, d.last_name
      FROM compliance_records c
      LEFT JOIN vehicles v ON c.vehicle_id = v.id
      LEFT JOIN drivers dr ON c.driver_id = dr.id
      LEFT JOIN users d ON dr.user_id = d.id
      ORDER BY c.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching compliance records:', error);
    res.status(500).json({ error: 'Failed to fetch compliance records' });
  }
});

// AI safety monitoring
router.post('/safety-check', async (req, res) => {
  try {
    const { driver_id, vehicle_id } = req.body;
    
    // Call AI service for safety monitoring
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/compliance/safety-check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ driver_id, vehicle_id })
    });

    const safetyCheck = await aiResponse.json();
    res.json(safetyCheck);
  } catch (error) {
    logger.error('Error performing safety check:', error);
    res.status(500).json({ error: 'Failed to perform safety check' });
  }
});

module.exports = router;