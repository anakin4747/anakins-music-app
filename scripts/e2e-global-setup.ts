import { execFileSync, execSync, spawn } from 'child_process';
import { mkdtempSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const E2E_PORT = 4534;
const E2E_STATE_FILE = join(tmpdir(), 'navidrome-e2e-state.json');

/**
 * Resolve a binary path: try PATH first, then fall back to `nix build`.
 * This means the tests work both inside and outside the nix devShell.
 */
function resolveBin(name: string, nixAttr: string): string {
  try {
    return execSync(`which ${name}`, { encoding: 'utf8' }).trim();
  } catch {
    // Not on PATH – ask nix for the store path.
    const storePath = execSync(
      `nix build ${nixAttr} --no-link --print-out-paths 2>/dev/null`,
      { encoding: 'utf8' },
    ).trim();
    return join(storePath, 'bin', name);
  }
}

async function waitForNavidrome(
  url: string,
  timeoutMs = 20000,
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 300));
  }
  throw new Error(`Navidrome did not become ready at ${url} within ${timeoutMs}ms`);
}

export default async function globalSetup(): Promise<void> {
  const navidromeBin = resolveBin('navidrome', 'nixpkgs#navidrome');
  const ffmpegBin = resolveBin('ffmpeg', 'nixpkgs#ffmpeg');

  const dataDir = mkdtempSync(join(tmpdir(), 'navidrome-e2e-data-'));
  const musicDir = mkdtempSync(join(tmpdir(), 'navidrome-e2e-music-'));

  // Generate a 1-second silent MP3 using ffmpeg so Navidrome has something to index.
  // Tags ensure it appears as a proper track in the library.
  const trackPath = join(musicDir, 'silence.mp3');
  execFileSync(ffmpegBin, [
    '-f', 'lavfi',
    '-i', 'anullsrc=r=44100:cl=stereo',
    '-t', '1',
    '-q:a', '9',
    '-acodec', 'libmp3lame',
    '-metadata', 'title=Silence',
    '-metadata', 'artist=Test Artist',
    '-metadata', 'album=Test Album',
    '-metadata', 'track=1',
    trackPath,
  ], { stdio: 'ignore' });

  // Start Navidrome to initialise the database schema.
  const navidrome = spawn(
    navidromeBin,
    [
      '--datafolder', dataDir,
      '--musicfolder', musicDir,
      '--port', String(E2E_PORT),
      '--address', '127.0.0.1',
      '--loglevel', 'error',
      '--nobanner',
    ],
    { stdio: 'ignore', detached: false },
  );

  // Wait for the HTTP server to be up.
  // On first run there are no users so the ping will return a 200 with an
  // auth error – that is fine, the server is up.
  await waitForNavidrome(`http://127.0.0.1:${E2E_PORT}/app`, 20000);

  // Create the admin user via the first-run endpoint (only works when no
  // users exist yet).
  const createRes = await fetch(
    `http://127.0.0.1:${E2E_PORT}/auth/createAdmin`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin' }),
    },
  );
  if (!createRes.ok) {
    const body = await createRes.text();
    throw new Error(`Failed to create admin user: ${createRes.status} ${body}`);
  }

  // Wait for the library scan to finish so tracks are indexed.
  // We poll the song count endpoint until it is non-zero.
  const songsUrl =
    `http://127.0.0.1:${E2E_PORT}/rest/getSongs.view` +
    `?u=admin&p=admin&c=e2e&f=json&v=1.16.1`;
  const start = Date.now();
  while (Date.now() - start < 15000) {
    try {
      const r = await fetch(songsUrl);
      const json = (await r.json()) as {
        'subsonic-response': { song?: unknown[]; status: string };
      };
      const songs = json['subsonic-response'].song;
      if (Array.isArray(songs) && songs.length > 0) break;
    } catch {
      // keep polling
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  // Persist state for globalTeardown and the test suite.
  const state = { pid: navidrome.pid, dataDir, musicDir, port: E2E_PORT };
  writeFileSync(E2E_STATE_FILE, JSON.stringify(state));

  // Expose the port on the global object so tests can read it without
  // touching the filesystem.
  (globalThis as Record<string, unknown>).__NAVIDROME_PORT__ = E2E_PORT;
}
