import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADIUS, SHADOWS } from '../utils/theme';

import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import WishlistScreen from '../screens/WishlistScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import VirtualTryOnScreen from '../screens/VirtualTryOnScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import Category from '../screens/CategoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const TAB_ICONS = {
  Home: { active: '🏠', inactive: '🏠' },
  Categories: { active: '⊞', inactive: '⊞' },
  Discover: { active: '🔍', inactive: '🔍' },
  Wishlist: { active: '❤️', inactive: '🤍' },
};

function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.bar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const icon = TAB_ICONS[route.name];

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={tabStyles.tabItem}
              onPress={onPress}
              activeOpacity={0.7}
            >
              {isFocused ? (
                <LinearGradient
                  colors={['#EFF6FF', '#DBEAFE']}
                  style={tabStyles.activeTab}
                >
                  <Text style={tabStyles.activeIcon}>
                    {route.name === 'Home' ? '🏠' :
                     route.name === 'Categories' ? '⊞' :
                     route.name === 'Discover' ? '🔍' : '❤️'}
                  </Text>
                  <Text style={tabStyles.activeLabel}>{route.name}</Text>
                </LinearGradient>
              ) : (
                <View style={tabStyles.inactiveTab}>
                  <Text style={tabStyles.inactiveIcon}>
                    {route.name === 'Home' ? '🏠' :
                     route.name === 'Categories' ? '⊞' :
                     route.name === 'Discover' ? '🔍' : '🤍'}
                  </Text>
                  <Text style={tabStyles.inactiveLabel}>{route.name}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFF',
    borderTopWidth: 1, borderTopColor: '#E2E8F0',
    paddingBottom: 8, paddingTop: 4,
    ...SHADOWS.lg,
  },
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  tabItem: { flex: 1, alignItems: 'center' },
  activeTab: {
    alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16,
    borderRadius: RADIUS.xl, minWidth: 70,
  },
  inactiveTab: { alignItems: 'center', paddingVertical: 8 },
  activeIcon: { fontSize: 20, marginBottom: 2 },
  inactiveIcon: { fontSize: 20, marginBottom: 2 },
  activeLabel: { fontSize: 10, fontWeight: '700', color: COLORS.primary },
  inactiveLabel: { fontSize: 10, fontWeight: '500', color: COLORS.textLight },
});

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="VirtualTryOn"
          component={VirtualTryOnScreen}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="Checkout"
          component={CheckoutScreen}
          options={{ presentation: 'card' }}
        />
        <Stack.Screen
          name="Category"
          component={Category}
          options={{ presentation: 'card' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
