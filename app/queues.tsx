import { StyleSheet, Text, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeBackView } from '@/components/SwipeBackView';
import { toOrdinal } from '@/utils/ordinal';
import { getSongsInQueue } from '@/stores/queues';

export default function QueuesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const index = Number(params.index ?? 1);
  const songs = getSongsInQueue(index);

  return (
    <SwipeBackView
      onSwipeRight={() => router.back()}
      onSwipeLeft={() => router.push({ pathname: '/queues', params: { index: index + 1 } })}
    >
      <SafeAreaView style={styles.safeArea}>
        <Text testID="queue-heading" style={styles.heading}>
          {toOrdinal(index)} queue
        </Text>
        {songs.map((song) => (
          <View key={song.id} testID={`queue-song-${song.id}`} style={styles.row}>
            <Text style={styles.rowText}>{song.track}. {song.title}</Text>
          </View>
        ))}
      </SafeAreaView>
    </SwipeBackView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
  },
  heading: {
    fontSize: 24,
    fontFamily: 'JetBrainsMono_400Regular',
    color: '#ffffff',
    letterSpacing: 1,
  },
  row: { marginTop: 24 },
  rowText: {
    fontSize: 24,
    fontFamily: 'JetBrainsMono_400Regular',
    color: '#ffffff',
    letterSpacing: 1,
  },
});
