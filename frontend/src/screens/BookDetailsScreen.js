import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { ArrowLeft, Star, BookOpen, Calendar, Hash, Heart } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { booksData } from '../data/mockData';

const { width } = Dimensions.get('window');

const BookDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params || { id: "1" };
  const book = booksData.find((b) => b.id === id);

  if (!book) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Book not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Book Cover */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: book.coverUrl }} style={styles.coverImage} />
        </View>

        {/* Book Info */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{book.title}</Text>
              <Text style={styles.author}>{book.author}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Star size={16} fill={Colors.primary} color={Colors.primary} />
              <Text style={styles.ratingValue}>{book.rating}</Text>
            </View>
          </View>

          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{book.category}</Text>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <BookOpen size={20} color={Colors.primary} />
              <Text style={styles.statLabel}>Pages</Text>
              <Text style={styles.statValue}>{book.pages}</Text>
            </View>
            <View style={styles.statItem}>
              <Calendar size={20} color={Colors.primary} />
              <Text style={styles.statLabel}>Status</Text>
              <Text style={styles.statValue}>{book.available ? "Available" : "Borrowed"}</Text>
            </View>
            <View style={styles.statItem}>
              <Hash size={20} color={Colors.primary} />
              <Text style={styles.statLabel}>ISBN</Text>
              <Text style={styles.statValue}>{book.isbn.slice(-4)}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this book</Text>
            <Text style={styles.description}>{book.description}</Text>
          </View>

          {/* Due Date (if borrowed) */}
          {!book.available && book.dueDate && (
            <View style={styles.dueCard}>
              <Text style={styles.dueLabel}>Due Date</Text>
              <Text style={styles.dueValue}>{book.dueDate}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={[styles.borrowButton, !book.available && styles.disabledButton]}
          disabled={!book.available}
        >
          <Text style={styles.borrowButtonText}>
            {book.available ? "Borrow Book" : "Currently Borrowed"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.favoriteButton}>
          <Heart size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 8,
  },
  imageContainer: {
    padding: 24,
    alignItems: 'center',
  },
  coverImage: {
    width: width - 48,
    height: (width - 48) * 1.5,
    borderRadius: 16,
    backgroundColor: Colors.muted,
  },
  infoContainer: {
    paddingHorizontal: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  author: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    marginLeft: 4,
  },
  categoryBadge: {
    backgroundColor: Colors.secondary,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 24,
  },
  categoryText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    width: (width - 48 - 32) / 3,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  dueCard: {
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
    marginBottom: 24,
  },
  dueLabel: {
    fontSize: 13,
    color: Colors.text,
    marginBottom: 4,
  },
  dueValue: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    padding: 20,
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  borrowButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  disabledButton: {
    backgroundColor: Colors.muted,
  },
  borrowButtonText: {
    color: Colors.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: Colors.error,
    fontSize: 16,
  },
});

export default BookDetailsScreen;
