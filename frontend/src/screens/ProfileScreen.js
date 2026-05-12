import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { User, BookOpen, Clock, Award, Settings, LogOut, ChevronRight, Shield, RotateCcw } from 'lucide-react-native';
import Colors from '../constants/Colors';
import apiService from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const { user, logout, isAdmin } = useAuth();
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBorrowings = useCallback(async () => {
    if (!user) return;
    try {
      const data = await apiService.getUserBorrowings(user.id);
      setBorrowings(data);
    } catch (err) {
      console.error('Borrowings fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchBorrowings();
  }, [fetchBorrowings]);

  const activeBorrowings = borrowings.filter(b => b.status === 'borrowed');
  const returnedCount = borrowings.filter(b => b.status === 'returned').length;

  const handleReturn = async (borrowingId) => {
    try {
      await apiService.returnBook(borrowingId);
      Alert.alert('Başarılı! ✅', 'Kitap iade edildi.');
      fetchBorrowings();
    } catch (err) {
      Alert.alert('Hata', err.message || 'İade başarısız.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkış yapmak istediğinize emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Çıkış Yap', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const memberSince = user?.created_at 
    ? new Date(user.created_at).getFullYear() 
    : 2026;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <User size={32} color={Colors.surface} />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.userName}>{user?.full_name || 'Kullanıcı'}</Text>
              {isAdmin && (
                <View style={styles.adminBadge}>
                  <Shield size={12} color={Colors.surface} />
                  <Text style={styles.adminText}>Admin</Text>
                </View>
              )}
            </View>
            <Text style={styles.userSince}>Member since {memberSince}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <BookOpen size={20} color={Colors.surface} />
            <Text style={styles.statValue}>{returnedCount}</Text>
            <Text style={styles.statLabel}>Books Read</Text>
          </View>
          <View style={styles.statBox}>
            <Clock size={20} color={Colors.surface} />
            <Text style={styles.statValue}>{activeBorrowings.length}</Text>
            <Text style={styles.statLabel}>Borrowed</Text>
          </View>
          <View style={styles.statBox}>
            <Award size={20} color={Colors.surface} />
            <Text style={styles.statValue}>{borrowings.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Currently Borrowed */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Currently Borrowed</Text>
        {loading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : activeBorrowings.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Ödünç alınmış kitap yok</Text>
          </View>
        ) : (
          activeBorrowings.map((item) => (
            <View key={item.id} style={styles.borrowCard}>
              {item.cover_url && (
                <Image source={{ uri: item.cover_url }} style={styles.borrowCover} />
              )}
              <View style={styles.borrowInfo}>
                <Text style={styles.borrowTitle}>{item.title}</Text>
                <Text style={styles.borrowAuthor}>{item.author}</Text>
                <Text style={styles.borrowDate}>
                  Alınma: {new Date(item.borrow_date).toLocaleDateString('tr-TR')}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.returnButton}
                onPress={() => handleReturn(item.id)}
              >
                <RotateCcw size={16} color={Colors.primary} />
                <Text style={styles.returnText}>İade</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      {/* Menu List */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} activeOpacity={0.7}>
          <View style={styles.menuLeft}>
            <Settings size={20} color={Colors.textSecondary} />
            <Text style={styles.menuLabel}>Settings</Text>
          </View>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.menuItem, styles.menuItemBorder]} activeOpacity={0.7}>
          <View style={styles.menuLeft}>
            <Award size={20} color={Colors.textSecondary} />
            <Text style={styles.menuLabel}>Achievements</Text>
          </View>
          <ChevronRight size={20} color={Colors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout} activeOpacity={0.7}>
          <View style={styles.menuLeft}>
            <LogOut size={20} color="#EF4444" />
            <Text style={[styles.menuLabel, { color: '#EF4444' }]}>Log Out</Text>
          </View>
          <ChevronRight size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Version */}
      <View style={styles.footer}>
        <Text style={styles.version}>Library App v1.0.0</Text>
        <Text style={styles.roleInfo}>
          Role: {isAdmin ? 'Admin' : 'Member'}
        </Text>
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
  userEmail: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8,
  },
  adminText: {
    fontSize: 11,
    color: Colors.surface,
    fontWeight: '600',
    marginLeft: 4,
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
  emptyCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  borrowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  borrowCover: {
    width: 48,
    height: 68,
    borderRadius: 6,
    marginRight: 12,
    backgroundColor: Colors.muted,
  },
  borrowInfo: {
    flex: 1,
  },
  borrowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  borrowAuthor: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  borrowDate: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  returnButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  returnText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: 4,
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
  roleInfo: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});

export default ProfileScreen;
