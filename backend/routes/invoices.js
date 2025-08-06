const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT i.*, c.name as customer_name, d.tracking_number
      FROM invoices i
      LEFT JOIN customers c ON i.customer_id = c.id
      LEFT JOIN deliveries d ON i.delivery_id = d.id
      ORDER BY i.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// Auto-generate invoice
router.post('/generate', async (req, res) => {
  try {
    const { delivery_id, customer_id } = req.body;
    
    // Get delivery details for invoice calculation
    const delivery = await db.query('SELECT * FROM deliveries WHERE id = $1', [delivery_id]);
    
    if (delivery.rows.length === 0) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    const deliveryData = delivery.rows[0];
    
    // Call AI service for dynamic pricing
    const pricingResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/pricing/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        distance: deliveryData.distance,
        weight: deliveryData.cargo_weight,
        priority: deliveryData.priority,
        delivery_time: deliveryData.scheduled_delivery
      })
    });

    const pricing = await pricingResponse.json();
    
    // Generate invoice
    const invoiceNumber = `INV-${Date.now()}`;
    const result = await db.query(`
      INSERT INTO invoices (invoice_number, customer_id, delivery_id, amount, 
                          tax_amount, total_amount, due_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `, [
      invoiceNumber, customer_id, delivery_id, pricing.dynamic_price,
      pricing.dynamic_price * 0.1, pricing.dynamic_price * 1.1,
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    ]);

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error generating invoice:', error);
    res.status(500).json({ error: 'Failed to generate invoice' });
  }
});

module.exports = router;