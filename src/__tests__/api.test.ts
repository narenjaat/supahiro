import { fetchCharacters } from '../api';

const mockFetch = (response: Partial<Response>) => {
  globalThis.fetch = jest.fn().mockResolvedValue(response) as unknown as typeof fetch;
};

describe('fetchCharacters', () => {
  it('returns the results array on success', async () => {
    const results = [{ id: 1, name: 'Rick Sanchez' }];
    mockFetch({ ok: true, json: async () => ({ results }) });
    await expect(fetchCharacters()).resolves.toEqual(results);
  });

  it('throws on a non-OK response', async () => {
    mockFetch({ ok: false, status: 500 });
    await expect(fetchCharacters()).rejects.toThrow('Request failed (500)');
  });

  it('throws when the payload has no results array', async () => {
    mockFetch({ ok: true, json: async () => ({}) });
    await expect(fetchCharacters()).rejects.toThrow('Unexpected response');
  });
});
