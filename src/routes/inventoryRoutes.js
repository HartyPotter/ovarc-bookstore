const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const upload = require('../middleware/uploadMiddleware');

// POST /api/inventory/upload
router.post('/upload', upload.single('file'), inventoryController.uploadInventory);

module.exports = router;