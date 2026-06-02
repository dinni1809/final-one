import { Feather } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View } from 'react-native';

import { colors, radius, shadows } from '@/theme';
import type { TabParamList } from '@/types/navigation';

import { DiscoverStackNavigator } from './DiscoverStackNavigator';
import { HomeStackNavigator } from './HomeStackNavigator';
import { ProfileStackNavigator } from './ProfileStackNavigator';
import { TrendingStackNavigator } from './TrendingStackNavigator';

const Tab = createBottomTabNavigator<TabParamList>();

const iconMap = {
  Home: 'home',
  Discover: 'search',
  Trending: 'star',
  Profile: 'user',
} as const;

export function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => (
          <View style={[styles.item, focused && styles.activeItem]}>
            <Feather name={iconMap[route.name]} size={25} color={focused ? colors.white : colors.primaryDark} />
            <Text style={[styles.label, focused && styles.activeLabel]}>{route.name}</Text>
          </View>
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Discover" component={DiscoverStackNavigator} />
      <Tab.Screen name="Trending" component={TrendingStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.beigeSoft,
    borderTopWidth: 0,
    borderRadius: radius.xl,
    bottom: 12,
    height: 78,
    left: 16,
    paddingBottom: 8,
    paddingTop: 8,
    position: 'absolute',
    right: 16,
    ...shadows.soft,
  },
  item: {
    alignItems: 'center',
    borderRadius: radius.lg,
    gap: 2,
    height: 58,
    justifyContent: 'center',
    minWidth: 70,
  },
  activeItem: {
    backgroundColor: colors.primary,
  },
  label: {
    color: colors.primaryDark,
    fontSize: 11,
  },
  activeLabel: {
    color: colors.white,
  },
});
