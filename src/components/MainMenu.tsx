import { PanResponder, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useRef } from 'react';
import { useRouter } from 'expo-router';

type Route = '/queues' | '/playlists' | '/albums' | '/servers';

const ITEMS: { label: string; route: Route; enabled: boolean }[] = [
  { label: 'queues', route: '/queues', enabled: true },
  { label: 'playlists', route: '/playlists', enabled: false },
  { label: 'albums', route: '/albums', enabled: false },
  { label: 'servers', route: '/servers', enabled: true },
];

const SWIPE_THRESHOLD = 50;

interface MenuItemProps {
  label: string;
  halfGap: number;
  onNavigate?: () => void;
}

function MenuItem({ label, halfGap, onNavigate }: MenuItemProps) {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_evt, gestureState) => {
        if (gestureState.dx < -SWIPE_THRESHOLD) {
          onNavigate?.();
        }
      },
    })
  ).current;

  return (
    <View {...panResponder.panHandlers}>
      <Pressable
        testID={`menu-item-${label}`}
        onPress={onNavigate}
        style={styles.pressable}
        hitSlop={{ top: halfGap, bottom: halfGap }}
      >
        <Text style={styles.item}>{label}</Text>
      </Pressable>
    </View>
  );
}

export function MainMenu() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const halfGap = height / 10;

  return (
    <View style={styles.container}>
      {ITEMS.map(({ label, route, enabled }) => (
        <MenuItem
          key={label}
          label={label}
          halfGap={halfGap}
          onNavigate={enabled ? () => router.push(route) : undefined}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    paddingHorizontal: 24,
  },
  item: {
    fontSize: 24,
    fontFamily: 'JetBrainsMono_400Regular',
    color: '#ffffff',
    letterSpacing: 1,
  },
  pressable: {},
});
