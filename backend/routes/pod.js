const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');
const multer = require('multer');

const upload = multer({ dest: 'uploads/pod/' });

// Submit proof of delivery
router.post('/submit', upload.single('photo'), async (req, res) => {
  try {
    const { delivery_id, signature_data, recipient_name } = req.body;
    const photoPath = req.file?.path;

    // Call AI service for photo verification
    let verification = null;
    if (photoPath) {
      const formData = new FormData();
      formData.append('image', fs.createReadStream(photoPath));
      
      const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/vision/pod-verification`, {
        method: 'POST',
        body: formData
      });

      verification = await aiResponse.json();
    }

    // Save POD record
    const result = await db.query(`
      INSERT INTO pod_records (delivery_id, photo_path, signature_data, 
                              recipient_name, ai_verification, verified)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      delivery_id, photoPath, signature_data, recipient_name,
      verification ? JSON.stringify(verification) : null,
      verification?.delivery_verified || false
    ]);

    // Update delivery status
    await db.query(`
      UPDATE deliveries 
      SET status = 'delivered', actual_delivery = CURRENT_TIMESTAMP
      WHERE id = $1
    `, [delivery_id]);

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error submitting POD:', error);
    res.status(500).json({ error: 'Failed to submit proof of delivery' });
  }
});

module.exports = router;