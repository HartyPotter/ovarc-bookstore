const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const upload = require('../middleware/uploadMiddleware');

// GET /api/store/:id/download-report
router.get('/:id/download-report', storeController.downloadStoreReport);

module.exports = router;