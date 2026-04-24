import React from 'react';
import { render, screen } from '@testing-library/react-native';
import QueuesScreen from '../../../app/queues';

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/components/SwipeBackView', () => ({
  SwipeBackView: ({ children }: { children: React.ReactNode }) => children,
}));

describe('QueuesScreen', () => {
  it('renders first queue', () => {
    render(<QueuesScreen />);
    expect(screen.getByTestId('queue-item-0')).toHaveTextContent('first queue');
  });

  it('renders second queue', () => {
    render(<QueuesScreen />);
    expect(screen.getByTestId('queue-item-1')).toHaveTextContent('second queue');
  });

  it('renders third queue', () => {
    render(<QueuesScreen />);
    expect(screen.getByTestId('queue-item-2')).toHaveTextContent('third queue');
  });
});
