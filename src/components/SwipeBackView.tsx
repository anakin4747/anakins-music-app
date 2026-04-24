import { PanResponder, StyleSheet, View } from 'react-native';
import { ReactNode, useRef } from 'react';

const SWIPE_THRESHOLD = 50;

interface SwipeBackViewProps {
  onSwipeRight: () => void;
  children: ReactNode;
}

export function SwipeBackView({ onSwipeRight, children }: SwipeBackViewProps) {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_evt, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          onSwipeRight();
        }
      },
    })
  ).current;

  return (
    <View
      style={styles.container}
      testID="swipe-back-view"
      {...panResponder.panHandlers}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
