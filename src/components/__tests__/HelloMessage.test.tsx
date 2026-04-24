import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { HelloMessage } from '../HelloMessage';

describe('HelloMessage', () => {
  it('renders the name in the title', () => {
    render(<HelloMessage name="anakin" />);
    expect(screen.getByTestId('hello-title')).toHaveTextContent('hello, anakin!');
  });

  it('renders the subtitle', () => {
    render(<HelloMessage name="anakin" />);
    expect(screen.getByTestId('hello-subtitle')).toHaveTextContent(
      'your music player is warming up...'
    );
  });

  it('renders different names', () => {
    render(<HelloMessage name="Padme" />);
    expect(screen.getByTestId('hello-title')).toHaveTextContent('hello, Padme!');
  });
});
