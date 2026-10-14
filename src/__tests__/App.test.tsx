import { fireEvent, render, screen } from '@testing-library/react-native';
import App from '../../App';

const rick = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  gender: 'Male',
  image: 'https://example.com/rick.png',
  origin: { name: 'Earth (C-137)' },
  location: { name: 'Citadel of Ricks' },
};

const mockFetch = (response: Partial<Response>) => {
  globalThis.fetch = jest.fn().mockResolvedValue(response) as unknown as typeof fetch;
};

it('shows the list, then the detail screen on tap', async () => {
  mockFetch({ ok: true, json: async () => ({ results: [rick] }) });
  await render(<App />);
  await fireEvent.press(await screen.findByText('Rick Sanchez'));
  expect(await screen.findByText('Citadel of Ricks')).toBeTruthy();
});

it('shows an error with Retry when the request fails', async () => {
  mockFetch({ ok: false, status: 500 });
  await render(<App />);
  expect(await screen.findByText('Request failed (500)')).toBeTruthy();
  expect(screen.getByText('Retry')).toBeTruthy();
});
