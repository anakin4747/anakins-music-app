import React from 'react';
import { render, screen } from '@testing-library/react-native';
import QueuesScreen from '../../../app/queues';
import { addSongToQueue, resetQueues } from '@/stores/queues';

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
    resetQueues();
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

  it('renders songs added to the queue', () => {
    addSongToQueue(1, { id: 's1', title: 'Come Together', track: 1, duration: 200 });
    render(<QueuesScreen />);
    expect(screen.getByTestId('queue-song-s1')).toHaveTextContent('1. Come Together');
  });

  it('does not show songs from a different queue', () => {
    addSongToQueue(2, { id: 's2', title: 'Something', track: 2, duration: 180 });
    render(<QueuesScreen />);
    expect(screen.queryByTestId('queue-song-s2')).toBeNull();
  });

  it('shows songs for the current queue index', () => {
    mockParams = { index: '2' };
    addSongToQueue(2, { id: 's2', title: 'Something', track: 2, duration: 180 });
    render(<QueuesScreen />);
    expect(screen.getByTestId('queue-song-s2')).toHaveTextContent('2. Something');
  });
});
