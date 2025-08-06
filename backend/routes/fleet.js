const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Get all vehicles
router.get('/vehicles', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT v.*, d.first_name, d.last_name, 
             ai.breakdown_risk, ai.fuel_efficiency, ai.maintenance_needed
      FROM vehicles v
      LEFT JOIN drivers d ON v.driver_id = d.id
      LEFT JOIN vehicle_ai_predictions ai ON v.id = ai.vehicle_id
      ORDER BY v.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// Get vehicle by ID
router.get('/vehicles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT v.*, d.first_name, d.last_name,
             ai.breakdown_risk, ai.fuel_efficiency, ai.maintenance_needed
      FROM vehicles v
      LEFT JOIN drivers d ON v.driver_id = d.id
      LEFT JOIN vehicle_ai_predictions ai ON v.id = ai.vehicle_id
      WHERE v.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching vehicle:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

// Create new vehicle
router.post('/vehicles', async (req, res) => {
  try {
    const {
      registration_number,
      type,
      make,
      model,
      year,
      capacity,
      fuel_type,
      status = 'active'
    } = req.body;

    const result = await db.query(`
      INSERT INTO vehicles (
        registration_number, type, make, model, year, 
        capacity, fuel_type, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [registration_number, type, make, model, year, capacity, fuel_type, status]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Error creating vehicle:', error);
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
});

// Update vehicle
router.put('/vehicles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const values = [id, ...Object.values(updates)];
    
    const result = await db.query(`
      UPDATE vehicles 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error updating vehicle:', error);
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
});

// Update vehicle location
router.put('/vehicles/:id/location', async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng, address } = req.body;

    const result = await db.query(`
      UPDATE vehicles 
      SET current_lat = $2, current_lng = $3, current_address = $4, 
          location_updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [id, lat, lng, address]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    // Emit real-time update
    req.app.get('io').emit('vehicleLocationUpdate', {
      vehicleId: id,
      location: { lat, lng, address },
      timestamp: new Date().toISOString()
    });

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error updating vehicle location:', error);
    res.status(500).json({ error: 'Failed to update vehicle location' });
  }
});

// Get vehicle maintenance history
router.get('/vehicles/:id/maintenance', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT * FROM maintenance_records 
      WHERE vehicle_id = $1 
      ORDER BY scheduled_date DESC
    `, [id]);
    
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching maintenance history:', error);
    res.status(500).json({ error: 'Failed to fetch maintenance history' });
  }
});

module.exports = router;