import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TrendingScreen } from '@/screens/trending/TrendingScreen';
import { RestaurantDetailsScreen } from '@/screens/restaurant/RestaurantDetailsScreen';
import type { TrendingStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<TrendingStackParamList>();

export function TrendingStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TrendingMain" component={TrendingScreen} />
      <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} />
    </Stack.Navigator>
  );
}
