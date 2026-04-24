import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeBackView } from '@/components/SwipeBackView';
import { getAlbum, AlbumItem, SongItem, FetchError } from '@/services/navidrome';
import { getLastPingedServerConfig } from '@/stores/serverConfigs';

type State =
  | { phase: 'no-server' }
  | { phase: 'loading' }
  | { phase: 'error'; error: FetchError }
  | { phase: 'done'; album: AlbumItem; songs: SongItem[] };

export default function AlbumDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [state, setState] = useState<State>(() => {
    const cfg = getLastPingedServerConfig();
    return cfg ? { phase: 'loading' } : { phase: 'no-server' };
  });

  useEffect(() => {
    const cfg = getLastPingedServerConfig();
    if (!cfg) return;
    getAlbum(cfg.url, cfg.usr, cfg.passwd, id).then((result) => {
      if (result.ok) {
        setState({ phase: 'done', album: result.album, songs: result.songs });
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
            <Text testID="album-detail-error" style={styles.heading}>no server configured</Text>
          )}

          {state.phase === 'loading' && (
            <Text testID="album-detail-loading" style={styles.heading}>loading…</Text>
          )}

          {state.phase === 'error' && (
            <Text testID="album-detail-error" style={styles.heading}>{state.error}</Text>
          )}

          {state.phase === 'done' && (
            <>
              <Text testID="album-detail-name" style={styles.heading}>{state.album.name}</Text>
              <Text testID="album-detail-artist" style={styles.subheading}>{state.album.artist}</Text>
              {state.songs.map((song) => (
                <View key={song.id} testID="song-row" style={styles.row}>
                  <Text style={styles.rowText}>{song.track}. {song.title}</Text>
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
  subheading: {
    fontSize: 18,
    fontFamily: 'JetBrainsMono_400Regular',
    color: '#aaaaaa',
    letterSpacing: 1,
    marginTop: 4,
  },
  row: { marginTop: 24 },
  rowText: {
    fontSize: 24,
    fontFamily: 'JetBrainsMono_400Regular',
    color: '#ffffff',
    letterSpacing: 1,
  },
});
