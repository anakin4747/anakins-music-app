import { StyleSheet, Text, View } from 'react-native';

export default function QueuesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>queues</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontFamily: 'JetBrainsMono_400Regular',
    color: '#ffffff',
    letterSpacing: 1,
  },
});
