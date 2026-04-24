import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

type Route = '/queues' | '/playlists' | '/albums';

const ITEMS: { label: string; route: Route }[] = [
  { label: 'queues', route: '/queues' },
  { label: 'playlists', route: '/playlists' },
  { label: 'albums', route: '/albums' },
];

export function MainMenu() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {ITEMS.map(({ label, route }) => (
        <Pressable
            key={label}
            testID={`menu-item-${label}`}
            onPress={() => router.push(route)}
            style={styles.pressable}
            hitSlop={{ top: 200, bottom: 200 }}
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
  pressable: {
    paddingVertical: 16,
    paddingRight: 32,
  },
});
