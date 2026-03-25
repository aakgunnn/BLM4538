import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Colors from '../constants/Colors';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        headerShown: false,
        tabBarStyle: { height: 60, paddingBottom: 10 },
      }}
    >
      <Tab.Screen 
        name="Anasayfa" 
        component={HomeStack} 
      />
      <Tab.Screen 
        name="Arama" 
        component={SearchScreen} 
      />
      <Tab.Screen 
        name="Profil" 
        component={ProfileScreen} 
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
