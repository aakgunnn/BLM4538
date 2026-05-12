import { Platform } from "react-native";

// Android Emulator: 10.0.2.2 → localhost
// iOS / Fiziksel cihaz: localhost
const API_BASE_URL =
  Platform.OS === "android"
    ? `http://10.0.2.2:5000/api` // Android Emulator
    : `http://localhost:5000/api`; // iOS / Fiziksel cihaz

// Test user ID (seed data'daki Sarah Johnson)
export const TEST_USER_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

export const apiService = {
  // Get all books
  getBooks: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books`);
      if (!response.ok) throw new Error("Failed to fetch books");
      const data = await response.json();
      return data.map(mapBookFromApi);
    } catch (error) {
      console.error("getBooks error:", error);
      throw error;
    }
  },

  // Get a single book by ID
  getBookById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`);
      if (!response.ok) throw new Error("Book not found");
      const data = await response.json();
      return mapBookFromApi(data);
    } catch (error) {
      console.error("getBookById error:", error);
      throw error;
    }
  },

  // Search books by query
  searchBooks: async (query) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/books/search?q=${encodeURIComponent(query)}`,
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      return data.map(mapBookFromApi);
    } catch (error) {
      console.error("searchBooks error:", error);
      throw error;
    }
  },

  // Get all categories
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      return await response.json();
    } catch (error) {
      console.error("getCategories error:", error);
      throw error;
    }
  },

  // Get books by category
  getBooksByCategory: async (category) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/category/${encodeURIComponent(category)}`);
      if (!response.ok) throw new Error("Failed to fetch by category");
      const data = await response.json();
      return data.map(mapBookFromApi);
    } catch (error) {
      console.error("getBooksByCategory error:", error);
      throw error;
    }
  },

  // POST - Borrow a book
  borrowBook: async (userId, bookId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/borrowings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, book_id: bookId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Borrow failed');
      return data;
    } catch (error) {
      console.error("borrowBook error:", error);
      throw error;
    }
  },

  // PUT - Return a book
  returnBook: async (borrowingId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/borrowings/${borrowingId}/return`, {
        method: 'PUT',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Return failed');
      return data;
    } catch (error) {
      console.error("returnBook error:", error);
      throw error;
    }
  },

  // GET - Get user's borrowings
  getUserBorrowings: async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/borrowings/user/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch borrowings");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("getUserBorrowings error:", error);
      throw error;
    }
  },

  // POST - Register
  register: async (full_name, email, password, role) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, email, password, role }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      return data;
    } catch (error) {
      console.error("register error:", error);
      throw error;
    }
  },

  // POST - Login
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      return data;
    } catch (error) {
      console.error("login error:", error);
      throw error;
    }
  },

  // ==================== ADMIN API ====================

  // POST - Add book (Admin)
  addBook: async (bookData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(bookData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Add book failed');
      return data;
    } catch (error) {
      console.error("addBook error:", error);
      throw error;
    }
  },

  // DELETE - Delete book (Admin)
  deleteBook: async (bookId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Delete failed');
      return data;
    } catch (error) {
      console.error("deleteBook error:", error);
      throw error;
    }
  },

  // GET - All borrowings (Admin)
  getAllBorrowings: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/borrowings/all`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch borrowings");
      return await response.json();
    } catch (error) {
      console.error("getAllBorrowings error:", error);
      throw error;
    }
  },

  // PUT - Update borrowing duration (Admin)
  updateBorrowingDuration: async (borrowingId, days, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/borrowings/${borrowingId}/duration`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ days }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Update failed');
      return data;
    } catch (error) {
      console.error("updateDuration error:", error);
      throw error;
    }
  },

  // PUT - Force return (Admin)
  forceReturnBook: async (borrowingId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/borrowings/${borrowingId}/force-return`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Force return failed');
      return data;
    } catch (error) {
      console.error("forceReturn error:", error);
      throw error;
    }
  },

  // GET - Admin stats
  getAdminStats: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch stats");
      return await response.json();
    } catch (error) {
      console.error("getAdminStats error:", error);
      throw error;
    }
  },
};

// Map snake_case API fields to camelCase used in components
function mapBookFromApi(book) {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    isbn: book.isbn,
    category: book.category || "Uncategorized",
    rating: parseFloat(book.rating) || 0,
    pages: book.pages || 0,
    description: book.description || "",
    coverUrl: book.cover_url || "",
    available: book.available !== false,
    dueDate: book.due_date || null,
    availableCopies: book.available_copies || 0,
    totalCopies: book.total_copies || 0,
  };
}

export default apiService;
