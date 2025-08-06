const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Get all drivers
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let query = `
      SELECT d.*, u.first_name, u.last_name, u.email, u.phone,
             v.registration_number as current_vehicle
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN vehicles v ON d.current_vehicle_id = v.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ` AND d.status = $${params.length + 1}`;
      params.push(status);
    }

    query += ' ORDER BY u.first_name, u.last_name';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching drivers:', error);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// Get driver by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT d.*, u.first_name, u.last_name, u.email, u.phone,
             v.registration_number as current_vehicle
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      LEFT JOIN vehicles v ON d.current_vehicle_id = v.id
      WHERE d.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching driver:', error);
    res.status(500).json({ error: 'Failed to fetch driver' });
  }
});

// Create new driver
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      license_number,
      license_expiry,
      phone,
      emergency_contact,
      status = 'active'
    } = req.body;

    const result = await db.query(`
      INSERT INTO drivers (
        user_id, license_number, license_expiry, phone,
        emergency_contact, status
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [user_id, license_number, license_expiry, phone, emergency_contact, status]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Error creating driver:', error);
    res.status(500).json({ error: 'Failed to create driver' });
  }
});

// Update driver location
router.put('/:id/location', async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.body;

    const result = await db.query(`
      UPDATE drivers 
      SET current_lat = $2, current_lng = $3, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id, lat, lng]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    // Emit real-time update
    req.app.get('io').emit('driverLocationUpdate', {
      driverId: id,
      location: { lat, lng },
      timestamp: new Date().toISOString()
    });

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error updating driver location:', error);
    res.status(500).json({ error: 'Failed to update driver location' });
  }
});

// Update driver performance
router.put('/:id/performance', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      rating,
      completed_deliveries,
      on_time_deliveries,
      safety_score,
      fuel_efficiency_score
    } = req.body;

    const result = await db.query(`
      UPDATE drivers 
      SET rating = $2, completed_deliveries = $3, on_time_deliveries = $4,
          safety_score = $5, fuel_efficiency_score = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id, rating, completed_deliveries, on_time_deliveries, safety_score, fuel_efficiency_score]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error updating driver performance:', error);
    res.status(500).json({ error: 'Failed to update driver performance' });
  }
});

// Get driver analytics
router.get('/analytics/performance', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        AVG(rating) as avg_rating,
        AVG(safety_score) as avg_safety_score,
        AVG(fuel_efficiency_score) as avg_fuel_efficiency,
        SUM(completed_deliveries) as total_deliveries,
        AVG(CASE WHEN completed_deliveries > 0 
            THEN (on_time_deliveries::float / completed_deliveries) * 100 
            ELSE 0 END) as avg_on_time_percentage
      FROM drivers
      WHERE status = 'active'
    `);

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching driver analytics:', error);
    res.status(500).json({ error: 'Failed to fetch driver analytics' });
  }
});

module.exports = router;