const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Get all maintenance records
router.get('/', async (req, res) => {
  try {
    const { status, priority, vehicle_id } = req.query;
    let query = `
      SELECT m.*, v.registration_number as vehicle_number
      FROM maintenance_records m
      LEFT JOIN vehicles v ON m.vehicle_id = v.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ` AND m.status = $${params.length + 1}`;
      params.push(status);
    }

    if (priority) {
      query += ` AND m.priority = $${params.length + 1}`;
      params.push(priority);
    }

    if (vehicle_id) {
      query += ` AND m.vehicle_id = $${params.length + 1}`;
      params.push(vehicle_id);
    }

    query += ' ORDER BY m.scheduled_date DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching maintenance records:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance records' });
  }
});

// Predictive maintenance AI endpoint
router.post('/predict', async (req, res) => {
  try {
    const { vehicle_id } = req.body;
    
    // Call AI service for predictive maintenance
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/maintenance/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicle_id })
    });

    const prediction = await aiResponse.json();
    res.json(prediction);
  } catch (error) {
    logger.error('Error predicting maintenance:', error);
    res.status(500).json({ error: 'Failed to predict maintenance' });
  }
});

module.exports = router;