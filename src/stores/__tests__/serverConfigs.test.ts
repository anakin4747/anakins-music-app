import {
  getServerConfig,
  setServerConfig,
  compactServerConfigs,
  resetServerConfigs,
} from '../serverConfigs';

beforeEach(() => {
  resetServerConfigs();
});

describe('getServerConfig', () => {
  it('returns empty strings for an index with no config', () => {
    expect(getServerConfig(1)).toEqual({ url: '', usr: '', passwd: '' });
  });

  it('returns the stored config for a given index', () => {
    setServerConfig(1, { url: 'http://a', usr: 'u', passwd: 'p' });
    expect(getServerConfig(1)).toEqual({ url: 'http://a', usr: 'u', passwd: 'p' });
  });
});

describe('setServerConfig', () => {
  it('configs for different indices are independent', () => {
    setServerConfig(1, { url: 'http://one' });
    setServerConfig(2, { url: 'http://two' });
    expect(getServerConfig(1).url).toBe('http://one');
    expect(getServerConfig(2).url).toBe('http://two');
  });

  it('merges partial updates', () => {
    setServerConfig(1, { url: 'http://a', usr: 'u', passwd: 'p' });
    setServerConfig(1, { usr: 'new-u' });
    expect(getServerConfig(1)).toEqual({ url: 'http://a', usr: 'new-u', passwd: 'p' });
  });
});

describe('compactServerConfigs', () => {
  it('removes gaps left by empty server forms', () => {
    setServerConfig(1, { url: '', usr: '', passwd: '' });
    setServerConfig(2, { url: 'http://two', usr: 'u', passwd: 'p' });
    compactServerConfigs();
    expect(getServerConfig(1).url).toBe('http://two');
    expect(getServerConfig(2)).toEqual({ url: '', usr: '', passwd: '' });
  });

  it('preserves relative order of populated configs', () => {
    setServerConfig(1, { url: 'http://one', usr: 'u1', passwd: 'p1' });
    setServerConfig(2, { url: '', usr: '', passwd: '' });
    setServerConfig(3, { url: 'http://three', usr: 'u3', passwd: 'p3' });
    compactServerConfigs();
    expect(getServerConfig(1).url).toBe('http://one');
    expect(getServerConfig(2).url).toBe('http://three');
    expect(getServerConfig(3)).toEqual({ url: '', usr: '', passwd: '' });
  });

  it('is a no-op when there are no gaps', () => {
    setServerConfig(1, { url: 'http://one', usr: 'u', passwd: 'p' });
    compactServerConfigs();
    expect(getServerConfig(1).url).toBe('http://one');
  });
});
