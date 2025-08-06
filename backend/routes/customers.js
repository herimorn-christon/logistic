const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Get all customers
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*, COUNT(d.id) as total_deliveries
      FROM customers c
      LEFT JOIN deliveries d ON c.id = d.customer_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Create new customer
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, address, type } = req.body;
    
    const result = await db.query(`
      INSERT INTO customers (name, email, phone, company, address, type)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [name, email, phone, company, address, type]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

module.exports = router;