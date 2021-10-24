/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */

import fs from 'fs';
import PokeAPI from 'pokedex-promise-v2';

import { PokemonSprite } from '../interfaces/IPokemonSprite.js';
import { generationsFilesPath, reverseMapPath, genFiles } from '../utils.js';

const pokeApiReplaces: any[][] = [
  [/gigantamax$/, 'gmax'],
  ['raticate-totem', 'raticate-totem-alola'],
  [/-(.*)star$/, '-$1-star'],
  [/-kantocap$/, '-originalcap'],
  [/cap$/, '-cap'],
  [/megax$/, 'mega-x'],
  [/megay$/, 'mega-y'],
  [/-f$/, ''],
  [/-active$/, ''],
  [/^mr./, 'mr-'],
  [/_f$/, '-f'],
  [/_m$/, '-m'],
  [/(unown-\w).{0,7}/, '$1'],
  ['unown-iation', 'unown-question'],
  ['unown-eion', 'unown-exclamation'],
  [/_g6$/, ''],
  [/_jr$/, '-jr'],
  ['basculin-blue', 'basculin-blue-striped'],
  ['genesect-water', 'genesect-douse'],
  ['genesect-electric', 'genesect-shock'],
  ['genesect-fire', 'genesect-burn'],
  ['genesect-ice', 'genesect-chill'],
  ['vivillon-highplains', 'vivillon-high-plains'],
  ['vivillon-savannah', 'vivillon-savanna'],
  ['vivillon-pokeball', 'vivillon-poke-ball'],
  ['furfrou-lareine', 'furfrou-la-reine'],
  ['oricorio-pompom', 'oricorio-pom-pom'],
  ['typenull', 'type-null'],
  [/tapu(.*)/, 'tapu-$1'],
  [/^mimikyu-totem$/, 'mimikyu-totem-disguised'],
  [/(necrozma-.*)-.*/, '$1'],
  ['zeraora-stand', 'zeraora'],
  ['toxtricity-gmax', 'toxtricity-low-key-gmax'],
  ['mimejr.', 'mime-jr'],
  ['urshifu-gmax', 'urshifu-single-strike-gmax'],
  ['gigantamax-inteleon', 'inteleon-gmax'],
  [/^darmanitan-galar$/, 'darmanitan-standard-galar'],
  ['darmanitan-galar-zen', 'darmanitan-zen-galar'],
  ['eiscue-noice-face', 'eiscue-noice'],
  ['morpeko-hangry-mode', 'morpeko-hangry'],
  [/(.*-crowned)-.*/, '$1'],
];

const pokedex = new PokeAPI();

const pokemonList = await pokedex.getPokemonsList({ limit: 1500, offset: 0 });
const formsList = await pokedex.getPokemonFormsList({ limit: 1500, offset: 0 });
const speciesList = await pokedex.getPokemonSpeciesList({ limit: 898, offset: 0 });

function toPokeAPI(projectPokemonName: string) {
  let pokeApiPokemonName = projectPokemonName;

  for (const original of pokeApiReplaces) {
    pokeApiPokemonName = pokeApiPokemonName.replace(original[0], original[1]);
  }

  return pokeApiPokemonName;
}

genFiles.forEach(async (file) => {
  const rawData = fs.readFileSync(`${generationsFilesPath}/${file}.json`).toString();
  const data: Record<string, PokemonSprite> = JSON.parse(rawData);
  const reverseMap: Record<string, string> = {};
  const except: string[] = [];

  if (file === 'gen8') {
    data['toxtricity-amped-gmax'] = data['toxtricity-gigantamax'];
  }

  for (const key in data) {
    const pokeApiName = toPokeAPI(key).replaceAll('--', '-');

    let url: string = '';

    console.log(`Parsing ${key} (${pokeApiName}) from ${file}`);

    const isPokemon = pokemonList.results.find((pokemon) => pokemon.name === pokeApiName);
    const isForm = formsList.results.find((pokemon) => pokemon.name === pokeApiName);
    const isSpecies = speciesList.results.find((pokemon) => pokemon.name === pokeApiName);

    if (isPokemon) {
      url = isPokemon.url.toString();
    } else if (isForm) {
      url = isForm.url.toString();
    } else if (isSpecies) {
      url = isSpecies.url.toString();
    } else {
      except.push(`${key}|${pokeApiName}|${file}`);
      continue;
    }

    const id = url.split('/').reverse()[1];

    if (key.endsWith('-f')) {
      reverseMap[key] = `female-${id}`;
    } else {
      reverseMap[key] = id;
    }
  }

  fs.writeFileSync(`${reverseMapPath}/${file}.json`, JSON.stringify(reverseMap, null, 2));

  if (except.length !== 0) {
    fs.writeFileSync(`${reverseMapPath}/except/${file}.json`, JSON.stringify(except, null, 2));
  }
});

process.exit(0);
