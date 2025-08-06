const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Get all contracts
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*, cu.name as customer_name
      FROM contracts c
      LEFT JOIN customers cu ON c.customer_id = cu.id
      ORDER BY c.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching contracts:', error);
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
});

// AI bid recommendation
router.post('/ai-bid', async (req, res) => {
  try {
    const contractData = req.body;
    
    // Call AI service for bid recommendation
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/contracts/bid-recommendation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contractData)
    });

    const recommendation = await aiResponse.json();
    res.json(recommendation);
  } catch (error) {
    logger.error('Error getting AI bid recommendation:', error);
    res.status(500).json({ error: 'Failed to get bid recommendation' });
  }
});

module.exports = router;