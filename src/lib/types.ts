import type { ChuckJoke } from './chuckApi';

export type JokeItem = {
  joke: ChuckJoke;
  fetchedAt: number; // bepaalt "oudste" in de app, niet created_at/updated_at
};
