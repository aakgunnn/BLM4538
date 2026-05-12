import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { BookOpen, Users, Clock, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react-native';
import Colors from '../../constants/Colors';
import apiService from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';

const AdminDashboardScreen = () => {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const data = await apiService.getAdminStats(token);
      setStats(data);
    } catch (err) {
      console.error('Stats fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1E293B" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSub}>Hoş geldiniz, {user?.full_name}</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { borderLeftColor: '#3B82F6' }]}>
          <BookOpen size={22} color="#3B82F6" />
          <Text style={styles.statValue}>{stats?.totalBooks || 0}</Text>
          <Text style={styles.statLabel}>Toplam Kitap</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
          <CheckCircle size={22} color="#10B981" />
          <Text style={styles.statValue}>{stats?.availableBooks || 0}</Text>
          <Text style={styles.statLabel}>Mevcut</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#F59E0B' }]}>
          <Clock size={22} color="#F59E0B" />
          <Text style={styles.statValue}>{stats?.activeBorrowings || 0}</Text>
          <Text style={styles.statLabel}>Aktif Ödünç</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#8B5CF6' }]}>
          <Users size={22} color="#8B5CF6" />
          <Text style={styles.statValue}>{stats?.totalUsers || 0}</Text>
          <Text style={styles.statLabel}>Kullanıcı</Text>
        </View>
      </View>

      {/* Overdue Alert */}
      {stats?.overdueBooks > 0 && (
        <View style={styles.alertCard}>
          <AlertTriangle size={20} color="#EF4444" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Süresi Geçmiş Kitaplar!</Text>
            <Text style={styles.alertText}>{stats.overdueBooks} kitabın iade süresi dolmuş.</Text>
          </View>
        </View>
      )}

      {/* Today Stats */}
      <View style={styles.todayCard}>
        <TrendingUp size={20} color="#10B981" />
        <Text style={styles.todayText}>Bugün {stats?.returnedToday || 0} kitap iade edildi</Text>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Son İşlemler</Text>
        {stats?.recentActivity?.length > 0 ? (
          stats.recentActivity.map((item, index) => (
            <View key={item.id || index} style={styles.activityCard}>
              <View style={[
                styles.activityDot,
                { backgroundColor: item.status === 'borrowed' ? '#F59E0B' : '#10B981' }
              ]} />
              <View style={styles.activityInfo}>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activityUser}>{item.user_name}</Text>
              </View>
              <View style={styles.activityRight}>
                <Text style={[
                  styles.activityStatus,
                  { color: item.status === 'borrowed' ? '#F59E0B' : '#10B981' }
                ]}>
                  {item.status === 'borrowed' ? 'Ödünç' : 'İade'}
                </Text>
                <Text style={styles.activityDate}>
                  {new Date(item.created_at).toLocaleDateString('tr-TR')}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Henüz işlem yok</Text>
          </View>
        )}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F5F9' },
  header: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 24, paddingTop: 48, paddingBottom: 28,
  },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#FFFFFF' },
  headerSub: { fontSize: 14, color: '#94A3B8', marginTop: 4 },
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 16, marginTop: -14, justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16,
    width: '48%', marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 4,
  },
  statValue: { fontSize: 28, fontWeight: '700', color: '#1E293B', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#64748B', marginTop: 2 },
  alertCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FEF2F2', borderRadius: 12,
    padding: 16, marginHorizontal: 16, marginBottom: 12,
    borderWidth: 1, borderColor: '#FECACA',
  },
  alertContent: { marginLeft: 12, flex: 1 },
  alertTitle: { fontSize: 14, fontWeight: '600', color: '#DC2626' },
  alertText: { fontSize: 13, color: '#EF4444', marginTop: 2 },
  todayCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0FDF4', borderRadius: 12,
    padding: 16, marginHorizontal: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#BBF7D0',
  },
  todayText: { fontSize: 14, color: '#166534', fontWeight: '500', marginLeft: 10 },
  section: { paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#1E293B', marginBottom: 12 },
  activityCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 10,
    padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  activityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: 14, fontWeight: '500', color: '#1E293B' },
  activityUser: { fontSize: 12, color: '#64748B', marginTop: 2 },
  activityRight: { alignItems: 'flex-end' },
  activityStatus: { fontSize: 12, fontWeight: '600' },
  activityDate: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  emptyCard: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 32, alignItems: 'center',
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  emptyText: { color: '#64748B', fontSize: 14 },
});

export default AdminDashboardScreen;
