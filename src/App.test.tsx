import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Calendar when App loads', () => {
  render(<App />);
});
