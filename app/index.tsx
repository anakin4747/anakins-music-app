import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { MainMenu } from '@/components/MainMenu';
import { compactServerConfigs } from '@/stores/serverConfigs';

export default function HomeScreen() {
  useFocusEffect(compactServerConfigs);

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
