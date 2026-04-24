import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text, PanResponder } from 'react-native';
import { SwipeOpenView } from '../SwipeOpenView';

type PanResponderConfig = Parameters<typeof PanResponder.create>[0];
let capturedConfig: PanResponderConfig = {};

beforeEach(() => {
  jest.spyOn(PanResponder, 'create').mockImplementation((config) => {
    capturedConfig = config;
    return { panHandlers: {} };
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('SwipeOpenView', () => {
  it('renders children', () => {
    render(
      <SwipeOpenView onSwipeLeft={jest.fn()}>
        <Text testID="child">hello</Text>
      </SwipeOpenView>
    );
    expect(screen.getByTestId('child')).toHaveTextContent('hello');
  });

  it('calls onSwipeLeft when swiped left past threshold', () => {
    const onSwipeLeft = jest.fn();
    render(
      <SwipeOpenView onSwipeLeft={onSwipeLeft}>
        <Text>content</Text>
      </SwipeOpenView>
    );
    capturedConfig.onPanResponderRelease?.({} as any, { dx: -80 } as any);
    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
  });

  it('does not call onSwipeLeft when swipe is too short', () => {
    const onSwipeLeft = jest.fn();
    render(
      <SwipeOpenView onSwipeLeft={onSwipeLeft}>
        <Text>content</Text>
      </SwipeOpenView>
    );
    capturedConfig.onPanResponderRelease?.({} as any, { dx: -20 } as any);
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('does not call onSwipeLeft when swiped right', () => {
    const onSwipeLeft = jest.fn();
    render(
      <SwipeOpenView onSwipeLeft={onSwipeLeft}>
        <Text>content</Text>
      </SwipeOpenView>
    );
    capturedConfig.onPanResponderRelease?.({} as any, { dx: 80 } as any);
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('only claims gesture when moving leftward and horizontal dominates', () => {
    render(
      <SwipeOpenView onSwipeLeft={jest.fn()}>
        <Text>content</Text>
      </SwipeOpenView>
    );
    expect(capturedConfig.onMoveShouldSetPanResponder?.({} as any, { dx: -20, dy: -5 } as any)).toBe(true);
    expect(capturedConfig.onMoveShouldSetPanResponder?.({} as any, { dx: 20, dy: 5 } as any)).toBe(false);
    expect(capturedConfig.onMoveShouldSetPanResponder?.({} as any, { dx: -5, dy: -20 } as any)).toBe(false);
  });
});
