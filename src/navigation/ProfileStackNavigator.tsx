import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BookmarksScreen } from '@/screens/bookmarks/BookmarksScreen';
import { NotificationsScreen } from '@/screens/notifications/NotificationsScreen';
import { ProfileScreen } from '@/screens/profile/ProfileScreen';
import type { ProfileStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}
