import { getAlbums, getPlaylists, getAlbum, getPlaylist } from '../navidrome';

jest.mock('subsonic-api', () => {
  return jest.fn().mockImplementation(() => ({
    getAlbumList2: jest.fn(),
    getPlaylists: jest.fn(),
    getAlbum: jest.fn(),
    getPlaylist: jest.fn(),
  }));
});

import SubsonicAPI from 'subsonic-api';
const MockSubsonicAPI = SubsonicAPI as jest.MockedClass<typeof SubsonicAPI>;

function mockGetAlbumList2(impl: () => Promise<unknown>) {
  MockSubsonicAPI.mockImplementation(() => ({ getAlbumList2: impl } as never));
}

function mockGetPlaylists(impl: () => Promise<unknown>) {
  MockSubsonicAPI.mockImplementation(() => ({ getPlaylists: impl } as never));
}

function mockGetAlbum(impl: () => Promise<unknown>) {
  MockSubsonicAPI.mockImplementation(() => ({ getAlbum: impl } as never));
}

function mockGetPlaylist(impl: () => Promise<unknown>) {
  MockSubsonicAPI.mockImplementation(() => ({ getPlaylist: impl } as never));
}

beforeEach(() => {
  MockSubsonicAPI.mockClear();
});

describe('getAlbums', () => {
  it('returns albums list on success', async () => {
    mockGetAlbumList2(async () => ({
      albumList2: { album: [{ id: '1', name: 'Abbey Road', artist: 'Beatles' }] },
    }));
    const result = await getAlbums('http://localhost:4534', 'admin', 'admin');
    expect(result).toEqual({ ok: true, albums: [{ id: '1', name: 'Abbey Road', artist: 'Beatles' }] });
  });

  it('returns empty list when there are no albums', async () => {
    mockGetAlbumList2(async () => ({ albumList2: {} }));
    const result = await getAlbums('http://localhost:4534', 'admin', 'admin');
    expect(result).toEqual({ ok: true, albums: [] });
  });

  it('returns invalid-url for a malformed url', async () => {
    const result = await getAlbums('not a url', 'admin', 'admin');
    expect(result).toEqual({ ok: false, error: 'invalid-url' });
  });

  it('returns server-not-found when DNS lookup fails', async () => {
    mockGetAlbumList2(async () => {
      const err = new Error('fetch failed');
      (err as NodeJS.ErrnoException & { cause: Error }).cause = Object.assign(new Error('ENOTFOUND'), { code: 'ENOTFOUND' });
      throw err;
    });
    const result = await getAlbums('http://doesnotexist.invalid', 'admin', 'admin');
    expect(result).toEqual({ ok: false, error: 'server-not-found' });
  });

  it('returns unreachable when connection is refused', async () => {
    mockGetAlbumList2(async () => {
      const err = new Error('fetch failed');
      (err as NodeJS.ErrnoException & { cause: Error }).cause = Object.assign(new Error('ECONNREFUSED'), { code: 'ECONNREFUSED' });
      throw err;
    });
    const result = await getAlbums('http://localhost:9', 'admin', 'admin');
    expect(result).toEqual({ ok: false, error: 'unreachable' });
  });
});

describe('getPlaylists', () => {
  it('returns playlists list on success', async () => {
    mockGetPlaylists(async () => ({
      playlists: { playlist: [{ id: '1', name: 'My Mix' }] },
    }));
    const result = await getPlaylists('http://localhost:4534', 'admin', 'admin');
    expect(result).toEqual({ ok: true, playlists: [{ id: '1', name: 'My Mix' }] });
  });

  it('returns empty list when there are no playlists', async () => {
    mockGetPlaylists(async () => ({ playlists: {} }));
    const result = await getPlaylists('http://localhost:4534', 'admin', 'admin');
    expect(result).toEqual({ ok: true, playlists: [] });
  });

  it('returns invalid-url for a malformed url', async () => {
    const result = await getPlaylists('not a url', 'admin', 'admin');
    expect(result).toEqual({ ok: false, error: 'invalid-url' });
  });

  it('returns server-not-found when DNS lookup fails', async () => {
    mockGetPlaylists(async () => {
      const err = new Error('fetch failed');
      (err as NodeJS.ErrnoException & { cause: Error }).cause = Object.assign(new Error('ENOTFOUND'), { code: 'ENOTFOUND' });
      throw err;
    });
    const result = await getPlaylists('http://doesnotexist.invalid', 'admin', 'admin');
    expect(result).toEqual({ ok: false, error: 'server-not-found' });
  });

  it('returns unreachable when connection is refused', async () => {
    mockGetPlaylists(async () => {
      const err = new Error('fetch failed');
      (err as NodeJS.ErrnoException & { cause: Error }).cause = Object.assign(new Error('ECONNREFUSED'), { code: 'ECONNREFUSED' });
      throw err;
    });
    const result = await getPlaylists('http://localhost:9', 'admin', 'admin');
    expect(result).toEqual({ ok: false, error: 'unreachable' });
  });
});

