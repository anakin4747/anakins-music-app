import { getAlbums, getPlaylists } from '../navidrome';

jest.mock('subsonic-api', () => {
  return jest.fn().mockImplementation(() => ({
    getAlbumList2: jest.fn(),
    getPlaylists: jest.fn(),
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
