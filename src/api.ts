export type Character = {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  gender: string;
  image: string;
  origin: { name: string };
  location: { name: string };
};

const BASE_URL = 'https://rickandmortyapi.com/api';

// shortcut: fetches only page 1 (20 items), add `?page=` + onEndReached when pagination is needed
export async function fetchCharacters(): Promise<Character[]> {
  const res = await fetch(`${BASE_URL}/character`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const json = await res.json();
  if (!Array.isArray(json?.results)) throw new Error('Unexpected response from server');
  return json.results;
}
