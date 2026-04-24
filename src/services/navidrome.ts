import SubsonicAPI from 'subsonic-api';

export type PingResult =
  | 'ok'
  | 'wrong-credentials'
  | 'invalid-url'
  | 'server-not-found'
  | 'unreachable'
  | 'timed-out';

export type FetchError = 'invalid-url' | 'server-not-found' | 'unreachable';

export interface AlbumItem { id: string; name: string; artist: string }
export interface PlaylistItem { id: string; name: string }
export interface SongItem { id: string; title: string; artist: string; track: number }

export type AlbumsResult = { ok: true; albums: AlbumItem[] } | { ok: false; error: FetchError };
export type PlaylistsResult = { ok: true; playlists: PlaylistItem[] } | { ok: false; error: FetchError };
export type AlbumDetailResult = { ok: true; album: AlbumItem; songs: SongItem[] } | { ok: false; error: FetchError };
export type PlaylistDetailResult = { ok: true; playlist: PlaylistItem; songs: SongItem[] } | { ok: false; error: FetchError };

function isValidUrl(url: string): boolean {
  try { new URL(url); return true; } catch { return false; }
}

function makeApi(url: string, username: string, password: string): SubsonicAPI {
  return new SubsonicAPI({
    url,
    auth: { username, password },
    salt: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
    reuseSalt: true,
  });
}

function classifyNetworkError(err: unknown): FetchError {
  const cause = (err as { cause?: { code?: string; message?: string } })?.cause;
  if (cause?.code === 'ENOTFOUND' || cause?.message?.includes('ENOTFOUND')) return 'server-not-found';
  if (cause?.code === 'ECONNREFUSED' || cause?.message?.includes('ECONNREFUSED')) return 'unreachable';
  return 'unreachable';
}

export async function ping(url: string, username: string, password: string): Promise<PingResult> {
  if (!isValidUrl(url)) return 'invalid-url';

  const api = makeApi(url, username, password);

  let timer: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      const err = new Error('timed out');
      err.name = 'AbortError';
      reject(err);
    }, 10_000);
  });

  try {
    const res = await Promise.race([api.ping(), timeoutPromise]);
    if (res.status === 'ok') return 'ok';
    const code = (res as { error?: { code?: number } }).error?.code;
    if (code === 40 || code === 41) return 'wrong-credentials';
    return 'unreachable';
  } catch (err: unknown) {
    const asErr = err as { name?: string; cause?: { code?: string; message?: string } };
    if (asErr?.name === 'AbortError') return 'timed-out';
    return classifyNetworkError(err);
  } finally {
    clearTimeout(timer!);
  }
}

export async function getAlbums(url: string, username: string, password: string): Promise<AlbumsResult> {
  if (!isValidUrl(url)) return { ok: false, error: 'invalid-url' };

  try {
    const api = makeApi(url, username, password);
    const res = await api.getAlbumList2({ type: 'alphabeticalByName', size: 500 });
    const albums = (res as { albumList2: { album?: AlbumItem[] } }).albumList2?.album ?? [];
    return { ok: true, albums };
  } catch (err) {
    return { ok: false, error: classifyNetworkError(err) };
  }
}

export async function getPlaylists(url: string, username: string, password: string): Promise<PlaylistsResult> {
  if (!isValidUrl(url)) return { ok: false, error: 'invalid-url' };

  try {
    const api = makeApi(url, username, password);
    const res = await api.getPlaylists({});
    const playlists = (res as { playlists: { playlist?: PlaylistItem[] } }).playlists?.playlist ?? [];
    return { ok: true, playlists };
  } catch (err) {
    return { ok: false, error: classifyNetworkError(err) };
  }
}

export async function getAlbum(url: string, username: string, password: string, id: string): Promise<AlbumDetailResult> {
  if (!isValidUrl(url)) return { ok: false, error: 'invalid-url' };

  try {
    const api = makeApi(url, username, password);
    const res = await (api as unknown as { getAlbum: (p: { id: string }) => Promise<{ album: AlbumItem & { song?: SongItem[] } }> }).getAlbum({ id });
    const { song: songs = [], ...albumFields } = res.album;
    return { ok: true, album: albumFields as AlbumItem, songs };
  } catch (err) {
    return { ok: false, error: classifyNetworkError(err) };
  }
}

export async function getPlaylist(url: string, username: string, password: string, id: string): Promise<PlaylistDetailResult> {
  if (!isValidUrl(url)) return { ok: false, error: 'invalid-url' };

  try {
    const api = makeApi(url, username, password);
    const res = await (api as unknown as { getPlaylist: (p: { id: string }) => Promise<{ playlist: PlaylistItem & { entry?: SongItem[] } }> }).getPlaylist({ id });
    const { entry: songs = [], ...playlistFields } = res.playlist;
    return { ok: true, playlist: playlistFields as PlaylistItem, songs };
  } catch (err) {
    return { ok: false, error: classifyNetworkError(err) };
  }
}
