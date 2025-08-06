const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Get all deliveries
router.get('/', async (req, res) => {
  try {
    const { status, priority, customer_id } = req.query;
    let query = `
      SELECT d.*, c.name as customer_name, r.name as route_name
      FROM deliveries d
      LEFT JOIN customers c ON d.customer_id = c.id
      LEFT JOIN routes r ON d.route_id = r.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ` AND d.status = $${params.length + 1}`;
      params.push(status);
    }

    if (priority) {
      query += ` AND d.priority = $${params.length + 1}`;
      params.push(priority);
    }

    if (customer_id) {
      query += ` AND d.customer_id = $${params.length + 1}`;
      params.push(customer_id);
    }

    query += ' ORDER BY d.created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching deliveries:', error);
    res.status(500).json({ error: 'Failed to fetch deliveries' });
  }
});

// Get delivery by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT d.*, c.name as customer_name, r.name as route_name
      FROM deliveries d
      LEFT JOIN customers c ON d.customer_id = c.id
      LEFT JOIN routes r ON d.route_id = r.id
      WHERE d.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching delivery:', error);
    res.status(500).json({ error: 'Failed to fetch delivery' });
  }
});

// Create new delivery
router.post('/', async (req, res) => {
  try {
    const {
      tracking_number,
      customer_id,
      route_id,
      pickup_location,
      delivery_location,
      scheduled_pickup,
      scheduled_delivery,
      cargo_weight,
      cargo_dimensions,
      cargo_type,
      cargo_value,
      special_requirements,
      priority = 'medium'
    } = req.body;

    const result = await db.query(`
      INSERT INTO deliveries (
        tracking_number, customer_id, route_id, pickup_location,
        delivery_location, scheduled_pickup, scheduled_delivery,
        cargo_weight, cargo_dimensions, cargo_type, cargo_value,
        special_requirements, priority
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      tracking_number, customer_id, route_id, pickup_location,
      delivery_location, scheduled_pickup, scheduled_delivery,
      cargo_weight, JSON.stringify(cargo_dimensions), cargo_type,
      cargo_value, special_requirements, priority
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Error creating delivery:', error);
    res.status(500).json({ error: 'Failed to create delivery' });
  }
});

// Update delivery status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actual_pickup, actual_delivery } = req.body;

    const updates = ['status = $2'];
    const params = [id, status];

    if (actual_pickup) {
      updates.push(`actual_pickup = $${params.length + 1}`);
      params.push(actual_pickup);
    }

    if (actual_delivery) {
      updates.push(`actual_delivery = $${params.length + 1}`);
      params.push(actual_delivery);
    }

    const result = await db.query(`
      UPDATE deliveries 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Delivery not found' });
    }

    // Emit real-time update
    req.app.get('io').emit('deliveryStatusUpdate', {
      deliveryId: id,
      status,
      timestamp: new Date().toISOString()
    });

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error updating delivery status:', error);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
});

// Get delivery analytics
router.get('/analytics/summary', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total_deliveries,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as completed_deliveries,
        COUNT(CASE WHEN status = 'in_transit' THEN 1 END) as in_transit_deliveries,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_deliveries,
        AVG(CASE WHEN actual_delivery IS NOT NULL AND scheduled_delivery IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (actual_delivery - scheduled_delivery))/3600 
            END) as avg_delay_hours
      FROM deliveries
      WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
    `);

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching delivery analytics:', error);
    res.status(500).json({ error: 'Failed to fetch delivery analytics' });
  }
});

module.exports = router;