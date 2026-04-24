import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeBackView } from '@/components/SwipeBackView';
import { getPlaylist, PlaylistItem, SongItem, FetchError } from '@/services/navidrome';
import { getLastPingedServerConfig } from '@/stores/serverConfigs';

type State =
  | { phase: 'no-server' }
  | { phase: 'loading' }
  | { phase: 'error'; error: FetchError }
  | { phase: 'done'; playlist: PlaylistItem; songs: SongItem[] };

export default function PlaylistDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [state, setState] = useState<State>(() => {
    const cfg = getLastPingedServerConfig();
    return cfg ? { phase: 'loading' } : { phase: 'no-server' };
  });

  useEffect(() => {
    const cfg = getLastPingedServerConfig();
    if (!cfg) return;
    getPlaylist(cfg.url, cfg.usr, cfg.passwd, id).then((result) => {
      if (result.ok) {
        setState({ phase: 'done', playlist: result.playlist, songs: result.songs });
      } else {
        setState({ phase: 'error', error: result.error });
      }
    });
  }, [id]);

  return (
    <SwipeBackView onSwipeRight={() => router.back()}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.inner}>
          {state.phase === 'no-server' && (
            <Text testID="playlist-detail-error" style={styles.heading}>no server configured</Text>
          )}

          {state.phase === 'loading' && (
            <Text testID="playlist-detail-loading" style={styles.heading}>loading…</Text>
          )}

          {state.phase === 'error' && (
            <Text testID="playlist-detail-error" style={styles.heading}>{state.error}</Text>
          )}

          {state.phase === 'done' && (
            <>
              <Text testID="playlist-detail-name" style={styles.heading}>{state.playlist.name}</Text>
              {state.songs.map((song) => (
                <View key={song.id} testID="song-row" style={styles.row}>
                  <Text style={styles.rowText}>{song.title}</Text>
                  <Text style={styles.artist}>{song.artist}</Text>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </SwipeBackView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  inner: { flexGrow: 1, paddingHorizontal: 24 },
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
  artist: {
    fontSize: 18,
    fontFamily: 'JetBrainsMono_400Regular',
    color: '#aaaaaa',
    letterSpacing: 1,
  },
});
