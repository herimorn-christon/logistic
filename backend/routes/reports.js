const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Generate fleet performance report
router.get('/fleet-performance', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    const result = await db.query(`
      SELECT 
        v.registration_number,
        COUNT(d.id) as total_deliveries,
        AVG(EXTRACT(EPOCH FROM (d.actual_delivery - d.scheduled_delivery))/3600) as avg_delay_hours,
        SUM(f.amount) as total_fuel_cost,
        AVG(dr.rating) as driver_rating
      FROM vehicles v
      LEFT JOIN deliveries d ON v.id = d.vehicle_id
      LEFT JOIN fuel_records f ON v.id = f.vehicle_id
      LEFT JOIN drivers dr ON v.driver_id = dr.id
      WHERE d.created_at BETWEEN $1 AND $2
      GROUP BY v.id, v.registration_number
    `, [start_date, end_date]);
    
    res.json(result.rows);
  } catch (error) {
    logger.error('Error generating fleet report:', error);
    res.status(500).json({ error: 'Failed to generate fleet report' });
  }
});

module.exports = router;