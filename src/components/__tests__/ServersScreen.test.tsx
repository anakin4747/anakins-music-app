import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ServersScreen from '../../../app/servers';

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn() }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/components/SwipeBackView', () => ({
  SwipeBackView: ({ children }: { children: React.ReactNode }) => children,
}));

describe('ServersScreen', () => {
  it('renders first server at the top', () => {
    render(<ServersScreen />);
    expect(screen.getByTestId('server-heading')).toHaveTextContent('first server');
  });

  it('does not render a list of servers', () => {
    render(<ServersScreen />);
    expect(screen.queryByTestId('server-item-1')).toBeNull();
  });
});
