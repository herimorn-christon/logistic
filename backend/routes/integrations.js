const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Third-party integrations
router.get('/toll-data', async (req, res) => {
  try {
    const { route_id } = req.query;
    
    // Mock toll integration
    const tollData = {
      route_id,
      toll_points: [
        { name: 'Highway Toll Plaza 1', cost: 25.50, location: { lat: 40.7128, lng: -74.0060 } },
        { name: 'Bridge Toll', cost: 15.00, location: { lat: 40.7589, lng: -73.9851 } }
      ],
      total_cost: 40.50
    };
    
    res.json(tollData);
  } catch (error) {
    logger.error('Error fetching toll data:', error);
    res.status(500).json({ error: 'Failed to fetch toll data' });
  }
});

// GPS integration
router.post('/gps-update', async (req, res) => {
  try {
    const { vehicle_id, lat, lng, speed, heading } = req.body;
    
    // Update vehicle location
    await db.query(`
      UPDATE vehicles 
      SET current_lat = $1, current_lng = $2, location_updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [lat, lng, vehicle_id]);

    // Emit real-time update
    req.app.get('io').emit('gpsUpdate', {
      vehicleId: vehicle_id,
      location: { lat, lng },
      speed,
      heading,
      timestamp: new Date().toISOString()
    });

    res.json({ success: true });
  } catch (error) {
    logger.error('Error updating GPS data:', error);
    res.status(500).json({ error: 'Failed to update GPS data' });
  }
});

module.exports = router;