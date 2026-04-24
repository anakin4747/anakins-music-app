import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MainMenu } from '../MainMenu';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe('MainMenu', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders the queues item', () => {
    render(<MainMenu />);
    expect(screen.getByTestId('menu-item-queues')).toHaveTextContent('queues');
  });

  it('renders the playlists item', () => {
    render(<MainMenu />);
    expect(screen.getByTestId('menu-item-playlists')).toHaveTextContent('playlists');
  });

  it('renders the albums item', () => {
    render(<MainMenu />);
    expect(screen.getByTestId('menu-item-albums')).toHaveTextContent('albums');
  });

  it('navigates to /queues when queues is pressed', () => {
    render(<MainMenu />);
    fireEvent.press(screen.getByTestId('menu-item-queues'));
    expect(mockPush).toHaveBeenCalledWith('/queues');
  });
});
