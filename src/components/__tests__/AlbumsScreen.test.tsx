import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react-native';
import AlbumsScreen from '../../../app/albums';
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

jest.mock('@/services/navidrome', () => ({
  getAlbums: jest.fn(),
}));

import { getAlbums } from '@/services/navidrome';
const mockGetAlbums = getAlbums as jest.MockedFunction<typeof getAlbums>;

describe('AlbumsScreen', () => {
  beforeEach(() => {
    resetServerConfigs();
    mockGetAlbums.mockClear();
    mockPush.mockClear();
  });

  it('renders the albums heading', () => {
    mockGetAlbums.mockResolvedValue({ ok: true, albums: [] });
    render(<AlbumsScreen />);
    expect(screen.getByTestId('albums-heading')).toHaveTextContent('albums');
  });

  it('shows no server configured when no server has been pinged', () => {
    render(<AlbumsScreen />);
    expect(screen.getByTestId('albums-error')).toHaveTextContent('no server configured');
  });

  it('shows a loading indicator while fetching', async () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    let resolve!: (v: any) => void;
    mockGetAlbums.mockReturnValue(new Promise((r) => { resolve = r; }));
    render(<AlbumsScreen />);
    expect(screen.getByTestId('albums-loading')).toBeTruthy();
    await act(async () => { resolve({ ok: true, albums: [] }); });
  });

  it('renders a row for each album with name and artist', async () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    mockGetAlbums.mockResolvedValue({
      ok: true,
      albums: [
        { id: '1', name: 'Abbey Road', artist: 'Beatles' },
        { id: '2', name: 'OK Computer', artist: 'Radiohead' },
      ],
    });
    render(<AlbumsScreen />);
    await act(async () => {});
    const rows = screen.getAllByTestId('album-row');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent(/Abbey Road/);
    expect(rows[0]).toHaveTextContent(/Beatles/);
    expect(rows[1]).toHaveTextContent(/OK Computer/);
    expect(rows[1]).toHaveTextContent(/Radiohead/);
  });

  it('shows an error message when the fetch fails', async () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    mockGetAlbums.mockResolvedValue({ ok: false, error: 'unreachable' });
    render(<AlbumsScreen />);
    await act(async () => {});
    expect(screen.getByTestId('albums-error')).toHaveTextContent('unreachable');
  });

  it('shows empty list message when there are no albums', async () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    mockGetAlbums.mockResolvedValue({ ok: true, albums: [] });
    render(<AlbumsScreen />);
    await act(async () => {});
    expect(screen.getByTestId('albums-empty')).toHaveTextContent('no albums');
  });

  it('fetches using the last pinged server credentials', async () => {
    setServerConfig(1, { url: 'http://srv', usr: 'bob', passwd: 'secret' });
    setLastPingedServerIndex(1);
    mockGetAlbums.mockResolvedValue({ ok: true, albums: [] });
    render(<AlbumsScreen />);
    await act(async () => {});
    expect(mockGetAlbums).toHaveBeenCalledWith('http://srv', 'bob', 'secret');
  });

  it('pressing an album row navigates to its detail screen', async () => {
    setServerConfig(1, { url: 'http://s', usr: 'u', passwd: 'p' });
    setLastPingedServerIndex(1);
    mockGetAlbums.mockResolvedValue({
      ok: true,
      albums: [{ id: 'abc', name: 'Abbey Road', artist: 'Beatles' }],
    });
    render(<AlbumsScreen />);
    await act(async () => {});
    fireEvent.press(screen.getByTestId('album-row'));
    expect(mockPush).toHaveBeenCalledWith('/album/abc');
  });
});
