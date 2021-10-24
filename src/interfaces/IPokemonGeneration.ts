import { PokemonSprite } from './IPokemonSprite.js';

export interface PokemonGeneration {
  file: string,
  data: Record<string, PokemonSprite>
}
