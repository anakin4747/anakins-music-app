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

  it('renders the url label', () => {
    render(<ServersScreen />);
    expect(screen.getByTestId('server-url-label')).toHaveTextContent('url');
  });

  it('renders the url input', () => {
    render(<ServersScreen />);
    expect(screen.getByTestId('server-url-input')).toBeTruthy();
  });

  it('renders the usr label', () => {
    render(<ServersScreen />);
    expect(screen.getByTestId('server-usr-label')).toHaveTextContent('usr');
  });

  it('renders the usr input', () => {
    render(<ServersScreen />);
    expect(screen.getByTestId('server-usr-input')).toBeTruthy();
  });

  it('renders the passwd label', () => {
    render(<ServersScreen />);
    expect(screen.getByTestId('server-passwd-label')).toHaveTextContent('passwd');
  });

  it('renders the passwd input', () => {
    render(<ServersScreen />);
    expect(screen.getByTestId('server-passwd-input')).toBeTruthy();
  });

  it('renders the ping button', () => {
    render(<ServersScreen />);
    expect(screen.getByTestId('server-ping-button')).toHaveTextContent('ping');
  });
});
