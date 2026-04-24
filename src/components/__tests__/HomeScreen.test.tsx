import React from 'react';
import { render } from '@testing-library/react-native';
import { resetServerConfigs } from '@/stores/serverConfigs';

jest.mock('@/stores/serverConfigs', () => ({
  ...jest.requireActual('@/stores/serverConfigs'),
  compactServerConfigs: jest.fn(),
}));

jest.mock('@/components/MainMenu', () => ({
  MainMenu: () => null,
}));

let focusCallback: (() => void) | undefined;

jest.mock('expo-router', () => ({
  useFocusEffect: (cb: () => void) => { focusCallback = cb; },
}));

import HomeScreen from '../../../app/index';
import { compactServerConfigs } from '@/stores/serverConfigs';
const mockCompact = compactServerConfigs as jest.Mock;

describe('HomeScreen', () => {
  beforeEach(() => {
    resetServerConfigs();
    mockCompact.mockClear();
    focusCallback = undefined;
  });

  it('compacts server configs when the screen gains focus', () => {
    render(<HomeScreen />);
    focusCallback?.();
    expect(mockCompact).toHaveBeenCalledTimes(1);
  });
});
