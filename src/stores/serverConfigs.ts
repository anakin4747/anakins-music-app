export interface ServerConfig {
  url: string;
  usr: string;
  passwd: string;
}

const configs = new Map<number, ServerConfig>();

export function getServerConfig(index: number): ServerConfig {
  return configs.get(index) ?? { url: '', usr: '', passwd: '' };
}

export function setServerConfig(index: number, config: Partial<ServerConfig>): void {
  const existing = getServerConfig(index);
  configs.set(index, { ...existing, ...config });
}

export function compactServerConfigs(): void {
  const populated = [...configs.values()].filter((c) => c.url || c.usr || c.passwd);
  configs.clear();
  populated.forEach((c, i) => configs.set(i + 1, c));
}

/** For use in tests only. */
export function resetServerConfigs(): void {
  configs.clear();
}
