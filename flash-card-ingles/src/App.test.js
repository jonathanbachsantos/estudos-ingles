import { render, screen } from '@testing-library/react';
import App from './App';

test('shows the Dino Code Lab option in the main menu', () => {
  render(<App />);

  expect(screen.getByRole('button', { name: /dino code lab/i })).toBeInTheDocument();
});
