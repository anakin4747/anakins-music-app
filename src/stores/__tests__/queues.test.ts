import {
  addSongToQueue,
  getSongsInQueue,
  getPopulatedQueueCount,
  resetQueues,
} from '../queues';
import { SongItem } from '@/services/navidrome';

const song1: SongItem = { id: '1', title: 'Song One', track: 1, duration: 180 };
const song2: SongItem = { id: '2', title: 'Song Two', track: 2, duration: 200 };

beforeEach(() => {
  resetQueues();
});

describe('getSongsInQueue', () => {
  it('returns empty array for an empty queue', () => {
    expect(getSongsInQueue(1)).toEqual([]);
  });
});

describe('addSongToQueue', () => {
  it('adds a song to a queue and retrieves it', () => {
    addSongToQueue(1, song1);
    expect(getSongsInQueue(1)).toEqual([song1]);
  });

  it('queues for different indices are independent', () => {
    addSongToQueue(1, song1);
    addSongToQueue(2, song2);
    expect(getSongsInQueue(1)).toEqual([song1]);
    expect(getSongsInQueue(2)).toEqual([song2]);
  });

  it('appends multiple songs to the same queue', () => {
    addSongToQueue(1, song1);
    addSongToQueue(1, song2);
    expect(getSongsInQueue(1)).toEqual([song1, song2]);
  });
});

describe('getPopulatedQueueCount', () => {
  it('returns 0 when no queues have songs', () => {
    expect(getPopulatedQueueCount()).toBe(0);
  });

  it('returns 1 when only queue 1 has songs', () => {
    addSongToQueue(1, song1);
    expect(getPopulatedQueueCount()).toBe(1);
  });

  it('returns 2 when queues 1 and 2 have songs', () => {
    addSongToQueue(1, song1);
    addSongToQueue(2, song2);
    expect(getPopulatedQueueCount()).toBe(2);
  });
});
