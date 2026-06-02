import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DiscoverScreen } from '@/screens/discover/DiscoverScreen';
import { RestaurantListScreen } from '@/screens/discover/RestaurantListScreen';
import { RestaurantDetailsScreen } from '@/screens/restaurant/RestaurantDetailsScreen';
import { SearchScreen } from '@/screens/search/SearchScreen';
import type { DiscoverStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<DiscoverStackParamList>();

export function DiscoverStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DiscoverMain" component={DiscoverScreen} />
      <Stack.Screen name="RestaurantList" component={RestaurantListScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} />
    </Stack.Navigator>
  );
}
