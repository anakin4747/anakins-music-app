import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { MainMenu } from '../MainMenu';

describe('MainMenu', () => {
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
});
