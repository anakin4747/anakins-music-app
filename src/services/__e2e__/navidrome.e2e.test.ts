/**
 * E2E tests for Navidrome integration via the app's NavidromeService.
 *
 * Prerequisites (handled by jest.e2e.config.js globalSetup):
 *   - A real Navidrome instance is running on localhost:4534
 *   - An admin user "admin"/"admin" has been created
 *   - A 1-second silent MP3 has been indexed into the library
 */
import { ping } from '../navidrome';
import SubsonicAPI from 'subsonic-api';

const PORT = 4534;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const api = new SubsonicAPI({
  url: BASE_URL,
  auth: { username: 'admin', password: 'admin' },
});

describe('NavidromeService', () => {
  describe('ping', () => {
    it('returns ok with valid credentials', async () => {
      const result = await ping(BASE_URL, 'admin', 'admin');
      expect(result).toBe('ok');
    });

    it('returns wrong-credentials with bad password', async () => {
      const result = await ping(BASE_URL, 'admin', 'wrongpassword');
      expect(result).toBe('wrong-credentials');
    });

    it('returns invalid-url when url is not parseable', async () => {
      const result = await ping('not a url', 'admin', 'admin');
      expect(result).toBe('invalid-url');
    });

    it('returns server-not-found when host does not exist', async () => {
      const result = await ping('http://doesnotexist.invalid', 'admin', 'admin');
      expect(result).toBe('server-not-found');
    });

    it('returns unreachable when connection is refused', async () => {
      const result = await ping('http://127.0.0.1:9', 'admin', 'admin');
      expect(result).toBe('unreachable');
    });
  });
});

describe('Navidrome / Subsonic API', () => {
  describe('getArtists', () => {
    it('returns an artists object', async () => {
      const res = await api.getArtists();
      expect(res.status).toBe('ok');
      expect(res.artists).toBeDefined();
    });

    it('includes the test artist in the library', async () => {
      const res = await api.getArtists();
      const index = res.artists.index ?? [];
      const allArtists = index.flatMap((idx) => idx.artist ?? []);
      const names = allArtists.map((a) => a.name);
      expect(names).toContain('Test Artist');
    });
  });

  describe('search3', () => {
    it('finds the test track by title', async () => {
      const res = await api.search3({ query: 'Silence', songCount: 10 });
      expect(res.status).toBe('ok');
      const songs = res.searchResult3.song ?? [];
      expect(songs.length).toBeGreaterThan(0);
      expect(songs[0].title).toBe('Silence');
    });

    it('finds the test track by artist', async () => {
      const res = await api.search3({ query: 'Test Artist', songCount: 10 });
      expect(res.status).toBe('ok');
      const songs = res.searchResult3.song ?? [];
      expect(songs.length).toBeGreaterThan(0);
      expect(songs[0].artist).toBe('Test Artist');
    });
  });

  describe('stream', () => {
    it('streams audio bytes directly via the subsonic-api client', async () => {
      const searchRes = await api.search3({ query: 'Silence', songCount: 1 });
      const songs = searchRes.searchResult3.song ?? [];
      expect(songs.length).toBeGreaterThan(0);

      const song = songs[0];
      const audioRes = await api.stream({ id: song.id });

      expect(audioRes.ok).toBe(true);
      const contentType = audioRes.headers.get('content-type') ?? '';
      expect(contentType).toMatch(/audio|octet-stream/);
    });
  });
});
