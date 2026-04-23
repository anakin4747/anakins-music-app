import { StyleSheet, Text, View } from 'react-native';

interface HelloMessageProps {
  name: string;
}

export function HelloMessage({ name }: HelloMessageProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title} testID="hello-title">
        Hello, {name}!
      </Text>
      <Text style={styles.subtitle} testID="hello-subtitle">
        Your music player is warming up...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
  },
});
