import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { User, BookOpen, Clock, Award, Settings, LogOut, ChevronRight, Palette } from 'lucide-react-native';
import Colors from '../constants/Colors';
import BookCard from '../components/BookCard';
import { booksData } from '../data/mockData';

const ProfileScreen = () => {
  const borrowedBooks = booksData.filter((book) => !book.available);
  const totalBooksRead = 12;
  const readingStreak = 7;

  const menuItems = [
    { icon: Palette, label: "Design System", action: "design-system" },
    { icon: Settings, label: "Settings", action: "settings" },
    { icon: Award, label: "Achievements", action: "achievements" },
    { icon: LogOut, label: "Log Out", action: "logout" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <User size={32} color={Colors.surface} />
          </View>
          <View>
            <Text style={styles.userName}>Sarah Johnson</Text>
            <Text style={styles.userSince}>Member since 2024</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <BookOpen size={20} color={Colors.surface} />
            <Text style={styles.statValue}>{totalBooksRead}</Text>
            <Text style={styles.statLabel}>Books Read</Text>
          </View>
          <View style={styles.statBox}>
            <Clock size={20} color={Colors.surface} />
            <Text style={styles.statValue}>{borrowedBooks.length}</Text>
            <Text style={styles.statLabel}>Borrowed</Text>
          </View>
          <View style={styles.statBox}>
            <Award size={20} color={Colors.surface} />
            <Text style={styles.statValue}>{readingStreak}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>
      </View>

      {/* Currently Borrowed */}
      {borrowedBooks.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Currently Borrowed</Text>
          {borrowedBooks.map((book) => (
            <BookCard key={book.id} book={book} variant="compact" />
          ))}
        </View>
      )}

      {/* Reading Goal */}
      <View style={styles.section}>
        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <Text style={styles.goalTitle}>2026 Reading Goal</Text>
            <Text style={styles.goalProgress}>{totalBooksRead}/24 books</Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${(totalBooksRead / 24) * 100}%` }]} 
            />
          </View>
        </View>
      </View>

      {/* Menu List */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.menuItem,
                index !== menuItems.length - 1 && styles.menuItemBorder
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.menuLeft}>
                <Icon size={20} color={Colors.textSecondary} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <ChevronRight size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Version */}
      <View style={styles.footer}>
        <Text style={styles.version}>Library App v1.0.0</Text>
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
    paddingBottom: 32,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.surface,
  },
  userSince: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '31%',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.surface,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  goalCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  goalProgress: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.muted,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  menuContainer: {
    marginHorizontal: 24,
    marginTop: 24,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 12,
  },
  footer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  version: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

export default ProfileScreen;
