const db = require('../config/db');

// POST - Borrow a book
const borrowBook = async (req, res) => {
  const { user_id, book_id } = req.body;

  try {
    // Check if book exists and is available
    const bookResult = await db.query('SELECT * FROM books WHERE id = $1', [book_id]);
    if (bookResult.rows.length === 0) {
      return res.status(404).json({ status: 'ERROR', message: 'Book not found' });
    }

    const book = bookResult.rows[0];
    if (!book.available) {
      return res.status(400).json({ status: 'ERROR', message: 'Book is not available for borrowing' });
    }

    // Check if user already borrowed this book
    const existingBorrow = await db.query(
      "SELECT * FROM borrowings WHERE user_id = $1 AND book_id = $2 AND status = 'borrowed'",
      [user_id, book_id]
    );
    if (existingBorrow.rows.length > 0) {
      return res.status(400).json({ status: 'ERROR', message: 'You already borrowed this book' });
    }

    // Create borrowing record
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days borrowing period

    const borrowResult = await db.query(
      'INSERT INTO borrowings (user_id, book_id, borrow_date, status) VALUES ($1, $2, CURRENT_DATE, $3) RETURNING *',
      [user_id, book_id, 'borrowed']
    );

    // Update book availability
    await db.query(
      'UPDATE books SET available = false, due_date = $1 WHERE id = $2',
      [dueDate.toISOString().split('T')[0], book_id]
    );

    res.status(201).json({
      status: 'SUCCESS',
      message: 'Book borrowed successfully',
      borrowing: borrowResult.rows[0],
      dueDate: dueDate.toISOString().split('T')[0],
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

// PUT - Return a book
const returnBook = async (req, res) => {
  const { id } = req.params; // borrowing ID

  try {
    // Find the borrowing record
    const borrowResult = await db.query(
      "SELECT * FROM borrowings WHERE id = $1 AND status = 'borrowed'",
      [id]
    );
    if (borrowResult.rows.length === 0) {
      return res.status(404).json({ status: 'ERROR', message: 'Active borrowing not found' });
    }

    const borrowing = borrowResult.rows[0];

    // Update borrowing status
    await db.query(
      "UPDATE borrowings SET status = 'returned', return_date = CURRENT_DATE WHERE id = $1",
      [id]
    );

    // Update book availability
    await db.query(
      'UPDATE books SET available = true, due_date = NULL WHERE id = $1',
      [borrowing.book_id]
    );

    res.status(200).json({
      status: 'SUCCESS',
      message: 'Book returned successfully',
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

// GET - Get all borrowings for a user
const getUserBorrowings = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await db.query(
      `SELECT b.*, 
              books.title, books.author, books.cover_url, books.isbn, books.category, books.rating, books.pages
       FROM borrowings b
       JOIN books ON b.book_id = books.id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

// GET - Get ALL borrowings (Admin only)
const getAllBorrowings = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT b.*, 
              books.title, books.author, books.cover_url,
              users.full_name AS user_name, users.email AS user_email
       FROM borrowings b
       JOIN books ON b.book_id = books.id
       JOIN users ON b.user_id = users.id
       ORDER BY b.created_at DESC`
    );
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

// PUT - Update borrowing duration (Admin only)
const updateBorrowingDuration = async (req, res) => {
  const { id } = req.params;
  const { days } = req.body; // number of days to extend

  try {
    const borrowResult = await db.query(
      "SELECT * FROM borrowings WHERE id = $1 AND status = 'borrowed'",
      [id]
    );
    if (borrowResult.rows.length === 0) {
      return res.status(404).json({ status: 'ERROR', message: 'Active borrowing not found' });
    }

    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + (days || 14));

    await db.query(
      'UPDATE books SET due_date = $1 WHERE id = $2',
      [newDueDate.toISOString().split('T')[0], borrowResult.rows[0].book_id]
    );

    res.status(200).json({
      status: 'SUCCESS',
      message: `Due date updated to ${newDueDate.toISOString().split('T')[0]}`,
      dueDate: newDueDate.toISOString().split('T')[0],
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

// PUT - Force return a book (Admin only)
const forceReturnBook = async (req, res) => {
  const { id } = req.params;

  try {
    const borrowResult = await db.query(
      "SELECT * FROM borrowings WHERE id = $1 AND status = 'borrowed'",
      [id]
    );
    if (borrowResult.rows.length === 0) {
      return res.status(404).json({ status: 'ERROR', message: 'Active borrowing not found' });
    }

    await db.query(
      "UPDATE borrowings SET status = 'returned', return_date = CURRENT_DATE WHERE id = $1",
      [id]
    );
    await db.query(
      'UPDATE books SET available = true, due_date = NULL WHERE id = $1',
      [borrowResult.rows[0].book_id]
    );

    res.status(200).json({ status: 'SUCCESS', message: 'Book force-returned by admin' });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

module.exports = {
  borrowBook,
  returnBook,
  getUserBorrowings,
  getAllBorrowings,
  updateBorrowingDuration,
  forceReturnBook,
};
