import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import ServersScreen from '../../../app/servers';
import { resetServerConfigs, getLastPingedServerConfig, setServerConfig, getServerConfig } from '@/stores/serverConfigs';

jest.mock('expo-router', () => ({
  useRouter: () => ({ back: jest.fn(), push: mockPush }),
  useLocalSearchParams: () => mockParams,
}));

const mockPush = jest.fn();
let mockParams: Record<string, string> = {};

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => children,
}));

let capturedOnSwipeLeft: (() => void) | undefined;

jest.mock('@/components/SwipeBackView', () => ({
  SwipeBackView: ({ children, onSwipeLeft }: { children: React.ReactNode; onSwipeLeft?: () => void }) => {
    capturedOnSwipeLeft = onSwipeLeft;
    return children;
  },
}));

jest.mock('@/services/navidrome', () => ({
  ping: jest.fn(),
}));

import { ping } from '@/services/navidrome';
const mockPing = ping as jest.MockedFunction<typeof ping>;

describe('ServersScreen', () => {
  beforeEach(() => {
    mockParams = {};
    mockPush.mockClear();
    capturedOnSwipeLeft = undefined;
    resetServerConfigs();
  });

  it('renders first server at the top', () => {
    render(<ServersScreen />);
    expect(screen.getByTestId('server-heading')).toHaveTextContent('first server');
  });

  it('does not render a list of servers', () => {
    render(<ServersScreen />);
    expect(screen.queryByTestId('server-item-1')).toBeNull();
  });

  it('renders the url label', () => {
    render(<ServersScreen />);
    expect(screen.getByTestId('server-url-label')).toHaveTextContent('url');
  });

  it('renders the url input', () => {
    render(<ServersScreen />);
    expect(screen.getByTestId('server-url-input')).toBeTruthy();
  });

  it('renders the usr label', () => {
    render(<ServersScreen />);
    expect(screen.getByTestId('server-usr-label')).toHaveTextContent('usr');
  });

  it('renders the usr input', () => {
    render(<ServersScreen />);
    expect(screen.getByTestId('server-usr-input')).toBeTruthy();
  });

  it('renders the passwd label', () => {
    render(<ServersScreen />);
    expect(screen.getByTestId('server-passwd-label')).toHaveTextContent('passwd');
  });

  it('renders the passwd input', () => {
    render(<ServersScreen />);
    expect(screen.getByTestId('server-passwd-input')).toBeTruthy();
  });

  it('renders the ping button', () => {
    render(<ServersScreen />);
    expect(screen.getByTestId('server-ping-button')).toHaveTextContent('ping');
  });

  describe('ping button validation', () => {
    it('shows url required when url is empty', async () => {
      render(<ServersScreen />);
      await act(async () => { fireEvent.press(screen.getByTestId('server-ping-button')); });
      expect(screen.getByTestId('server-log')).toHaveTextContent('url required');
    });

    it('shows usr required when usr is empty', async () => {
      render(<ServersScreen />);
      fireEvent.changeText(screen.getByTestId('server-url-input'), 'http://localhost:4534');
      await act(async () => { fireEvent.press(screen.getByTestId('server-ping-button')); });
      expect(screen.getByTestId('server-log')).toHaveTextContent('usr required');
    });

    it('shows passwd required when passwd is empty', async () => {
      render(<ServersScreen />);
      fireEvent.changeText(screen.getByTestId('server-url-input'), 'http://localhost:4534');
      fireEvent.changeText(screen.getByTestId('server-usr-input'), 'admin');
      await act(async () => { fireEvent.press(screen.getByTestId('server-ping-button')); });
      expect(screen.getByTestId('server-log')).toHaveTextContent('passwd required');
    });
  });

  describe('ping button results', () => {
    function fillForm() {
      fireEvent.changeText(screen.getByTestId('server-url-input'), 'http://localhost:4534');
      fireEvent.changeText(screen.getByTestId('server-usr-input'), 'admin');
      fireEvent.changeText(screen.getByTestId('server-passwd-input'), 'admin');
    }

    it('shows ping sent immediately when button pressed', async () => {
      let resolvePing!: (v: 'ok') => void;
      mockPing.mockReturnValue(new Promise((r) => { resolvePing = r; }));
      render(<ServersScreen />);
      fillForm();
      act(() => { fireEvent.press(screen.getByTestId('server-ping-button')); });
      expect(screen.getByTestId('server-log')).toHaveTextContent('ping sent');
      await act(async () => { resolvePing('ok'); });
    });

    it('appends a new ping sent on each press', async () => {
      let resolve1!: (v: 'ok') => void;
      let resolve2!: (v: 'ok') => void;
      mockPing
        .mockReturnValueOnce(new Promise((r) => { resolve1 = r; }))
        .mockReturnValueOnce(new Promise((r) => { resolve2 = r; }));
      render(<ServersScreen />);
      fillForm();
      act(() => { fireEvent.press(screen.getByTestId('server-ping-button')); });
      act(() => { fireEvent.press(screen.getByTestId('server-ping-button')); });
      const lines = screen.getAllByTestId('server-log-line');
      expect(lines).toHaveLength(2);
      expect(lines[0]).toHaveTextContent('ping sent');
      expect(lines[1]).toHaveTextContent('ping sent');
      await act(async () => { resolve1('ok'); resolve2('ok'); });
    });

    it('appends the result after its ping sent line', async () => {
      mockPing.mockResolvedValue('ok');
      render(<ServersScreen />);
      fillForm();
      await act(async () => { fireEvent.press(screen.getByTestId('server-ping-button')); });
      const lines = screen.getAllByTestId('server-log-line');
      expect(lines[0]).toHaveTextContent('ping sent');
      expect(lines[1]).toHaveTextContent('ping ok');
    });

    it('shows ping ok when ping returns ok', async () => {
      mockPing.mockResolvedValue('ok');
      render(<ServersScreen />);
      fillForm();
      await act(async () => { fireEvent.press(screen.getByTestId('server-ping-button')); });
      const lines = screen.getAllByTestId('server-log-line');
      expect(lines[lines.length - 1]).toHaveTextContent('ping ok');
    });

    it('shows wrong credentials when ping returns wrong-credentials', async () => {
      mockPing.mockResolvedValue('wrong-credentials');
      render(<ServersScreen />);
      fillForm();
      await act(async () => { fireEvent.press(screen.getByTestId('server-ping-button')); });
      const lines = screen.getAllByTestId('server-log-line');
      expect(lines[lines.length - 1]).toHaveTextContent('wrong credentials');
    });

    it('shows invalid url when ping returns invalid-url', async () => {
      mockPing.mockResolvedValue('invalid-url');
      render(<ServersScreen />);
      fillForm();
      await act(async () => { fireEvent.press(screen.getByTestId('server-ping-button')); });
      const lines = screen.getAllByTestId('server-log-line');
      expect(lines[lines.length - 1]).toHaveTextContent('invalid url');
    });

    it('shows server not found when ping returns server-not-found', async () => {
      mockPing.mockResolvedValue('server-not-found');
      render(<ServersScreen />);
      fillForm();
      await act(async () => { fireEvent.press(screen.getByTestId('server-ping-button')); });
      const lines = screen.getAllByTestId('server-log-line');
      expect(lines[lines.length - 1]).toHaveTextContent('server not found');
    });

    it('shows unreachable when ping returns unreachable', async () => {
      mockPing.mockResolvedValue('unreachable');
      render(<ServersScreen />);
      fillForm();
      await act(async () => { fireEvent.press(screen.getByTestId('server-ping-button')); });
      const lines = screen.getAllByTestId('server-log-line');
      expect(lines[lines.length - 1]).toHaveTextContent('unreachable');
    });

    it('shows timed out when ping returns timed-out', async () => {
      mockPing.mockResolvedValue('timed-out');
      render(<ServersScreen />);
      fillForm();
      await act(async () => { fireEvent.press(screen.getByTestId('server-ping-button')); });
      const lines = screen.getAllByTestId('server-log-line');
      expect(lines[lines.length - 1]).toHaveTextContent('timed out');
    });
  });

  it('renders a scroll view that dismisses the keyboard on tap outside the form', () => {
    render(<ServersScreen />);
    const scrollView = screen.getByTestId('server-scroll-view');
    expect(scrollView.props.keyboardShouldPersistTaps).toBe('handled');
  });

  it('does not constrain inner content to the scroll view height so the log can scroll', () => {
    render(<ServersScreen />);
    const scrollView = screen.getByTestId('server-scroll-view');
    expect(scrollView.props.contentContainerStyle).not.toMatchObject({ flex: 1 });
  });

  describe('index param', () => {
    it('shows second server when index is 2', () => {
      mockParams = { index: '2' };
      render(<ServersScreen />);
      expect(screen.getByTestId('server-heading')).toHaveTextContent('second server');
    });

    it('shows third server when index is 3', () => {
      mockParams = { index: '3' };
      render(<ServersScreen />);
      expect(screen.getByTestId('server-heading')).toHaveTextContent('third server');
    });

    it('swipe left pushes to the next server index', () => {
      mockParams = { index: '2' };
      render(<ServersScreen />);
      capturedOnSwipeLeft?.();
      expect(mockPush).toHaveBeenCalledWith({ pathname: '/servers', params: { index: 3 } });
    });

    it('swipe left from first server pushes to second server', () => {
      render(<ServersScreen />);
      capturedOnSwipeLeft?.();
      expect(mockPush).toHaveBeenCalledWith({ pathname: '/servers', params: { index: 2 } });
    });
  });

  describe('per-screen config', () => {
    it('server 1 and server 2 have independent url fields', () => {
      mockParams = { index: '1' };
      const { unmount } = render(<ServersScreen />);
      fireEvent.changeText(screen.getByTestId('server-url-input'), 'http://one');
      unmount();

      mockParams = { index: '2' };
      render(<ServersScreen />);
      expect(screen.getByTestId('server-url-input').props.value).toBe('');
    });

  });

  describe('last pinged server', () => {
    it('records the current server index when ping is pressed', async () => {
      mockPing.mockResolvedValue('ok');
      mockParams = { index: '2' };
      setServerConfig(2, { url: 'http://two', usr: 'u', passwd: 'p' });
      render(<ServersScreen />);
      await act(async () => { fireEvent.press(screen.getByTestId('server-ping-button')); });
      expect(getLastPingedServerConfig()?.url).toBe('http://two');
    });
  });
});
