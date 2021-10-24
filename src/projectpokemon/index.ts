/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */

import fs from 'fs';

import cheerio from 'cheerio';
import axios from 'axios';

import { PokemonSprite } from '../interfaces/IPokemonSprite.js';
import { generationsFilesPath, projectPokemonCacheFile } from '../utils.js';

const projectPokemonPages: Record<string, string> = {
  gen1: 'https://projectpokemon.org/home/docs/spriteindex_148/3d-models-generation-1-pok%C3%A9mon-r90/',
  gen2: 'https://projectpokemon.org/home/docs/spriteindex_148/3d-models-generation-2-pok%C3%A9mon-r91/',
  gen3: 'https://projectpokemon.org/home/docs/spriteindex_148/3d-models-generation-3-pok%C3%A9mon-r92/',
  gen4: 'https://projectpokemon.org/home/docs/spriteindex_148/3d-models-generation-4-pok%C3%A9mon-r93/',
  gen5: 'https://projectpokemon.org/home/docs/spriteindex_148/3d-models-generation-5-pok%C3%A9mon-r94/',
  gen6: 'https://projectpokemon.org/home/docs/spriteindex_148/3d-models-generation-6-pok%C3%A9mon-r95/',
  gen7: 'https://projectpokemon.org/home/docs/spriteindex_148/3d-models-generation-7-pok%C3%A9mon-r96/',
  gen8: 'https://projectpokemon.org/home/docs/spriteindex_148/3d-models-generation-8-pok%C3%A9mon-r123/',
  lgpe: 'https://projectpokemon.org/home/docs/spriteindex_148/lgpe-models-r111/',
};

const isCacheAvailable = fs.existsSync(projectPokemonCacheFile);
let cache: Record<string, string> = {};

if (isCacheAvailable) {
  const rawData = fs.readFileSync(projectPokemonCacheFile).toString();
  cache = JSON.parse(rawData);
} else {
  for (const key in projectPokemonPages) {
    const { data } = await axios.get<string>(projectPokemonPages[key]);

    cache[key] = data;
  }

  fs.writeFileSync(projectPokemonCacheFile, JSON.stringify(cache, null, 2));
}

for (const key in projectPokemonPages) {
  const images: Record<string, PokemonSprite> = {};
  const $ = cheerio.load(cache[key]);

  $('table > tbody > tr > td > img').each((_, el) => {
    const { src } = el.attribs;
    const pathSplit = src.split('/').reverse();
    let pokemonName = pathSplit[0].replace('.gif', '').replace('mr._', 'mr.');

    if (src.includes('lgswitch')) {
      pokemonName = pokemonName.replace('-shiny', '');
    }

    const kind = src.includes('shiny') ? 'shiny' : 'default';
    const facing = src.includes('back') ? 'back' : 'front';

    if (images[pokemonName]) {
      images[pokemonName][facing]![kind] = src;
    } else {
      images[pokemonName] = {
        front: {
          default: src,
          shiny: '',
        },
        back: {
          default: '',
          shiny: '',
        },
      };
    }
  });

  fs.writeFileSync(`${generationsFilesPath}/${key}.json`, JSON.stringify(images, null, 2));
}
