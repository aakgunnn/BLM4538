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

// POST - Add a new book (Admin only)
const addBook = async (req, res) => {
  const { title, author, isbn, category, rating, pages, description, cover_url } = req.body;
  try {
    if (!title || !author || !isbn) {
      return res.status(400).json({ status: 'ERROR', message: 'Title, author and ISBN are required' });
    }
    const result = await db.query(
      `INSERT INTO books (title, author, isbn, category, rating, pages, description, cover_url, available)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true) RETURNING *`,
      [title, author, isbn, category || null, rating || 0, pages || 0, description || '', cover_url || '']
    );
    res.status(201).json({ status: 'SUCCESS', message: 'Book added', book: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ status: 'ERROR', message: 'ISBN already exists' });
    }
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

// PUT - Update a book (Admin only)
const updateBook = async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn, category, rating, pages, description, cover_url } = req.body;
  try {
    const result = await db.query(
      `UPDATE books SET title=$1, author=$2, isbn=$3, category=$4, rating=$5, pages=$6, description=$7, cover_url=$8
       WHERE id=$9 RETURNING *`,
      [title, author, isbn, category, rating, pages, description, cover_url, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'ERROR', message: 'Book not found' });
    }
    res.status(200).json({ status: 'SUCCESS', message: 'Book updated', book: result.rows[0] });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

// DELETE - Delete a book (Admin only)
const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    // Check for active borrowings
    const borrowCheck = await db.query(
      "SELECT * FROM borrowings WHERE book_id = $1 AND status = 'borrowed'", [id]
    );
    if (borrowCheck.rows.length > 0) {
      return res.status(400).json({ status: 'ERROR', message: 'Cannot delete: book is currently borrowed' });
    }
    await db.query('DELETE FROM borrowings WHERE book_id = $1', [id]);
    const result = await db.query('DELETE FROM books WHERE id = $1 RETURNING title', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ status: 'ERROR', message: 'Book not found' });
    }
    res.status(200).json({ status: 'SUCCESS', message: `"${result.rows[0].title}" deleted` });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

// GET - Get all categories
const getCategories = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT DISTINCT category FROM books WHERE category IS NOT NULL ORDER BY category'
    );
    const categories = result.rows.map(row => row.category);
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

// GET - Get books by category
const getBooksByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const result = await db.query(
      'SELECT * FROM books WHERE category = $1 ORDER BY created_at DESC',
      [category]
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
  addBook,
  updateBook,
  deleteBook,
  getCategories,
  getBooksByCategory,
};
