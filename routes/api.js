const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');

// POST /api/download - Main download endpoint
router.post('/download', downloadController.handleDownload);

// GET /api/health - Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'TikTok Downloader API'
  });
});

module.exports = router;
