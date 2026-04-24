/**
 * E2E tests for Navidrome integration via the Subsonic API.
 *
 * Prerequisites (handled by jest.e2e.config.js globalSetup):
 *   - A real Navidrome instance is running on localhost:4534
 *   - An admin user "admin"/"admin" has been created
 *   - A 1-second silent MP3 has been indexed into the library
 */
import SubsonicAPI from 'subsonic-api';

const PORT = 4534;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const api = new SubsonicAPI({
  url: BASE_URL,
  auth: { username: 'admin', password: 'admin' },
});

describe('Navidrome / Subsonic API', () => {
  describe('ping', () => {
    it('responds with status ok', async () => {
      const res = await api.ping();
      expect(res.status).toBe('ok');
    });

    it('includes a server version string', async () => {
      const res = await api.ping();
      expect(typeof res.version).toBe('string');
      expect(res.version.length).toBeGreaterThan(0);
    });
  });

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
      // Get a song ID from search first.
      const searchRes = await api.search3({ query: 'Silence', songCount: 1 });
      const songs = searchRes.searchResult3.song ?? [];
      expect(songs.length).toBeGreaterThan(0);

      const song = songs[0];

      // api.stream() returns the raw fetch Response for the audio stream.
      const audioRes = await api.stream({ id: song.id });

      expect(audioRes.ok).toBe(true);
      const contentType = audioRes.headers.get('content-type') ?? '';
      expect(contentType).toMatch(/audio|octet-stream/);
    });
  });
});
