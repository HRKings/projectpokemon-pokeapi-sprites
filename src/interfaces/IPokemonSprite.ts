export interface PokemonSpriteKind {
  default: string,
  shiny: string,
}

export interface PokemonSprite {
  front: PokemonSpriteKind,
  back: PokemonSpriteKind,
}
