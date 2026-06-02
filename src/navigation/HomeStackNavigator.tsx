import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '@/screens/home/HomeScreen';
import { OffersScreen } from '@/screens/offers/OffersScreen';
import { RestaurantDetailsScreen } from '@/screens/restaurant/RestaurantDetailsScreen';
import type { HomeStackParamList } from '@/types/navigation';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} />
      <Stack.Screen name="Offers" component={OffersScreen} />
    </Stack.Navigator>
  );
}
