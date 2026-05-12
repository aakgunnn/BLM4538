const express = require('express');
const router = express.Router();
const borrowingController = require('../controllers/borrowingController');
const { auth, adminOnly } = require('../middleware/auth');

// Public routes
router.post('/', borrowingController.borrowBook);
router.put('/:id/return', borrowingController.returnBook);
router.get('/user/:userId', borrowingController.getUserBorrowings);

// Admin-only routes
router.get('/all', auth, adminOnly, borrowingController.getAllBorrowings);
router.put('/:id/duration', auth, adminOnly, borrowingController.updateBorrowingDuration);
router.put('/:id/force-return', auth, adminOnly, borrowingController.forceReturnBook);

module.exports = router;
