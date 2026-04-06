import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Search as SearchIcon, X } from 'lucide-react-native';
import Colors from '../constants/Colors';
import BookCard from '../components/BookCard';
import apiService from '../services/apiService';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce timer ref
  const timerRef = React.useRef(null);

  const handleSearch = useCallback((text) => {
    setSearchQuery(text);

    // Clear previous timer
    if (timerRef.current) clearTimeout(timerRef.current);

    if (text.trim().length === 0) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    // Debounce: wait 500ms after user stops typing
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      setHasSearched(true);
      try {
        const data = await apiService.searchBooks(text);
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  }, []);

  const handleBookPress = (id) => {
    navigation.navigate('Anasayfa', { screen: 'BookDetails', params: { id } });
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
    setHasSearched(false);
  };

  const recentSearches = ["Pride and Prejudice", "James Clear", "Science Fiction"];

  const renderEmptyContent = () => (
    <View style={styles.content}>
      {/* Recent Searches */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        {recentSearches.map((search, index) => (
          <TouchableOpacity
            key={index}
            style={styles.recentItem}
            onPress={() => handleSearch(search)}
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
              onPress={() => handleSearch(category)}
            >
              <Text style={styles.categoryName}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <SearchIcon style={styles.searchIcon} size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.input}
            placeholder="Search books, authors..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearIcon}>
              <X size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      {!hasSearched ? (
        renderEmptyContent()
      ) : loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Aranıyor...</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <Text style={styles.resultCount}>
              {results.length} {results.length === 1 ? "result" : "results"} found
            </Text>
          }
          renderItem={({ item }) => (
            <BookCard 
              book={item} 
              variant="compact" 
              onPress={() => handleBookPress(item.id)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <SearchIcon size={48} color={Colors.muted} />
              <Text style={styles.emptyText}>No books found</Text>
              <Text style={styles.emptySubText}>Try searching with different keywords</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.textSecondary,
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
});

export default SearchScreen;
