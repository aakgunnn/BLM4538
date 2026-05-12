const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { auth, adminOnly } = require('../middleware/auth');

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/search', bookController.searchBooks);
router.get('/categories', bookController.getCategories);
router.get('/category/:category', bookController.getBooksByCategory);
router.get('/:id', bookController.getBookById);

// Admin-only routes (requires auth + admin role)
router.post('/', auth, adminOnly, bookController.addBook);
router.put('/:id', auth, adminOnly, bookController.updateBook);
router.delete('/:id', auth, adminOnly, bookController.deleteBook);

module.exports = router;
