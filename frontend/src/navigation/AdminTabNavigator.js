import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, BookOpen, ClipboardList, User } from 'lucide-react-native';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminBooksScreen from '../screens/admin/AdminBooksScreen';
import AdminBorrowingsScreen from '../screens/admin/AdminBorrowingsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1E293B',
        tabBarInactiveTintColor: '#94A3B8',
        headerShown: false,
        tabBarStyle: { height: 60, paddingBottom: 10, backgroundColor: '#FFFFFF' },
      }}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen}
        options={{ tabBarIcon: ({color,size}) => <LayoutDashboard size={size} color={color}/> }}
      />
      <Tab.Screen name="Kitaplar" component={AdminBooksScreen}
        options={{ tabBarIcon: ({color,size}) => <BookOpen size={size} color={color}/> }}
      />
      <Tab.Screen name="Ödünçler" component={AdminBorrowingsScreen}
        options={{ tabBarIcon: ({color,size}) => <ClipboardList size={size} color={color}/> }}
      />
      <Tab.Screen name="Profil" component={ProfileScreen}
        options={{ tabBarIcon: ({color,size}) => <User size={size} color={color}/> }}
      />
    </Tab.Navigator>
  );
};

export default AdminTabNavigator;
