const db = require('../config/db');

// Get all books
const getAllBooks = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM books ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

// Get book by ID
const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM books WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'ERROR', message: 'Book not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

// Search books
const searchBooks = async (req, res) => {
  const { q } = req.query;
  try {
    const result = await db.query(
      'SELECT * FROM books WHERE title ILIKE $1 OR author ILIKE $1 OR category ILIKE $1',
      [`%${q}%`]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

module.exports = {
  getAllBooks,
  getBookById,
  searchBooks,
};
