import { createDrawerNavigator } from '@react-navigation/drawer';

import { BookmarksScreen } from '@/screens/bookmarks/BookmarksScreen';
import { NotificationsScreen } from '@/screens/notifications/NotificationsScreen';
import { OffersScreen } from '@/screens/offers/OffersScreen';
import { SearchScreen } from '@/screens/search/SearchScreen';
import { colors } from '@/theme';
import type { DrawerParamList } from '@/types/navigation';

import { BottomTabNavigator } from './BottomTabNavigator';

const Drawer = createDrawerNavigator<DrawerParamList>();

export function AppDrawerNavigator() {
  return (
    <Drawer.Navigator
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
    </Drawer.Navigator>
  );
}
