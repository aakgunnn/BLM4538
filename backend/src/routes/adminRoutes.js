const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, adminOnly } = require('../middleware/auth');

// All admin routes require auth + admin role
router.get('/stats', auth, adminOnly, adminController.getStats);

module.exports = router;
