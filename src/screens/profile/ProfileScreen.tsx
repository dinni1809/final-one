import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { LogoBadge } from '@/components/common/LogoBadge';
import { Screen } from '@/components/common/Screen';
import { useAuthStore } from '@/store/authStore';
import { colors, radius, shadows, typography } from '@/theme';

export function ProfileScreen() {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <Screen>
      <View style={styles.content}>
        <LogoBadge size={112} />
        <Text style={styles.title}>{user?.name ?? 'FAATTSOO Guest'}</Text>
        <Text style={styles.email}>{user?.email ?? 'guest@faattsoo.local'}</Text>
        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Bookmarks' as never)}>
          <Text style={styles.rowText}>Saved Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Notifications' as never)}>
          <Text style={styles.rowText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logout} onPress={() => void logout()}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { alignItems: 'center', flex: 1, gap: 14, padding: 24, paddingTop: 58 },
  title: { ...typography.h1, color: colors.primaryDark, textAlign: 'center' },
  email: { color: colors.textSecondary, marginBottom: 16 },
  row: {
    backgroundColor: colors.beigeSoft,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 18,
    width: '100%',
    ...shadows.soft,
  },
  rowText: { color: colors.primaryDark, fontSize: 16, fontWeight: '800' },
  logout: { backgroundColor: colors.primaryDark, borderRadius: radius.md, justifyContent: 'center', minHeight: 54, paddingHorizontal: 18, width: '100%' },
  logoutText: { color: colors.white, fontSize: 16, fontWeight: '800', textAlign: 'center' },
});
