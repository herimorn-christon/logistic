const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Calculate dynamic pricing
router.post('/calculate', async (req, res) => {
  try {
    const pricingData = req.body;
    
    // Call AI service for dynamic pricing
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/pricing/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pricingData)
    });

    const pricing = await aiResponse.json();
    res.json(pricing);
  } catch (error) {
    logger.error('Error calculating pricing:', error);
    res.status(500).json({ error: 'Failed to calculate pricing' });
  }
});

// Get pricing history
router.get('/history', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT d.id, d.tracking_number, i.amount, i.created_at,
             d.cargo_weight, d.priority
      FROM deliveries d
      LEFT JOIN invoices i ON d.id = i.delivery_id
      WHERE i.amount IS NOT NULL
      ORDER BY i.created_at DESC
      LIMIT 100
    `);
    
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching pricing history:', error);
    res.status(500).json({ error: 'Failed to fetch pricing history' });
  }
});

module.exports = router;