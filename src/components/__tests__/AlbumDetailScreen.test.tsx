import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import AlbumDetailScreen from '../../../app/album/[id]';
import { resetServerConfigs, setServerConfig, setLastPingedServerIndex } from '@/stores/serverConfigs';

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn() }),
  useLocalSearchParams: () => ({ id: '42' }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/components/SwipeBackView', () => ({
  SwipeBackView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/services/navidrome', () => ({
  getAlbum: jest.fn(),
}));

import { getAlbum } from '@/services/navidrome';
const mockGetAlbum = getAlbum as jest.MockedFunction<typeof getAlbum>;

describe('AlbumDetailScreen', () => {
  beforeEach(() => {
    resetServerConfigs();
    mockGetAlbum.mockClear();
  });

  it('shows loading while fetching', () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    mockGetAlbum.mockReturnValue(new Promise(() => {}));
    render(<AlbumDetailScreen />);
    expect(screen.getByTestId('album-detail-loading')).toBeTruthy();
  });

  it('shows no server configured when no server has been pinged', () => {
    render(<AlbumDetailScreen />);
    expect(screen.getByTestId('album-detail-error')).toHaveTextContent('no server configured');
  });

  it('renders album name and artist', async () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    mockGetAlbum.mockResolvedValue({
      ok: true,
      album: { id: '42', name: 'Abbey Road', artist: 'Beatles' },
      songs: [],
    });
    render(<AlbumDetailScreen />);
    await act(async () => {});
    expect(screen.getByTestId('album-detail-name')).toHaveTextContent('Abbey Road');
    expect(screen.getByTestId('album-detail-artist')).toHaveTextContent('Beatles');
  });

  it('renders a row for each song', async () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    mockGetAlbum.mockResolvedValue({
      ok: true,
      album: { id: '42', name: 'Abbey Road', artist: 'Beatles' },
      songs: [
        { id: 's1', title: 'Come Together', artist: 'Beatles', track: 1 },
        { id: 's2', title: 'Something', artist: 'Beatles', track: 2 },
      ],
    });
    render(<AlbumDetailScreen />);
    await act(async () => {});
    const rows = screen.getAllByTestId('song-row');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('1. Come Together');
    expect(rows[1]).toHaveTextContent('2. Something');
  });

  it('shows error message when fetch fails', async () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    mockGetAlbum.mockResolvedValue({ ok: false, error: 'unreachable' });
    render(<AlbumDetailScreen />);
    await act(async () => {});
    expect(screen.getByTestId('album-detail-error')).toHaveTextContent('unreachable');
  });

  it('fetches using the last pinged server credentials and the route id', async () => {
    setServerConfig(1, { url: 'http://srv', usr: 'bob', passwd: 'secret' });
    setLastPingedServerIndex(1);
    mockGetAlbum.mockResolvedValue({ ok: true, album: { id: '42', name: 'A', artist: 'B' }, songs: [] });
    render(<AlbumDetailScreen />);
    await act(async () => {});
    expect(mockGetAlbum).toHaveBeenCalledWith('http://srv', 'bob', 'secret', '42');
  });
});
