import SubsonicAPI from 'subsonic-api';

export type PingResult =
  | 'ok'
  | 'wrong-credentials'
  | 'invalid-url'
  | 'server-not-found'
  | 'unreachable'
  | 'timed-out';

export async function ping(url: string, username: string, password: string): Promise<PingResult> {
  try {
    new URL(url);
  } catch {
    return 'invalid-url';
  }

  const api = new SubsonicAPI({
    url,
    auth: { username, password },
    salt: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
    reuseSalt: true,
  });

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
    if (err instanceof Error) {
      if (err.name === 'AbortError') return 'timed-out';
      const cause = (err as { cause?: { code?: string; message?: string } }).cause;
      if (cause?.code === 'ENOTFOUND' || cause?.message?.includes('ENOTFOUND')) return 'server-not-found';
      if (cause?.code === 'ECONNREFUSED' || cause?.message?.includes('ECONNREFUSED')) return 'unreachable';
    }
    return 'unreachable';
  } finally {
    clearTimeout(timer!);
  }
}
