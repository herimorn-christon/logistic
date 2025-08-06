const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Get real-time tracking data
router.get('/live', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT v.id, v.registration_number, v.current_lat, v.current_lng, 
             v.current_address, v.status, d.first_name, d.last_name
      FROM vehicles v
      LEFT JOIN drivers dr ON v.driver_id = dr.id
      LEFT JOIN users d ON dr.user_id = d.id
      WHERE v.current_lat IS NOT NULL AND v.current_lng IS NOT NULL
    `);
    
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching tracking data:', error);
    res.status(500).json({ error: 'Failed to fetch tracking data' });
  }
});

// Update vehicle location
router.post('/update-location', async (req, res) => {
  try {
    const { vehicle_id, lat, lng, address } = req.body;
    
    await db.query(`
      UPDATE vehicles 
      SET current_lat = $1, current_lng = $2, current_address = $3, 
          location_updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
    `, [lat, lng, address, vehicle_id]);

    // Emit real-time update
    req.app.get('io').emit('vehicleLocationUpdate', {
      vehicleId: vehicle_id,
      location: { lat, lng, address },
      timestamp: new Date().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    logger.error('Error updating location:', error);
    res.status(500).json({ error: 'Failed to update location' });
  }
});

module.exports = router;