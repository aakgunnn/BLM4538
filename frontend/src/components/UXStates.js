import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WifiOff, RefreshCw, BookOpen, SearchX, ClipboardList, AlertCircle } from 'lucide-react-native';
import Colors from '../constants/Colors';

// Loading indicator with message
export const LoadingState = ({ message = 'Yükleniyor...' }) => (
  <View style={styles.container}>
    <View style={styles.loadingCard}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  </View>
);

// Connection error with retry
export const ErrorState = ({ message = 'Bağlantı hatası oluştu.', onRetry }) => (
  <View style={styles.container}>
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <WifiOff size={32} color="#EF4444" />
      </View>
      <Text style={styles.title}>Bağlantı Hatası</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <RefreshCw size={18} color="#FFFFFF" />
          <Text style={styles.retryText}>Tekrar Dene</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

// Empty list state
export const EmptyState = ({ 
  type = 'books', 
  message,
  subMessage,
}) => {
  const configs = {
    books: {
      icon: BookOpen,
      title: 'Kitap Bulunamadı',
      sub: 'Henüz kitap eklenmemiş veya filtreye uygun kitap yok.',
    },
    search: {
      icon: SearchX,
      title: 'Sonuç Bulunamadı',
      sub: 'Farklı anahtar kelimelerle tekrar deneyin.',
    },
    borrowings: {
      icon: ClipboardList,
      title: 'Ödünç Kaydı Yok',
      sub: 'Henüz ödünç alınmış kitap bulunmuyor.',
    },
    general: {
      icon: AlertCircle,
      title: 'Veri Yok',
      sub: 'Gösterilecek bir şey bulunamadı.',
    },
  };

  const config = configs[type] || configs.general;
  const Icon = config.icon;

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <Icon size={36} color={Colors.textSecondary} />
      </View>
      <Text style={styles.emptyTitle}>{message || config.title}</Text>
      <Text style={styles.emptyMessage}>{subMessage || config.sub}</Text>
    </View>
  );
};

// Inline loading (for small sections)
export const InlineLoading = ({ message = 'Yükleniyor...' }) => (
  <View style={styles.inlineContainer}>
    <ActivityIndicator size="small" color={Colors.primary} />
    <Text style={styles.inlineText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 24,
  },
  loadingCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 280,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  card: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 320,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  emptyMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Inline
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  inlineText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 8,
  },
});
