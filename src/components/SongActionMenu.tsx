import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SongItem } from '@/services/navidrome';
import { addSongToQueue } from '@/stores/queues';
import { toOrdinal } from '@/utils/ordinal';

const MAX_QUEUES = 3;

interface SongActionMenuProps {
  song: SongItem;
  onClose: () => void;
  populatedQueueCount: number;
}

export function SongActionMenu({ song, onClose, populatedQueueCount }: SongActionMenuProps) {
  const buttonCount = Math.min(populatedQueueCount + 1, MAX_QUEUES);

  function handleAddToQueue(queueIndex: number) {
    addSongToQueue(queueIndex, song);
    onClose();
  }

  return (
    <View testID="song-action-menu" style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <View style={styles.menu}>
        {Array.from({ length: buttonCount }, (_, i) => i + 1).map((n) => (
          <TouchableOpacity
            key={n}
            testID={`add-to-queue-${n}`}
            style={styles.button}
            onPress={() => handleAddToQueue(n)}
          >
            <Text style={styles.buttonText}>{toOrdinal(n)} queue</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    backgroundColor: '#1a1a1a',
    padding: 24,
    gap: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'JetBrainsMono_400Regular',
    color: '#ffffff',
    letterSpacing: 1,
  },
});
