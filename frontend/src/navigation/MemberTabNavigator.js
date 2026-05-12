import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Search, User } from 'lucide-react-native';
import HomeStack from './HomeStack';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Colors from '../constants/Colors';

const Tab = createBottomTabNavigator();

const MemberTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        headerShown: false,
        tabBarStyle: { height: 60, paddingBottom: 10 },
      }}
    >
      <Tab.Screen name="Anasayfa" component={HomeStack}
        options={{ tabBarIcon: ({color,size}) => <Home size={size} color={color}/> }}
      />
      <Tab.Screen name="Arama" component={SearchScreen}
        options={{ tabBarIcon: ({color,size}) => <Search size={size} color={color}/> }}
      />
      <Tab.Screen name="Profil" component={ProfileScreen}
        options={{ tabBarIcon: ({color,size}) => <User size={size} color={color}/> }}
      />
    </Tab.Navigator>
  );
};

export default MemberTabNavigator;
