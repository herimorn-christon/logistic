const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Get all routes
router.get('/', async (req, res) => {
  try {
    const { status, vehicle_id, driver_id } = req.query;
    let query = `
      SELECT r.*, v.registration_number as vehicle_number,
             d.first_name || ' ' || d.last_name as driver_name
      FROM routes r
      LEFT JOIN vehicles v ON r.vehicle_id = v.id
      LEFT JOIN drivers dr ON r.driver_id = dr.id
      LEFT JOIN users d ON dr.user_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ` AND r.status = $${params.length + 1}`;
      params.push(status);
    }

    if (vehicle_id) {
      query += ` AND r.vehicle_id = $${params.length + 1}`;
      params.push(vehicle_id);
    }

    if (driver_id) {
      query += ` AND r.driver_id = $${params.length + 1}`;
      params.push(driver_id);
    }

    query += ' ORDER BY r.created_at DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching routes:', error);
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// Get route by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT r.*, v.registration_number as vehicle_number,
             d.first_name || ' ' || d.last_name as driver_name
      FROM routes r
      LEFT JOIN vehicles v ON r.vehicle_id = v.id
      LEFT JOIN drivers dr ON r.driver_id = dr.id
      LEFT JOIN users d ON dr.user_id = d.id
      WHERE r.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching route:', error);
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

// Create new route
router.post('/', async (req, res) => {
  try {
    const {
      name,
      origin,
      destination,
      distance,
      estimated_time,
      vehicle_id,
      driver_id,
      waypoints,
      status = 'planned'
    } = req.body;

    const result = await db.query(`
      INSERT INTO routes (
        name, origin, destination, distance, estimated_time,
        vehicle_id, driver_id, waypoints, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      name, origin, destination, distance, estimated_time,
      vehicle_id, driver_id, JSON.stringify(waypoints), status
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Error creating route:', error);
    res.status(500).json({ error: 'Failed to create route' });
  }
});

// Optimize route
router.post('/:id/optimize', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get current route
    const routeResult = await db.query('SELECT * FROM routes WHERE id = $1', [id]);
    if (routeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const route = routeResult.rows[0];

    // Call AI service for optimization
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/routes/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        route_id: id,
        origin: route.origin,
        destination: route.destination,
        waypoints: route.waypoints,
        distance: route.distance,
        estimated_time: route.estimated_time
      })
    });

    if (!aiResponse.ok) {
      throw new Error('AI optimization service unavailable');
    }

    const optimization = await aiResponse.json();

    // Update route with optimized data
    const updateResult = await db.query(`
      UPDATE routes 
      SET distance = $2, estimated_time = $3, waypoints = $4,
          fuel_efficiency = $5, traffic_prediction = $6, eta_accuracy = $7,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, [
      id,
      optimization.optimized_distance,
      optimization.optimized_time,
      JSON.stringify(optimization.waypoints),
      optimization.fuel_efficiency || route.fuel_efficiency,
      optimization.traffic_prediction || route.traffic_prediction,
      optimization.eta_accuracy || route.eta_accuracy
    ]);

    res.json({
      original_route: route,
      optimized_route: updateResult.rows[0],
      savings: {
        distance: route.distance - optimization.optimized_distance,
        time: route.estimated_time - optimization.optimized_time,
        fuel_cost: optimization.fuel_saved || 0
      }
    });
  } catch (error) {
    logger.error('Error optimizing route:', error);
    res.status(500).json({ error: 'Failed to optimize route' });
  }
});

// Update route status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, actual_time } = req.body;

    const updates = ['status = $2'];
    const params = [id, status];

    if (actual_time) {
      updates.push(`actual_time = $${params.length + 1}`);
      params.push(actual_time);
    }

    const result = await db.query(`
      UPDATE routes 
      SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error updating route status:', error);
    res.status(500).json({ error: 'Failed to update route status' });
  }
});

module.exports = router;