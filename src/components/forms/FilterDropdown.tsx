import { Feather } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, shadows } from '@/theme';

type Props = {
  label: string;
  value?: string;
  placeholder: string;
  options: string[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelect: (value?: string) => void;
};

export function FilterDropdown({ label, value, placeholder, options, open, onOpen, onClose, onSelect }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity activeOpacity={0.78} onPress={onOpen} style={styles.control}>
        <Text style={[styles.value, !value && styles.placeholder]} numberOfLines={1}>
          {value ?? placeholder}
        </Text>
        <Feather name="chevron-down" size={19} color={colors.primaryDark} />
      </TouchableOpacity>
      <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <View style={styles.menu}>
            <TouchableOpacity style={styles.option} onPress={() => onSelect(undefined)}>
              <Text style={styles.optionText}>All {label.toLowerCase()}</Text>
            </TouchableOpacity>
            {options.map((item) => (
              <TouchableOpacity key={item} style={styles.option} onPress={() => onSelect(item)}>
                <Text style={[styles.optionText, item === value && styles.selected]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 7,
    marginBottom: 14,
    width: '48%',
  },
  label: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  control: {
    alignItems: 'center',
    backgroundColor: colors.beigeSoft,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 48,
    paddingHorizontal: 12,
    ...shadows.soft,
  },
  value: {
    color: colors.primaryDark,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
  },
  placeholder: {
    color: colors.textSecondary,
    fontWeight: '700',
  },
  backdrop: {
    backgroundColor: 'rgba(43, 29, 18, 0.28)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  menu: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    maxHeight: 420,
    overflow: 'hidden',
    ...shadows.card,
  },
  option: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    minHeight: 50,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  optionText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  selected: {
    color: colors.primaryDark,
    fontWeight: '900',
  },
});
