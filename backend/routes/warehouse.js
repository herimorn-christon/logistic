const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Get warehouse data
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT w.*, COUNT(d.id) as pending_deliveries
      FROM warehouses w
      LEFT JOIN deliveries d ON w.id = d.warehouse_id AND d.status = 'pending'
      GROUP BY w.id
      ORDER BY w.name
    `);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching warehouses:', error);
    res.status(500).json({ error: 'Failed to fetch warehouses' });
  }
});

// AI slot allocation
router.post('/allocate-slot', async (req, res) => {
  try {
    const { warehouse_id, delivery_id, cargo_type, weight } = req.body;
    
    // Call AI service for smart slot allocation
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/warehouse/allocate-slot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ warehouse_id, delivery_id, cargo_type, weight })
    });

    const allocation = await aiResponse.json();
    res.json(allocation);
  } catch (error) {
    logger.error('Error allocating warehouse slot:', error);
    res.status(500).json({ error: 'Failed to allocate warehouse slot' });
  }
});

module.exports = router;