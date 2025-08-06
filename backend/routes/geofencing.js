const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Get all geofences
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT g.*, u.first_name, u.last_name
      FROM geofences g
      LEFT JOIN users u ON g.created_by = u.id
      ORDER BY g.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching geofences:', error);
    res.status(500).json({ error: 'Failed to fetch geofences' });
  }
});

// Create geofence
router.post('/', async (req, res) => {
  try {
    const { name, type, coordinates, radius, created_by } = req.body;
    
    const result = await db.query(`
      INSERT INTO geofences (name, type, coordinates, radius, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [name, type, JSON.stringify(coordinates), radius, created_by]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Error creating geofence:', error);
    res.status(500).json({ error: 'Failed to create geofence' });
  }
});

// Check geofence violations
router.post('/check-violations', async (req, res) => {
  try {
    const { vehicle_id, lat, lng } = req.body;
    
    // Get all active geofences
    const geofences = await db.query('SELECT * FROM geofences WHERE is_active = true');
    
    const violations = [];
    for (const geofence of geofences.rows) {
      // Simple distance calculation (in real app, use proper geospatial functions)
      const distance = Math.sqrt(
        Math.pow(lat - geofence.coordinates.lat, 2) + 
        Math.pow(lng - geofence.coordinates.lng, 2)
      ) * 111000; // Convert to meters
      
      if (distance < geofence.radius) {
        violations.push({
          geofence_id: geofence.id,
          geofence_name: geofence.name,
          violation_type: 'entry',
          distance: distance
        });
      }
    }
    
    if (violations.length > 0) {
      // Emit real-time alert
      req.app.get('io').emit('geofenceViolation', {
        vehicleId: vehicle_id,
        violations,
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({ violations });
  } catch (error) {
    logger.error('Error checking geofence violations:', error);
    res.status(500).json({ error: 'Failed to check geofence violations' });
  }
});

module.exports = router;