import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeBackView } from '@/components/SwipeBackView';
import { SwipeOpenView } from '@/components/SwipeOpenView';
import { getAlbums, AlbumItem, FetchError } from '@/services/navidrome';
import { getLastPingedServerConfig } from '@/stores/serverConfigs';

type State =
  | { phase: 'no-server' }
  | { phase: 'loading' }
  | { phase: 'error'; error: FetchError }
  | { phase: 'done'; albums: AlbumItem[] };

export default function AlbumsScreen() {
  const router = useRouter();
  const [state, setState] = useState<State>(() => {
    const cfg = getLastPingedServerConfig();
    return cfg ? { phase: 'loading' } : { phase: 'no-server' };
  });

  useEffect(() => {
    const cfg = getLastPingedServerConfig();
    if (!cfg) return;
    getAlbums(cfg.url, cfg.usr, cfg.passwd).then((result) => {
      if (result.ok) {
        setState({ phase: 'done', albums: result.albums });
      } else {
        setState({ phase: 'error', error: result.error });
      }
    });
  }, []);

  return (
    <SwipeBackView onSwipeRight={() => router.back()}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.inner}>
          <Text testID="albums-heading" style={styles.heading}>albums</Text>

          {state.phase === 'no-server' && (
            <Text testID="albums-no-server" style={styles.message}>no server configured</Text>
          )}

          {state.phase === 'loading' && (
            <Text testID="albums-loading" style={styles.message}>loading…</Text>
          )}

          {state.phase === 'error' && (
            <Text testID="albums-fetch-error" style={styles.message}>{state.error}</Text>
          )}

          {state.phase === 'done' && state.albums.length === 0 && (
            <Text testID="albums-empty" style={styles.message}>no albums</Text>
          )}

          {state.phase === 'done' && state.albums.map((album) => (
            <SwipeOpenView key={album.id} style={styles.row} onSwipeLeft={() => router.push(`/album/${album.id}`)}>
              <Pressable testID="album-row" onPress={() => router.push(`/album/${album.id}`)}>
                <Text style={styles.rowText}>{album.name}</Text>
                <Text style={styles.rowText}>{album.artist}</Text>
              </Pressable>
            </SwipeOpenView>
          ))}
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
  message: {
    marginTop: 24,
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
