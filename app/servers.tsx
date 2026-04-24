import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeBackView } from '@/components/SwipeBackView';
import { ping, PingResult } from '@/services/navidrome';
import { toOrdinal } from '@/utils/ordinal';
import { getServerConfig, setServerConfig } from '@/stores/serverConfigs';

const LOG_MESSAGES: Record<PingResult, string> = {
  'ok': 'ping ok',
  'wrong-credentials': 'wrong credentials',
  'invalid-url': 'invalid url',
  'server-not-found': 'server not found',
  'unreachable': 'unreachable',
  'timed-out': 'timed out',
};

export default function ServersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const index = Number(params.index ?? 1);
  const stored = getServerConfig(index);
  const [url, setUrl] = useState(stored.url);
  const [usr, setUsr] = useState(stored.usr);
  const [passwd, setPasswd] = useState(stored.passwd);
  const [log, setLog] = useState<string[]>([]);

  function handleUrlChange(text: string) {
    setServerConfig(index, { url: text });
    setUrl(text);
  }

  function handleUsrChange(text: string) {
    setServerConfig(index, { usr: text });
    setUsr(text);
  }

  function handlePasswdChange(text: string) {
    setServerConfig(index, { passwd: text });
    setPasswd(text);
  }

  async function handlePing() {
    if (!url) { setLog(['url required']); return; }
    if (!usr) { setLog(['usr required']); return; }
    if (!passwd) { setLog(['passwd required']); return; }

    setLog((prev) => [...prev, 'ping sent']);
    const result = await ping(url, usr, passwd);
    setLog((prev) => [...prev, LOG_MESSAGES[result]]);
  }

  return (
    <SwipeBackView
      onSwipeRight={() => router.back()}
      onSwipeLeft={() => router.push({ pathname: '/servers', params: { index: index + 1 } })}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          testID="server-scroll-view"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.inner}
        >
          <Text testID="server-heading" style={styles.heading}>
            {toOrdinal(index)} server
          </Text>

          <View style={styles.field}>
            <Text testID="server-url-label" style={styles.label}>url</Text>
            <TextInput
              testID="server-url-input"
              style={styles.input}
              autoCapitalize="none"
              keyboardType="url"
              placeholderTextColor="#555555"
              value={url}
              onChangeText={handleUrlChange}
            />
          </View>

          <View style={styles.field}>
            <Text testID="server-usr-label" style={styles.label}>usr</Text>
            <TextInput
              testID="server-usr-input"
              style={styles.input}
              autoCapitalize="none"
              placeholderTextColor="#555555"
              value={usr}
              onChangeText={handleUsrChange}
            />
          </View>

          <View style={styles.field}>
            <Text testID="server-passwd-label" style={styles.label}>passwd</Text>
            <TextInput
              testID="server-passwd-input"
              style={styles.input}
              secureTextEntry
              placeholderTextColor="#555555"
              value={passwd}
              onChangeText={handlePasswdChange}
            />
          </View>

          <Pressable testID="server-ping-button" style={styles.field} onPress={handlePing}>
            <Text style={styles.label}>ping</Text>
          </Pressable>

          {log.length > 0 && (
            <View testID="server-log" style={styles.field}>
              {log.map((line, i) => (
                <Text key={i} testID="server-log-line" style={styles.label}>{line}</Text>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </SwipeBackView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  inner: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  heading: {
    fontSize: 24,
    fontFamily: 'JetBrainsMono_400Regular',
    color: '#ffffff',
    letterSpacing: 1,
  },
  field: {
    marginTop: 24,
  },
  label: {
    fontSize: 24,
    fontFamily: 'JetBrainsMono_400Regular',
    color: '#ffffff',
    letterSpacing: 1,
  },
  input: {
    marginTop: 8,
    width: '100%',
    fontSize: 24,
    fontFamily: 'JetBrainsMono_400Regular',
    color: '#ffffff',
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff',
    paddingVertical: 4,
  },
});
