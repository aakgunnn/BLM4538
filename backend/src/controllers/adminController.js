const db = require('../config/db');

// GET - Admin dashboard stats
const getStats = async (req, res) => {
  try {
    const booksResult = await db.query('SELECT COUNT(*) FROM books');
    const availableResult = await db.query('SELECT COUNT(*) FROM books WHERE available = true');
    const borrowedResult = await db.query("SELECT COUNT(*) FROM borrowings WHERE status = 'borrowed'");
    const usersResult = await db.query('SELECT COUNT(*) FROM users');
    const returnedTodayResult = await db.query(
      "SELECT COUNT(*) FROM borrowings WHERE status = 'returned' AND return_date = CURRENT_DATE"
    );
    const overdueResult = await db.query(
      "SELECT COUNT(*) FROM books WHERE available = false AND due_date < CURRENT_DATE"
    );

    // Recent activity (last 10)
    const recentResult = await db.query(
      `SELECT b.*, books.title, users.full_name AS user_name
       FROM borrowings b
       JOIN books ON b.book_id = books.id
       JOIN users ON b.user_id = users.id
       ORDER BY b.created_at DESC LIMIT 10`
    );

    res.status(200).json({
      totalBooks: parseInt(booksResult.rows[0].count),
      availableBooks: parseInt(availableResult.rows[0].count),
      activeBorrowings: parseInt(borrowedResult.rows[0].count),
      totalUsers: parseInt(usersResult.rows[0].count),
      returnedToday: parseInt(returnedTodayResult.rows[0].count),
      overdueBooks: parseInt(overdueResult.rows[0].count),
      recentActivity: recentResult.rows,
    });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', message: err.message });
  }
};

module.exports = { getStats };
