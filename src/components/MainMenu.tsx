import { StyleSheet, Text, View } from 'react-native';

const ITEMS = ['queues', 'playlists', 'albums'] as const;

export function MainMenu() {
  return (
    <View style={styles.container}>
      {ITEMS.map((item) => (
        <Text key={item} testID={`menu-item-${item}`} style={styles.item}>
          {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
  },
  item: {
    fontSize: 24,
    fontFamily: 'JetBrainsMono_400Regular',
    color: '#ffffff',
    letterSpacing: 1,
  },
});
