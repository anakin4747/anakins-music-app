import { StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SwipeBackView } from '@/components/SwipeBackView';

export default function QueuesScreen() {
  const router = useRouter();

  return (
    <SwipeBackView onSwipeRight={() => router.back()}>
      <Text style={styles.heading}>queues</Text>
    </SwipeBackView>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontFamily: 'JetBrainsMono_400Regular',
    color: '#ffffff',
    letterSpacing: 1,
    paddingHorizontal: 24,
  },
});
