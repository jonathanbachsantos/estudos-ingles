import { render, screen } from '@testing-library/react';
import App from './App';

test('shows the available practice games in the main menu', () => {
  render(<App />);

  expect(screen.getByRole('button', { name: /dino code lab/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /lâmpadas mágicas do binário/i })).toBeInTheDocument();
});
