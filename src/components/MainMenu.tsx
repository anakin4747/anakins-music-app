import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';

type Route = '/queues' | '/playlists' | '/albums' | '/servers';

const ITEMS: { label: string; route: Route; enabled: boolean }[] = [
  { label: 'queues', route: '/queues', enabled: true },
  { label: 'playlists', route: '/playlists', enabled: false },
  { label: 'albums', route: '/albums', enabled: false },
  { label: 'servers', route: '/servers', enabled: false },
];

export function MainMenu() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const halfGap = height / 10;

  return (
    <View style={styles.container}>
      {ITEMS.map(({ label, route, enabled }) => (
        <Pressable
          key={label}
          testID={`menu-item-${label}`}
          onPress={enabled ? () => router.push(route) : undefined}
          style={styles.pressable}
          hitSlop={{ top: halfGap, bottom: halfGap }}
        >
          <Text style={styles.item}>{label}</Text>
        </Pressable>
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
