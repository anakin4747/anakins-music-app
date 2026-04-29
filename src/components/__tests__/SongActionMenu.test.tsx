import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PanResponder } from 'react-native';
import { SongActionMenu } from '../SongActionMenu';
import { SongItem } from '@/services/navidrome';
import { resetQueues, getSongsInQueue } from '@/stores/queues';

const song: SongItem = { id: '42', title: 'Test Song', track: 3, duration: 210 };

type PanResponderConfig = Parameters<typeof PanResponder.create>[0];
let capturedConfig: PanResponderConfig = {};

beforeEach(() => {
  resetQueues();
  jest.spyOn(PanResponder, 'create').mockImplementation((config) => {
    capturedConfig = config;
    return { panHandlers: {} };
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('SongActionMenu', () => {
  it('renders the menu container', () => {
    render(<SongActionMenu song={song} onClose={jest.fn()} populatedQueueCount={0} />);
    expect(screen.getByTestId('song-action-menu')).toBeTruthy();
  });

  it('shows only "first queue" button when no queues are populated', () => {
    render(<SongActionMenu song={song} onClose={jest.fn()} populatedQueueCount={0} />);
    expect(screen.getByTestId('add-to-queue-1')).toBeTruthy();
    expect(screen.queryByTestId('add-to-queue-2')).toBeNull();
  });

  it('shows "first queue" and "second queue" when 1 queue is populated', () => {
    render(<SongActionMenu song={song} onClose={jest.fn()} populatedQueueCount={1} />);
    expect(screen.getByTestId('add-to-queue-1')).toBeTruthy();
    expect(screen.getByTestId('add-to-queue-2')).toBeTruthy();
    expect(screen.queryByTestId('add-to-queue-3')).toBeNull();
  });

  it('shows three queue buttons when 2+ queues are populated', () => {
    render(<SongActionMenu song={song} onClose={jest.fn()} populatedQueueCount={2} />);
    expect(screen.getByTestId('add-to-queue-1')).toBeTruthy();
    expect(screen.getByTestId('add-to-queue-2')).toBeTruthy();
    expect(screen.getByTestId('add-to-queue-3')).toBeTruthy();
  });

  it('button label shows ordinal queue name', () => {
    render(<SongActionMenu song={song} onClose={jest.fn()} populatedQueueCount={0} />);
    expect(screen.getByTestId('add-to-queue-1')).toHaveTextContent('first queue');
  });

  it('adds song to queue and calls onClose when button tapped', () => {
    const onClose = jest.fn();
    render(<SongActionMenu song={song} onClose={onClose} populatedQueueCount={0} />);
    fireEvent.press(screen.getByTestId('add-to-queue-1'));
    expect(getSongsInQueue(1)).toEqual([song]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('adds song to second queue when second button tapped', () => {
    const onClose = jest.fn();
    render(<SongActionMenu song={song} onClose={onClose} populatedQueueCount={1} />);
    fireEvent.press(screen.getByTestId('add-to-queue-2'));
    expect(getSongsInQueue(2)).toEqual([song]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when swiped right', () => {
    const onClose = jest.fn();
    render(<SongActionMenu song={song} onClose={onClose} populatedQueueCount={0} />);
    capturedConfig.onPanResponderRelease?.({} as any, { dx: 80 } as any);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
