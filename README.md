# Project Pokemon Sprite Index to PokeAPI

As I was working on a project that needed animated sprites I needed a way to map the sprites to PokeAPI for ease of use of the API, so this project here began

## Using

The project has two commands:

```bash
pnpm run getsprites
```

This will download and cache the Project Pokemon Sprite Index HTML and crawl the cached version to extract all links from the images

```bash
pnpm run pokeapi
```

This command downloads the list of pokemon, pokemon forms and species from PokeAPI and maps all the possible animated GIFs to a format similar of the API

After running those two you will have a collection of JSON files containing the PokeAPI IDs mapped to the correct sprites (front, back, shiny and female)

### Downloading

A download images script is included via `pnpm run download`, if needed
