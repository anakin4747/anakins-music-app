import { SongItem } from '@/services/navidrome';

const queues = new Map<number, SongItem[]>();

export function addSongToQueue(queueIndex: number, song: SongItem): void {
  const existing = queues.get(queueIndex) ?? [];
  queues.set(queueIndex, [...existing, song]);
}

export function getSongsInQueue(queueIndex: number): SongItem[] {
  return queues.get(queueIndex) ?? [];
}

export function getPopulatedQueueCount(): number {
  return [...queues.values()].filter((songs) => songs.length > 0).length;
}

/** For use in tests only. */
export function resetQueues(): void {
  queues.clear();
}
