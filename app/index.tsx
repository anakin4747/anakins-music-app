import { StyleSheet, Text, View } from 'react-native';
import { HelloMessage } from '@/components/HelloMessage';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <HelloMessage name="Anakin" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
    padding: 24,
  },
});
