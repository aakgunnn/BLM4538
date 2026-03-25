import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Star, Clock } from 'lucide-react-native';
import Colors from '../constants/Colors';

const BookCard = ({ book, variant = "default", onPress }) => {
  if (variant === "compact") {
    return (
      <TouchableOpacity style={styles.compactContainer} onPress={onPress} activeOpacity={0.7}>
        <Image source={{ uri: book.coverUrl }} style={styles.compactImage} />
        <View style={styles.compactInfo}>
          <Text style={styles.title} numberOfLines={1}>{book.title}</Text>
          <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
          <View style={styles.ratingContainer}>
            <Star size={12} fill={Colors.primary} color={Colors.primary} />
            <Text style={styles.ratingText}>{book.rating}</Text>
          </View>
          <View style={{ marginTop: 8 }}>
            {book.available ? (
              <View style={styles.availableBadge}>
                <Text style={styles.availableText}>Available</Text>
              </View>
            ) : (
              <View style={styles.dueContainer}>
                <Clock size={12} color={Colors.textSecondary} />
                <Text style={styles.dueText}>Due {book.dueDate}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.defaultContainer} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: book.coverUrl }} style={styles.defaultImage} />
      <View style={styles.defaultInfo}>
        <Text style={styles.title} numberOfLines={1}>{book.title}</Text>
        <Text style={styles.author} numberOfLines={1}>{book.author}</Text>
        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Star size={14} fill={Colors.primary} color={Colors.primary} />
            <Text style={styles.ratingText}>{book.rating}</Text>
          </View>
          {book.available ? (
            <View style={styles.availableBadge}>
              <Text style={styles.availableText}>Available</Text>
            </View>
          ) : (
            <View style={styles.borrowedBadge}>
              <Text style={styles.borrowedText}>Borrowed</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  compactContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  compactImage: {
    width: 64,
    height: 96,
    borderRadius: 8,
  },
  compactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  defaultContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    width: '48%',
    marginBottom: 16,
  },
  defaultImage: {
    width: '100%',
    height: 192,
  },
  defaultInfo: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  author: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  availableBadge: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  availableText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
  borrowedBadge: {
    backgroundColor: Colors.muted,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  borrowedText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  dueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
});

export default BookCard;
