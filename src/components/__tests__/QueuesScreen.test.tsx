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
  it('renders first queue at the top', () => {
    render(<QueuesScreen />);
    expect(screen.getByTestId('queue-heading')).toHaveTextContent('first queue');
  });

  it('does not render a list of queues', () => {
    render(<QueuesScreen />);
    expect(screen.queryByTestId('queue-item-1')).toBeNull();
  });
});
