import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Search as SearchIcon, X } from 'lucide-react-native';
import Colors from '../constants/Colors';
import BookCard from '../components/BookCard';
import { booksData } from '../data/mockData';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleBookPress = (id) => {
    navigation.navigate('Anasayfa', { screen: 'BookDetails', params: { id } });
  };

  const filteredBooks = booksData.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentSearches = ["Pride and Prejudice", "James Clear", "Science Fiction"];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <SearchIcon style={styles.searchIcon} size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Search books, authors, categories..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearIcon}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Results */}
      {searchQuery ? (
        <View style={styles.content}>
          <Text style={styles.resultCount}>
            {filteredBooks.length} {filteredBooks.length === 1 ? "result" : "results"} found
          </Text>
          <View style={styles.resultsList}>
            {filteredBooks.map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                variant="compact" 
                onPress={() => handleBookPress(book.id)}
              />
            ))}
          </View>
          {filteredBooks.length === 0 && (
            <View style={styles.emptyContainer}>
              <SearchIcon size={48} color={Colors.muted} />
              <Text style={styles.emptyText}>No books found</Text>
              <Text style={styles.emptySubText}>Try searching with different keywords</Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.content}>
          {/* Recent Searches */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentItem}
                onPress={() => setSearchQuery(search)}
              >
                <SearchIcon size={16} color={Colors.textSecondary} />
                <Text style={styles.recentText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Popular Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Categories</Text>
            <View style={styles.categoryGrid}>
              {["Fiction", "Classic", "Self-Help", "Science Fiction"].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.categoryCard}
                  onPress={() => setSearchQuery(category)}
                >
                  <Text style={styles.categoryName}>{category}</Text>
                  <Text style={styles.categoryCount}>
                    {booksData.filter((b) => b.category === category).length} books
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: Colors.text,
  },
  clearIcon: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 24,
  },
  resultCount: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  resultsList: {
    marginBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  recentText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: 'rgba(74, 144, 226, 0.05)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  categoryCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});

export default SearchScreen;
