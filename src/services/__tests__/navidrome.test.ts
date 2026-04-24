import { ping } from '../navidrome';

jest.mock('subsonic-api', () => {
  return jest.fn().mockImplementation(() => ({
    ping: jest.fn(),
  }));
});

import SubsonicAPI from 'subsonic-api';

const MockSubsonicAPI = SubsonicAPI as jest.MockedClass<typeof SubsonicAPI>;

function mockPing(impl: () => Promise<unknown>) {
  MockSubsonicAPI.mockImplementation(() => ({ ping: impl } as never));
}

describe('ping', () => {
  beforeEach(() => {
    MockSubsonicAPI.mockClear();
  });

  it('returns ok when server responds with status ok', async () => {
    mockPing(async () => ({ status: 'ok' }));
    const result = await ping('http://localhost:4534', 'admin', 'admin');
    expect(result).toBe('ok');
  });

  it('returns wrong-credentials when server returns error code 40', async () => {
    mockPing(async () => ({ status: 'failed', error: { code: 40, message: 'Wrong username or password' } }));
    const result = await ping('http://localhost:4534', 'admin', 'bad');
    expect(result).toBe('wrong-credentials');
  });

  it('returns wrong-credentials when server returns error code 41', async () => {
    mockPing(async () => ({ status: 'failed', error: { code: 41, message: 'Token auth not supported' } }));
    const result = await ping('http://localhost:4534', 'admin', 'bad');
    expect(result).toBe('wrong-credentials');
  });

  it('returns invalid-url when url is not parseable', async () => {
    const result = await ping('not a url', 'admin', 'admin');
    expect(result).toBe('invalid-url');
  });

  it('returns server-not-found when DNS lookup fails', async () => {
    mockPing(async () => {
      const err = new Error('fetch failed');
      (err as NodeJS.ErrnoException & { cause: Error }).cause = Object.assign(new Error('getaddrinfo ENOTFOUND'), { code: 'ENOTFOUND' });
      throw err;
    });
    const result = await ping('http://doesnotexist.invalid', 'admin', 'admin');
    expect(result).toBe('server-not-found');
  });

  it('returns unreachable when connection is refused', async () => {
    mockPing(async () => {
      const err = new Error('fetch failed');
      (err as NodeJS.ErrnoException & { cause: Error }).cause = Object.assign(new Error('connect ECONNREFUSED'), { code: 'ECONNREFUSED' });
      throw err;
    });
    const result = await ping('http://localhost:9', 'admin', 'admin');
    expect(result).toBe('unreachable');
  });

  it('returns timed-out when the request times out', async () => {
    mockPing(async () => {
      const err = new Error('The operation was aborted');
      err.name = 'AbortError';
      throw err;
    });
    const result = await ping('http://localhost:4534', 'admin', 'admin');
    expect(result).toBe('timed-out');
  });
});
