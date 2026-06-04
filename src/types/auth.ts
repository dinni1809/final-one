export type User = {
  id: string;
  name: string;
  username?: string;
  email: string;
  avatar?: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
