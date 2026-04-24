import { rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { readFileSync } from 'fs';

const E2E_STATE_FILE = join(tmpdir(), 'navidrome-e2e-state.json');

export default async function globalTeardown(): Promise<void> {
  let state: { pid: number; dataDir: string; musicDir: string } | undefined;

  try {
    state = JSON.parse(readFileSync(E2E_STATE_FILE, 'utf8'));
  } catch {
    console.warn('e2e teardown: could not read state file, skipping cleanup');
    return;
  }

  if (state?.pid) {
    try {
      process.kill(state.pid, 'SIGTERM');
    } catch {
      // Process may have already exited.
    }
  }

  for (const dir of [state?.dataDir, state?.musicDir]) {
    if (dir) {
      try {
        rmSync(dir, { recursive: true, force: true });
      } catch {
        // Best-effort cleanup.
      }
    }
  }

  try {
    rmSync(E2E_STATE_FILE, { force: true });
  } catch {
    // ignore
  }
}
