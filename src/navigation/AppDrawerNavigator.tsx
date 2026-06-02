import { DrawerContentScrollView, DrawerItemList, createDrawerNavigator } from '@react-navigation/drawer';
import { StyleSheet, Text, View } from 'react-native';

import { LogoBadge } from '@/components/common/LogoBadge';
import { BookmarksScreen } from '@/screens/bookmarks/BookmarksScreen';
import { NotificationsScreen } from '@/screens/notifications/NotificationsScreen';
import { OffersScreen } from '@/screens/offers/OffersScreen';
import { RestaurantDetailsScreen } from '@/screens/restaurant/RestaurantDetailsScreen';
import { SearchScreen } from '@/screens/search/SearchScreen';
import { colors, typography } from '@/theme';
import type { DrawerParamList } from '@/types/navigation';

import { BottomTabNavigator } from './BottomTabNavigator';

const Drawer = createDrawerNavigator<DrawerParamList>();

export function AppDrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
          <View style={styles.drawerBrand}>
            <LogoBadge size={112} />
            <Text style={styles.drawerTitle}>FAATTSOO</Text>
          </View>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      )}
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: colors.background },
        drawerActiveTintColor: colors.primaryDark,
        drawerInactiveTintColor: colors.textSecondary,
      }}
    >
      <Drawer.Screen name="Tabs" component={BottomTabNavigator} options={{ title: 'FAATTSOO' }} />
      <Drawer.Screen name="Search" component={SearchScreen} />
      <Drawer.Screen name="Offers" component={OffersScreen} />
      <Drawer.Screen name="Bookmarks" component={BookmarksScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      <Drawer.Screen
        name="RestaurantDetails"
        component={RestaurantDetailsScreen}
        options={{ drawerItemStyle: { display: 'none' } }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    paddingTop: 18,
  },
  drawerBrand: {
    alignItems: 'center',
    gap: 8,
    paddingBottom: 18,
  },
  drawerTitle: {
    ...typography.h2,
    color: colors.primaryDark,
    letterSpacing: 1,
  },
});
