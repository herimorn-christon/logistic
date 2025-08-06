const express = require('express');
const router = express.Router();
const db = require('../config/database');
const logger = require('../utils/logger');
const multer = require('multer');

const upload = multer({ dest: 'uploads/documents/' });

// Upload document with OCR
router.post('/upload', upload.single('document'), async (req, res) => {
  try {
    const { entity_type, entity_id, document_type } = req.body;
    const file = req.file;

    // Call AI service for OCR processing
    const formData = new FormData();
    formData.append('document', fs.createReadStream(file.path));
    
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/ai/documents/ocr`, {
      method: 'POST',
      body: formData
    });

    const ocrResult = await aiResponse.json();
    
    // Save document record
    const result = await db.query(`
      INSERT INTO documents (name, type, file_path, file_size, mime_type, 
                           entity_type, entity_id, ocr_text, ai_extracted_data, uploaded_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      file.originalname, document_type, file.path, file.size, file.mimetype,
      entity_type, entity_id, ocrResult.text, JSON.stringify(ocrResult.extracted_data), req.user?.id
    ]);

    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error uploading document:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

module.exports = router;