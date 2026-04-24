import { PanResponder, StyleSheet, View } from 'react-native';
import { ReactNode, useRef } from 'react';

const SWIPE_THRESHOLD = 50;

interface SwipeOpenViewProps {
  onSwipeLeft: () => void;
  children: ReactNode;
  style?: object;
}

export function SwipeOpenView({ onSwipeLeft, children, style }: SwipeOpenViewProps) {
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_evt, { dx, dy }) => dx < -10 && Math.abs(dx) > Math.abs(dy),
      onPanResponderRelease: (_evt, { dx }) => {
        if (dx < -SWIPE_THRESHOLD) onSwipeLeft();
      },
    })
  ).current;

  return (
    <View style={[styles.container, style]} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
  },
});
