import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react-native';
import PlaylistsScreen from '../../../app/playlists';
import { resetServerConfigs, setServerConfig, setLastPingedServerIndex } from '@/stores/serverConfigs';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn(), push: mockPush }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/components/SwipeBackView', () => ({
  SwipeBackView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/components/SwipeOpenView', () => ({
  SwipeOpenView: ({ children, onSwipeLeft, style }: { children: React.ReactNode; onSwipeLeft: () => void; style?: object }) => {
    const { Pressable } = require('react-native');
    return (
      <Pressable testID="swipe-open-view" onPress={onSwipeLeft} style={style}>
        {children}
      </Pressable>
    );
  },
}));

jest.mock('@/services/navidrome', () => ({
  getPlaylists: jest.fn(),
}));

import { getPlaylists } from '@/services/navidrome';
const mockGetPlaylists = getPlaylists as jest.MockedFunction<typeof getPlaylists>;

describe('PlaylistsScreen', () => {
  beforeEach(() => {
    resetServerConfigs();
    mockGetPlaylists.mockClear();
    mockPush.mockClear();
  });

  it('renders the playlists heading', () => {
    mockGetPlaylists.mockResolvedValue({ ok: true, playlists: [] });
    render(<PlaylistsScreen />);
    expect(screen.getByTestId('playlists-heading')).toHaveTextContent('playlists');
  });

  it('shows no server configured when no server has been pinged', () => {
    render(<PlaylistsScreen />);
    expect(screen.getByTestId('playlists-no-server')).toHaveTextContent('no server configured');
  });

  it('shows a loading indicator while fetching', async () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    let resolve!: (v: any) => void;
    mockGetPlaylists.mockReturnValue(new Promise((r) => { resolve = r; }));
    render(<PlaylistsScreen />);
    expect(screen.getByTestId('playlists-loading')).toBeTruthy();
    await act(async () => { resolve({ ok: true, playlists: [] }); });
  });

  it('renders a row for each playlist with its name', async () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    mockGetPlaylists.mockResolvedValue({
      ok: true,
      playlists: [
        { id: '1', name: 'My Mix' },
        { id: '2', name: 'Chill Vibes' },
      ],
    });
    render(<PlaylistsScreen />);
    await act(async () => {});
    const rows = screen.getAllByTestId('playlist-row');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('My Mix');
    expect(rows[1]).toHaveTextContent('Chill Vibes');
  });

  it('shows an error message when the fetch fails', async () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    mockGetPlaylists.mockResolvedValue({ ok: false, error: 'unreachable' });
    render(<PlaylistsScreen />);
    await act(async () => {});
    expect(screen.getByTestId('playlists-fetch-error')).toHaveTextContent('unreachable');
  });

  it('shows empty list message when there are no playlists', async () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    mockGetPlaylists.mockResolvedValue({ ok: true, playlists: [] });
    render(<PlaylistsScreen />);
    await act(async () => {});
    expect(screen.getByTestId('playlists-empty')).toHaveTextContent('no playlists');
  });

  it('fetches using the last pinged server credentials', async () => {
    setServerConfig(1, { url: 'http://srv', usr: 'bob', passwd: 'secret' });
    setLastPingedServerIndex(1);
    mockGetPlaylists.mockResolvedValue({ ok: true, playlists: [] });
    render(<PlaylistsScreen />);
    await act(async () => {});
    expect(mockGetPlaylists).toHaveBeenCalledWith('http://srv', 'bob', 'secret');
  });

  it('pressing a playlist row navigates to its detail screen', async () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    mockGetPlaylists.mockResolvedValue({
      ok: true,
      playlists: [{ id: 'xyz', name: 'My Mix' }],
    });
    render(<PlaylistsScreen />);
    await act(async () => {});
    fireEvent.press(screen.getByTestId('playlist-row'));
    expect(mockPush).toHaveBeenCalledWith('/playlist/xyz');
  });

  it('swiping left on a playlist row navigates to its detail screen', async () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    mockGetPlaylists.mockResolvedValue({
      ok: true,
      playlists: [{ id: 'xyz', name: 'My Mix' }],
    });
    render(<PlaylistsScreen />);
    await act(async () => {});
    fireEvent.press(screen.getByTestId('swipe-open-view'));
    expect(mockPush).toHaveBeenCalledWith('/playlist/xyz');
  });
});
