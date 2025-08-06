const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Get risk assessments
router.get('/assessments', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT r.*, v.registration_number, d.first_name, d.last_name
      FROM risk_assessments r
      LEFT JOIN vehicles v ON r.vehicle_id = v.id
      LEFT JOIN drivers dr ON r.driver_id = dr.id
      LEFT JOIN users d ON dr.user_id = d.id
      ORDER BY r.risk_score DESC
    `);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching risk assessments:', error);
    res.status(500).json({ error: 'Failed to fetch risk assessments' });
  }
});

// AI risk analysis
router.post('/analyze', async (req, res) => {
  try {
    const riskData = req.body;
    
    // Call AI service for risk analysis
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/risk/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(riskData)
    });

    const analysis = await aiResponse.json();
    res.json(analysis);
  } catch (error) {
    logger.error('Error analyzing risk:', error);
    res.status(500).json({ error: 'Failed to analyze risk' });
  }
});

module.exports = router;