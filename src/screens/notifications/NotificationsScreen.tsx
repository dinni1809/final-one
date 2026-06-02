import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { IconButton } from '@/components/common/IconButton';
import { Screen } from '@/components/common/Screen';
import { useNotificationStore } from '@/store/notificationStore';
import { colors, radius, shadows, typography } from '@/theme';

export function NotificationsScreen() {
  const navigation = useNavigation();
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const markAllRead = useNotificationStore((state) => state.markAllRead);

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton name="chevron-left" onPress={() => navigation.goBack()} />
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.spacer} />
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>New tables are trending</Text>
        <Text style={styles.copy}>The Olive Bistro and Persian Darbar are among this week’s most loved dining experiences.</Text>
        <TouchableOpacity style={styles.button} onPress={markAllRead}>
          <Text style={styles.buttonText}>{unreadCount ? 'Mark all as read' : 'All caught up'}</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  title: { ...typography.h2, color: colors.primaryDark },
  spacer: { width: 44 },
  card: { backgroundColor: colors.beigeSoft, borderRadius: radius.lg, gap: 10, margin: 18, padding: 18, ...shadows.soft },
  cardTitle: { color: colors.primaryDark, fontSize: 18, fontWeight: '800' },
  copy: { color: colors.textSecondary, fontSize: 15, lineHeight: 22 },
  button: { alignItems: 'center', backgroundColor: colors.primary, borderRadius: radius.md, minHeight: 46, justifyContent: 'center' },
  buttonText: { color: colors.white, fontWeight: '800' },
});
