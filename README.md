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

## Downloading

A download images script is included if needed

```bash
pnpm run download
```

### Folder structure

The folder structure generated is the same as the PokeAPI:

```
data/images           - The front facing sprites
├── shiny             - The front facing shiny sprites
│   └── female        - The front facing shiny female sprites
├── female            - The front facing female sprites
└─── back             - The back facing sprites
     ├── female       - The back facing female sprites
     └── shiny        - The back facing shiny sprites
         └── female   - The back facing shiny female sprites
```

### Reverse Map

If you want to download using another method a mapping of the file names coming from the Project Pokemon Sprite Index to the appropriate PokeAPI IDs is provided to aid into this scenario.

The command for making the reverse map is:

```bash
pnpm run reverse-map
```

### List of needed links

You can generate a list of the missing files (note that some files are 404 on Project Pokemon Sprite Index, despite being in the page)

```bash
pnpm run link-list
```
