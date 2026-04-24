import React from 'react';
import { render, screen } from '@testing-library/react-native';
import QueuesScreen from '../../../app/queues';

const mockPush = jest.fn();
let mockParams: Record<string, string> = {};

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn(), push: mockPush }),
  useLocalSearchParams: () => mockParams,
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

let capturedOnSwipeLeft: (() => void) | undefined;

jest.mock('@/components/SwipeBackView', () => ({
  SwipeBackView: ({ children, onSwipeLeft }: { children: React.ReactNode; onSwipeLeft?: () => void }) => {
    capturedOnSwipeLeft = onSwipeLeft;
    return children;
  },
}));

describe('QueuesScreen', () => {
  beforeEach(() => {
    mockParams = {};
    mockPush.mockClear();
    capturedOnSwipeLeft = undefined;
  });

  it('renders first queue at the top', () => {
    render(<QueuesScreen />);
    expect(screen.getByTestId('queue-heading')).toHaveTextContent('first queue');
  });

  it('does not render a list of queues', () => {
    render(<QueuesScreen />);
    expect(screen.queryByTestId('queue-item-1')).toBeNull();
  });

  it('shows second queue when index is 2', () => {
    mockParams = { index: '2' };
    render(<QueuesScreen />);
    expect(screen.getByTestId('queue-heading')).toHaveTextContent('second queue');
  });

  it('swipe left pushes to the next queue index', () => {
    mockParams = { index: '2' };
    render(<QueuesScreen />);
    capturedOnSwipeLeft?.();
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/queues', params: { index: 3 } });
  });

  it('swipe left from first queue pushes to second queue', () => {
    render(<QueuesScreen />);
    capturedOnSwipeLeft?.();
    expect(mockPush).toHaveBeenCalledWith({ pathname: '/queues', params: { index: 2 } });
  });
});
