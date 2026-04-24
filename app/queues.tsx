import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeBackView } from '@/components/SwipeBackView';

const ORDINALS = ['first', 'second', 'third', 'fourth', 'fifth'];

export default function QueuesScreen() {
  const router = useRouter();

  return (
    <SwipeBackView onSwipeRight={() => router.back()}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.list}>
          {ORDINALS.map((ordinal, index) => (
            <Text key={ordinal} testID={`queue-item-${index}`} style={styles.item}>
              {ordinal} queue
            </Text>
          ))}
        </View>
      </SafeAreaView>
    </SwipeBackView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  list: {
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
});
