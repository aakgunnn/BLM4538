import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import BookDetailsScreen from '../screens/BookDetailsScreen';
import Colors from '../constants/Colors';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.primary,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="BookDetails" component={BookDetailsScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
