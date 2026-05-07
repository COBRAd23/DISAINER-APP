import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../constants/theme';
import { Home, ShoppingCart, Star, Camera } from 'lucide-react-native';
import { useCart } from '../hooks/useCart';
import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import CatalogScreenNew from '../screens/CatalogScreen';
import BriefScreen from '../screens/BriefScreen';
import CartScreen from '../screens/CartScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { items } = useCart();
  const { COLORS: THEME_COLORS, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: THEME_COLORS.background,
          borderTopWidth: 1,
          borderTopColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)',
          paddingTop: 8,
          height: 84,
          paddingBottom: 24,
        },
        tabBarActiveTintColor: THEME_COLORS.primaryContainer,
        tabBarInactiveTintColor: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'SpaceGrotesk_500Medium',
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <Home color={color} size={size} />;
          if (route.name === 'Catalog') return <Star color={color} size={size} />;
          if (route.name === 'Brief') return <Camera color={color} size={size} />;
          if (route.name === 'Cart') return <ShoppingCart color={color} size={size} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Catalog" component={CatalogScreenNew} options={{ tabBarLabel: 'Catálogo' }} />
      <Tab.Screen name="Brief" component={BriefScreen} options={{ tabBarLabel: 'Brief' }} />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ 
          tabBarLabel: 'Carrito',
          tabBarBadge: items.length > 0 ? items.length : undefined,
          tabBarBadgeStyle: { backgroundColor: THEME_COLORS.primaryContainer, color: '#000' }
        }} 
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
