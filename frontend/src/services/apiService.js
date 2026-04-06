import { Platform } from 'react-native';

// Android Emulator: 10.0.2.2 → localhost
// Physical Device / Expo Go: Bilgisayarınızın ağ IP'si
const LOCAL_IP = '10.102.143.111'; // <-- WiFi IP adresiniz (ipconfig ile bulabilirsiniz)

const API_BASE_URL = Platform.OS === 'android' 
  ? `http://10.0.2.2:5000/api`   // Android Emulator
  : `http://${LOCAL_IP}:5000/api`; // iOS / Fiziksel cihaz

// Expo Go (fiziksel telefon) kullanıyorsanız şu satırı aktifleştirin:
// const API_BASE_URL = `http://${LOCAL_IP}:5000/api`;

export const apiService = {
  // Get all books
  getBooks: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/books`);
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      return data.map(mapBookFromApi);
    } catch (error) {
      console.error('getBooks error:', error);
      throw error;
    }
  },

  // Get a single book by ID
  getBookById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`);
      if (!response.ok) throw new Error('Book not found');
      const data = await response.json();
      return mapBookFromApi(data);
    } catch (error) {
      console.error('getBookById error:', error);
      throw error;
    }
  },

  // Search books by query
  searchBooks: async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      return data.map(mapBookFromApi);
    } catch (error) {
      console.error('searchBooks error:', error);
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
    category: book.category || 'Uncategorized',
    rating: parseFloat(book.rating) || 0,
    pages: book.pages || 0,
    description: book.description || '',
    coverUrl: book.cover_url || '',
    available: book.available !== false,
    dueDate: book.due_date || null,
    availableCopies: book.available_copies || 0,
    totalCopies: book.total_copies || 0,
  };
}

export default apiService;
