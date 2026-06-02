import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  SignUp: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  RestaurantDetails: { restaurantId: string };
  Offers: undefined;
  OfferDetails: { offerId: string };
};

export type DiscoverStackParamList = {
  DiscoverMain: undefined;
  RestaurantList: undefined;
  Search: undefined;
  RestaurantDetails: { restaurantId: string };
};

export type TrendingStackParamList = {
  TrendingMain: undefined;
  RestaurantDetails: { restaurantId: string };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Bookmarks: undefined;
  Notifications: undefined;
};

export type TabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Discover: NavigatorScreenParams<DiscoverStackParamList>;
  Trending: NavigatorScreenParams<TrendingStackParamList>;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};

export type DrawerParamList = {
  Tabs: NavigatorScreenParams<TabParamList>;
  Bookmarks: undefined;
  Notifications: undefined;
  Search: undefined;
  Offers: undefined;
};
