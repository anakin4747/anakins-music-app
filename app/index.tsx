import { StyleSheet, View } from 'react-native';
import { MainMenu } from '@/components/MainMenu';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <MainMenu />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