describe('getAlbum', () => {
  it('returns album and songs on success', async () => {
    mockGetAlbum(async () => ({
      album: {
        id: '1', name: 'Abbey Road', artist: 'Beatles',
        song: [{ id: 's1', title: 'Come Together', artist: 'Beatles', track: 1 }],
      },
    }));
    const result = await getAlbum('http://localhost:4534', 'admin', 'admin', '1');
    expect(result).toEqual({
      ok: true,
      album: { id: '1', name: 'Abbey Road', artist: 'Beatles' },
      songs: [{ id: 's1', title: 'Come Together', artist: 'Beatles', track: 1 }],
    });
  });

  it('returns empty songs array when album has no songs', async () => {
    mockGetAlbum(async () => ({ album: { id: '1', name: 'Empty', artist: 'Nobody' } }));
    const result = await getAlbum('http://localhost:4534', 'admin', 'admin', '1');
    expect(result).toEqual({ ok: true, album: { id: '1', name: 'Empty', artist: 'Nobody' }, songs: [] });
  });

  it('returns invalid-url for a malformed url', async () => {
    const result = await getAlbum('not a url', 'admin', 'admin', '1');
    expect(result).toEqual({ ok: false, error: 'invalid-url' });
  });

  it('returns unreachable when connection is refused', async () => {
    mockGetAlbum(async () => {
      const err = new Error('fetch failed');
      (err as NodeJS.ErrnoException & { cause: Error }).cause = Object.assign(new Error('ECONNREFUSED'), { code: 'ECONNREFUSED' });
      throw err;
    });
    const result = await getAlbum('http://localhost:9', 'admin', 'admin', '1');
    expect(result).toEqual({ ok: false, error: 'unreachable' });
  });
});

describe('getPlaylist', () => {
  it('returns playlist and songs on success', async () => {
    mockGetPlaylist(async () => ({
      playlist: {
        id: '1', name: 'My Mix',
        entry: [{ id: 's1', title: 'Come Together', artist: 'Beatles', track: 1 }],
      },
    }));
    const result = await getPlaylist('http://localhost:4534', 'admin', 'admin', '1');
    expect(result).toEqual({
      ok: true,
      playlist: { id: '1', name: 'My Mix' },
      songs: [{ id: 's1', title: 'Come Together', artist: 'Beatles', track: 1 }],
    });
  });

  it('returns empty songs array when playlist has no entries', async () => {
    mockGetPlaylist(async () => ({ playlist: { id: '1', name: 'Empty' } }));
    const result = await getPlaylist('http://localhost:4534', 'admin', 'admin', '1');
    expect(result).toEqual({ ok: true, playlist: { id: '1', name: 'Empty' }, songs: [] });
  });

  it('returns invalid-url for a malformed url', async () => {
    const result = await getPlaylist('not a url', 'admin', 'admin', '1');
    expect(result).toEqual({ ok: false, error: 'invalid-url' });
  });

  it('returns unreachable when connection is refused', async () => {
    mockGetPlaylist(async () => {
      const err = new Error('fetch failed');
      (err as NodeJS.ErrnoException & { cause: Error }).cause = Object.assign(new Error('ECONNREFUSED'), { code: 'ECONNREFUSED' });
      throw err;
    });
    const result = await getPlaylist('http://localhost:9', 'admin', 'admin', '1');
    expect(result).toEqual({ ok: false, error: 'unreachable' });
  });
});

describe('getAlbums pagination', () => {
  it('fetches all pages when library exceeds one page', async () => {
    const page1 = Array.from({ length: 500 }, (_, i) => ({ id: String(i), name: `Album ${i}`, artist: 'A' }));
    const page2 = [{ id: '500', name: 'Album 500', artist: 'A' }];
    const impl = jest.fn()
      .mockResolvedValueOnce({ albumList2: { album: page1 } })
      .mockResolvedValueOnce({ albumList2: { album: page2 } });
    MockSubsonicAPI.mockImplementation(() => ({ getAlbumList2: impl } as never));
    const result = await getAlbums('http://localhost:4534', 'admin', 'admin');
    expect(result).toEqual({ ok: true, albums: [...page1, ...page2] });
  });
});
