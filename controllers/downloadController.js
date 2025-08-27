const videoDownloader = require('../utils/videoDownloader');

/**
 * Handle TikTok video download request
 */
exports.handleDownload = async (req, res, next) => {
  try {
    const { url, format } = req.body;

    // Input validation
    if (!url) {
      return res.status(400).json({ 
        error: 'URL is required',
        code: 'MISSING_URL'
      });
    }

    // Validate TikTok URL format
    const tiktokUrlPattern = /^https?:\/\/(www\.)?(tiktok\.com|vm\.tiktok\.com)/i;
    if (!tiktokUrlPattern.test(url)) {
      return res.status(400).json({ 
        error: 'Please provide a valid TikTok URL',
        code: 'INVALID_URL'
      });
    }

    // Validate format (default to 'both' if not specified)
    const validFormats = ['mp4', 'mp3', 'both'];
    const requestedFormat = format || 'both';
    
    if (!validFormats.includes(requestedFormat)) {
      return res.status(400).json({ 
        error: 'Invalid format. Supported formats: mp4, mp3, both',
        code: 'INVALID_FORMAT'
      });
    }

    console.log(`📥 Processing download request: ${url} (format: ${requestedFormat})`);

    // Process the download
    const downloadResult = await videoDownloader(url, requestedFormat);

    // Return success response
    res.json({
      success: true,
      data: {
        title: downloadResult.title || 'TikTok Video',
        author: downloadResult.author || 'Unknown',
        duration: downloadResult.duration || null,
        thumbnail: downloadResult.thumbnail || null,
        downloads: downloadResult.downloads,
        format: requestedFormat,
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Download error:', error.message);
    
    // Handle specific error types
    if (error.code === 'VIDEO_NOT_FOUND') {
      return res.status(404).json({
        error: 'Video not found or may be private',
        code: 'VIDEO_NOT_FOUND'
      });
    }
    
    if (error.code === 'RATE_LIMITED') {
      return res.status(429).json({
        error: 'Too many requests. Please try again later',
        code: 'RATE_LIMITED'
      });
    }

    if (error.code === 'PROCESSING_ERROR') {
      return res.status(422).json({
        error: 'Unable to process this video. Please try another one',
        code: 'PROCESSING_ERROR'
      });
    }

    // Pass unexpected errors to error handler
    next(error);
  }
};
