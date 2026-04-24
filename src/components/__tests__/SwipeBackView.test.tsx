import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text, PanResponder } from 'react-native';
import { SwipeBackView } from '../SwipeBackView';

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

describe('SwipeBackView', () => {
  it('renders children', () => {
    render(
      <SwipeBackView onSwipeRight={jest.fn()}>
        <Text testID="child">hello</Text>
      </SwipeBackView>
    );
    expect(screen.getByTestId('child')).toHaveTextContent('hello');
  });

  it('calls onSwipeRight when swiped right past threshold', () => {
    const onSwipeRight = jest.fn();
    render(
      <SwipeBackView onSwipeRight={onSwipeRight}>
        <Text>content</Text>
      </SwipeBackView>
    );
    capturedConfig.onPanResponderRelease?.({} as any, { dx: 80 } as any);
    expect(onSwipeRight).toHaveBeenCalledTimes(1);
  });

  it('does not call onSwipeRight when swipe is too short', () => {
    const onSwipeRight = jest.fn();
    render(
      <SwipeBackView onSwipeRight={onSwipeRight}>
        <Text>content</Text>
      </SwipeBackView>
    );
    capturedConfig.onPanResponderRelease?.({} as any, { dx: 20 } as any);
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('does not call onSwipeRight when swiped left', () => {
    const onSwipeRight = jest.fn();
    render(
      <SwipeBackView onSwipeRight={onSwipeRight}>
        <Text>content</Text>
      </SwipeBackView>
    );
    capturedConfig.onPanResponderRelease?.({} as any, { dx: -80 } as any);
    expect(onSwipeRight).not.toHaveBeenCalled();
  });
});
