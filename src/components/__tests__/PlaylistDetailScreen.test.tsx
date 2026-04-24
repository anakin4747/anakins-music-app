import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import PlaylistDetailScreen from '../../../app/playlist/[id]';
import { resetServerConfigs, setServerConfig, setLastPingedServerIndex } from '@/stores/serverConfigs';

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn() }),
  useLocalSearchParams: () => ({ id: '7' }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/components/SwipeBackView', () => ({
  SwipeBackView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/services/navidrome', () => ({
  getPlaylist: jest.fn(),
}));

import { getPlaylist } from '@/services/navidrome';
const mockGetPlaylist = getPlaylist as jest.MockedFunction<typeof getPlaylist>;

describe('PlaylistDetailScreen', () => {
  beforeEach(() => {
    resetServerConfigs();
    mockGetPlaylist.mockClear();
  });

  it('shows loading while fetching', () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    mockGetPlaylist.mockReturnValue(new Promise(() => {}));
    render(<PlaylistDetailScreen />);
    expect(screen.getByTestId('playlist-detail-loading')).toBeTruthy();
  });

  it('shows no server configured when no server has been pinged', () => {
    render(<PlaylistDetailScreen />);
    expect(screen.getByTestId('playlist-detail-error')).toHaveTextContent('no server configured');
  });

  it('renders playlist name', async () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    mockGetPlaylist.mockResolvedValue({ ok: true, playlist: { id: '7', name: 'My Mix' }, songs: [] });
    render(<PlaylistDetailScreen />);
    await act(async () => {});
    expect(screen.getByTestId('playlist-detail-name')).toHaveTextContent('My Mix');
  });

  it('renders a row for each song', async () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    mockGetPlaylist.mockResolvedValue({
      ok: true,
      playlist: { id: '7', name: 'My Mix' },
      songs: [
        { id: 's1', title: 'Come Together', artist: 'Beatles', track: 1 },
        { id: 's2', title: 'Something', artist: 'Beatles', track: 2 },
      ],
    });
    render(<PlaylistDetailScreen />);
    await act(async () => {});
    const rows = screen.getAllByTestId('song-row');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent(/Come Together/);
    expect(rows[1]).toHaveTextContent(/Something/);
  });

  it('shows error message when fetch fails', async () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    mockGetPlaylist.mockResolvedValue({ ok: false, error: 'unreachable' });
    render(<PlaylistDetailScreen />);
    await act(async () => {});
    expect(screen.getByTestId('playlist-detail-error')).toHaveTextContent('unreachable');
  });

  it('fetches using the last pinged server credentials and the route id', async () => {
    setServerConfig(1, { url: 'http://srv', usr: 'bob', passwd: 'secret' });
    setLastPingedServerIndex(1);
    mockGetPlaylist.mockResolvedValue({ ok: true, playlist: { id: '7', name: 'A' }, songs: [] });
    render(<PlaylistDetailScreen />);
    await act(async () => {});
    expect(mockGetPlaylist).toHaveBeenCalledWith('http://srv', 'bob', 'secret', '7');
  });
});
