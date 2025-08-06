const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');
const multer = require('multer');

const upload = multer({ dest: 'uploads/voice/' });

// Process text message
router.post('/message', async (req, res) => {
  try {
    const { message, user_id } = req.body;
    
    // Call AI service for chatbot response
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/chatbot/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, user_id })
    });

    const response = await aiResponse.json();
    
    // Save conversation to database
    await db.query(`
      INSERT INTO chat_messages (user_id, message, sender, ai_response, intent, confidence)
      VALUES ($1, $2, 'user', $3, $4, $5)
    `, [user_id, message, response.response, response.intent, response.confidence]);

    res.json(response);
  } catch (error) {
    logger.error('Error processing chatbot message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Process voice message
router.post('/voice', upload.single('audio'), async (req, res) => {
  try {
    const { user_id } = req.body;
    const audioPath = req.file.path;

    // Call AI service for voice processing
    const formData = new FormData();
    formData.append('audio', fs.createReadStream(audioPath));
    
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/chatbot/voice`, {
      method: 'POST',
      body: formData
    });

    const response = await aiResponse.json();
    res.json(response);
  } catch (error) {
    logger.error('Error processing voice message:', error);
    res.status(500).json({ error: 'Failed to process voice message' });
  }
});

module.exports = router;