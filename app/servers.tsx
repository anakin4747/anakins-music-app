import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SwipeBackView } from '@/components/SwipeBackView';

export default function ServersScreen() {
  const router = useRouter();

  return (
    <SwipeBackView onSwipeRight={() => router.back()}>
      <SafeAreaView style={styles.safeArea}>
        <Text testID="server-heading" style={styles.heading}>
          first server
        </Text>

        <View style={styles.field}>
          <Text testID="server-url-label" style={styles.label}>url</Text>
          <TextInput
            testID="server-url-input"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="url"
            placeholderTextColor="#555555"
          />
        </View>

        <View style={styles.field}>
          <Text testID="server-usr-label" style={styles.label}>usr</Text>
          <TextInput
            testID="server-usr-input"
            style={styles.input}
            autoCapitalize="none"
            placeholderTextColor="#555555"
          />
        </View>

        <View style={styles.field}>
          <Text testID="server-passwd-label" style={styles.label}>passwd</Text>
          <TextInput
            testID="server-passwd-input"
            style={styles.input}
            secureTextEntry
            placeholderTextColor="#555555"
          />
        </View>
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
