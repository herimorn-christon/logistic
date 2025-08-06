const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');
const multer = require('multer');

const upload = multer({ dest: 'uploads/cargo/' });

// Get all cargo records
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT c.*, d.tracking_number
      FROM cargo_records c
      LEFT JOIN deliveries d ON c.delivery_id = d.id
      ORDER BY c.created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching cargo records:', error);
    res.status(500).json({ error: 'Failed to fetch cargo records' });
  }
});

// Cargo vision verification
router.post('/verify', upload.single('image'), async (req, res) => {
  try {
    const { cargo_id } = req.body;
    const imagePath = req.file.path;

    // Call AI service for cargo verification
    const formData = new FormData();
    formData.append('image', fs.createReadStream(imagePath));
    
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/vision/cargo-verification`, {
      method: 'POST',
      body: formData
    });

    const verification = await aiResponse.json();
    
    // Update cargo record with verification results
    await db.query(`
      UPDATE cargo_records 
      SET verification_status = $1, ai_confidence = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [verification.cargo_detected ? 'verified' : 'failed', verification.confidence, cargo_id]);

    res.json(verification);
  } catch (error) {
    logger.error('Error verifying cargo:', error);
    res.status(500).json({ error: 'Failed to verify cargo' });
  }
});

module.exports = router;