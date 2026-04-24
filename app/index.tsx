import { StyleSheet, Text, View } from 'react-native';
import { HelloMessage } from '@/components/HelloMessage';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <HelloMessage name="anakin" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    padding: 24,
  },
});
