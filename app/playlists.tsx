import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeBackView } from '@/components/SwipeBackView';
import { SwipeOpenView } from '@/components/SwipeOpenView';
import { getPlaylists, PlaylistItem, FetchError } from '@/services/navidrome';
import { getLastPingedServerConfig } from '@/stores/serverConfigs';

type State =
  | { phase: 'no-server' }
  | { phase: 'loading' }
  | { phase: 'error'; error: FetchError }
  | { phase: 'done'; playlists: PlaylistItem[] };

export default function PlaylistsScreen() {
  const router = useRouter();
  const [state, setState] = useState<State>(() => {
    const cfg = getLastPingedServerConfig();
    return cfg ? { phase: 'loading' } : { phase: 'no-server' };
  });

  useEffect(() => {
    const cfg = getLastPingedServerConfig();
    if (!cfg) return;
    getPlaylists(cfg.url, cfg.usr, cfg.passwd).then((result) => {
      if (result.ok) {
        setState({ phase: 'done', playlists: result.playlists });
      } else {
        setState({ phase: 'error', error: result.error });
      }
    });
  }, []);

  return (
    <SwipeBackView onSwipeRight={() => router.back()}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.inner}>
          <Text testID="playlists-heading" style={styles.heading}>playlists</Text>

          {state.phase === 'no-server' && (
            <Text testID="playlists-error" style={styles.message}>no server configured</Text>
          )}

          {state.phase === 'loading' && (
            <Text testID="playlists-loading" style={styles.message}>loading…</Text>
          )}

          {state.phase === 'error' && (
            <Text testID="playlists-error" style={styles.message}>{state.error}</Text>
          )}

          {state.phase === 'done' && state.playlists.length === 0 && (
            <Text testID="playlists-empty" style={styles.message}>no playlists</Text>
          )}

          {state.phase === 'done' && state.playlists.map((playlist) => (
            <SwipeOpenView key={playlist.id} style={styles.row} onSwipeLeft={() => router.push(`/playlist/${playlist.id}`)}>
              <Pressable testID="playlist-row" onPress={() => router.push(`/playlist/${playlist.id}`)}>
                <Text style={styles.rowText}>{playlist.name}</Text>
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
