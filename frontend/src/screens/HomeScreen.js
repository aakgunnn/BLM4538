import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { BookOpen, TrendingUp, Clock, RefreshCw } from 'lucide-react-native';
import Colors from '../constants/Colors';
import BookCard from '../components/BookCard';
import apiService from '../services/apiService';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBooks = useCallback(async () => {
    try {
      setError(null);
      const data = await apiService.getBooks();
      setBooks(data);
    } catch (err) {
      setError('Kitaplar yüklenemedi. Sunucu bağlantısını kontrol edin.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchBooks();
  }, [fetchBooks]);

  const handleBookPress = (id) => {
    navigation.navigate('BookDetails', { id });
  };

  const borrowedBooks = books.filter((book) => !book.available);
  const trendingBooks = books.slice(0, 4);
  const featuredBooks = books.filter((book) => book.available).slice(0, 3);

  // Loading State
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Kitaplar yükleniyor...</Text>
      </View>
    );
  }

  // Error State
  if (error && books.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBooks}>
          <RefreshCw size={20} color={Colors.surface} />
          <Text style={styles.retryText}>Tekrar Dene</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderHeader = () => (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good afternoon 👋</Text>
        <Text style={styles.subGreeting}>What would you like to read today?</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <BookOpen size={20} color={Colors.primary} />
          <Text style={styles.statValue}>{books.length}</Text>
          <Text style={styles.statLabel}>Books</Text>
        </View>
        <View style={styles.statCard}>
          <Clock size={20} color={Colors.accent} />
          <Text style={styles.statValue}>{borrowedBooks.length}</Text>
          <Text style={styles.statLabel}>Borrowed</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={20} color={Colors.primary} />
          <Text style={styles.statValue}>{books.filter(b => b.available).length}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
      </View>

      {/* Currently Borrowed */}
      {borrowedBooks.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Currently Borrowed</Text>
            <Text style={styles.viewAll}>View all</Text>
          </View>
          {borrowedBooks.map((book) => (
            <BookCard 
              key={book.id} 
              book={book} 
              variant="compact" 
              onPress={() => handleBookPress(book.id)}
            />
          ))}
        </View>
      )}

      {/* Trending Now */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>
        <View style={styles.grid}>
          {trendingBooks.map((book) => (
            <BookCard 
              key={book.id} 
              book={book} 
              onPress={() => handleBookPress(book.id)}
            />
          ))}
        </View>
      </View>

      {/* Featured Collection Header */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Collection</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      style={styles.container}
      data={featuredBooks}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => (
        <View style={{ paddingHorizontal: 24 }}>
          <BookCard 
            book={item} 
            variant="compact" 
            onPress={() => handleBookPress(item.id)}
          />
        </View>
      )}
      ListFooterComponent={<View style={{ height: 30 }} />}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 40,
  },
  greeting: {
    fontSize: 24,
    color: Colors.surface,
    fontWeight: '500',
  },
  subGreeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: -24,
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    width: (width - 48 - 24) / 3,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  viewAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
