const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');

// Get all roles
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT DISTINCT role, permissions
      FROM users
      WHERE role IS NOT NULL
    `);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// Update user permissions
router.put('/permissions/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { permissions } = req.body;
    
    const result = await db.query(`
      UPDATE users 
      SET permissions = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [permissions, user_id]);

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error updating permissions:', error);
    res.status(500).json({ error: 'Failed to update permissions' });
  }
});

module.exports = router;