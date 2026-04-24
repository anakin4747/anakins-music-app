import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PanResponder } from 'react-native';
import { MainMenu } from '../MainMenu';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: mockPush }),
}));

type PanResponderConfig = Parameters<typeof PanResponder.create>[0];
// keyed by the order PanResponder.create is called: queues=0, playlists=1, albums=2, servers=3
const capturedConfigs: PanResponderConfig[] = [];

beforeEach(() => {
  capturedConfigs.length = 0;
  jest.spyOn(PanResponder, 'create').mockImplementation((config) => {
    capturedConfigs.push(config);
    return { panHandlers: {} };
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

const SWIPE_LEFT = { dx: -80 };
const SWIPE_SHORT = { dx: -20 };

describe('MainMenu', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders the queues item', () => {
    render(<MainMenu />);
    expect(screen.getByTestId('menu-item-queues')).toHaveTextContent('queues');
  });

  it('renders the playlists item', () => {
    render(<MainMenu />);
    expect(screen.getByTestId('menu-item-playlists')).toHaveTextContent('playlists');
  });

  it('renders the albums item', () => {
    render(<MainMenu />);
    expect(screen.getByTestId('menu-item-albums')).toHaveTextContent('albums');
  });

  it('renders the servers item', () => {
    render(<MainMenu />);
    expect(screen.getByTestId('menu-item-servers')).toHaveTextContent('servers');
  });

  it('navigates to /queues when queues is pressed', () => {
    render(<MainMenu />);
    fireEvent.press(screen.getByTestId('menu-item-queues'));
    expect(mockPush).toHaveBeenCalledWith('/queues');
  });

  it('does not navigate when playlists is pressed', () => {
    render(<MainMenu />);
    fireEvent.press(screen.getByTestId('menu-item-playlists'));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('does not navigate when albums is pressed', () => {
    render(<MainMenu />);
    fireEvent.press(screen.getByTestId('menu-item-albums'));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('navigates to /servers when servers is pressed', () => {
    render(<MainMenu />);
    fireEvent.press(screen.getByTestId('menu-item-servers'));
    expect(mockPush).toHaveBeenCalledWith('/servers');
  });

  describe('swipe left', () => {
    it('navigates to /queues when queues is swiped left', () => {
      render(<MainMenu />);
      capturedConfigs[0].onPanResponderRelease?.({} as any, SWIPE_LEFT as any);
      expect(mockPush).toHaveBeenCalledWith('/queues');
    });

    it('does not navigate when queues swipe is too short', () => {
      render(<MainMenu />);
      capturedConfigs[0].onPanResponderRelease?.({} as any, SWIPE_SHORT as any);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('does not navigate when playlists is swiped left', () => {
      render(<MainMenu />);
      capturedConfigs[1].onPanResponderRelease?.({} as any, SWIPE_LEFT as any);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('does not navigate when albums is swiped left', () => {
      render(<MainMenu />);
      capturedConfigs[2].onPanResponderRelease?.({} as any, SWIPE_LEFT as any);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('navigates to /servers when servers is swiped left', () => {
      render(<MainMenu />);
      capturedConfigs[3].onPanResponderRelease?.({} as any, SWIPE_LEFT as any);
      expect(mockPush).toHaveBeenCalledWith('/servers');
    });
  });
});
