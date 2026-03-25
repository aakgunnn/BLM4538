import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, Dimensions } from 'react-native';
import { BookOpen, TrendingUp, Clock } from 'lucide-react-native';
import Colors from '../constants/Colors';
import BookCard from '../components/BookCard';
import { booksData } from '../data/mockData';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const featuredBooks = booksData.filter((book) => book.available).slice(0, 3);
  const borrowedBooks = booksData.filter((book) => !book.available);
  const trendingBooks = booksData.slice(0, 4);

  const handleBookPress = (id) => {
    navigation.navigate('BookDetails', { id });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Good afternoon 👋</Text>
        <Text style={styles.subGreeting}>What would you like to read today?</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <BookOpen size={20} color={Colors.primary} />
          <Text style={styles.statValue}>{booksData.length}</Text>
          <Text style={styles.statLabel}>Books</Text>
        </View>
        <View style={styles.statCard}>
          <Clock size={20} color={Colors.accent} />
          <Text style={styles.statValue}>{borrowedBooks.length}</Text>
          <Text style={styles.statLabel}>Borrowed</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={20} color={Colors.primary} />
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Read</Text>
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

      {/* Featured Collection */}
      <View style={[styles.section, { marginBottom: 30 }]}>
        <Text style={styles.sectionTitle}>Featured Collection</Text>
        <View style={{ marginTop: 12 }}>
          {featuredBooks.map((book) => (
            <BookCard 
              key={book.id} 
              book={book} 
              variant="compact" 
              onPress={() => handleBookPress(book.id)}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
