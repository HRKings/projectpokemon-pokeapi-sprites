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
    const isSpecies = speciesList.results.find((pokemon) => pokemon.name === pokeApiName);
    const isForm = formsList.results.find((pokemon) => pokemon.name === pokeApiName);

    let fileName = '';

    if (isSpecies) {
      fileName = (await pokedex.getPokemonSpeciesByName(isSpecies.name)).id.toString();
      console.log(`[SPC]: ${fileName} (${pokeApiName})`);
    } else if (isForm) {
      const form = await pokedex.getPokemonFormByName(isForm.name);
      const pokemon = await pokedex.getPokemonByName(form.pokemon.name);
      const species = await pokedex.getPokemonSpeciesByName(pokemon.species.name);

      fileName = `${species.id}${isForm.name.replace(species.name, '')}`;
      console.log(`[FRM]: ${fileName} (${pokeApiName})`);
    } else {
      except.push(`${key}|${pokeApiName}|${file}`);
      console.log(`Not found: ${pokeApiName}`);
      continue;
    }

    if (key.endsWith('-f')) {
      reverseMap[key] = `female-${fileName}`;
    } else {
      reverseMap[key] = fileName;
    }
  }

  fs.writeFileSync(`${reverseMapPath}/${file}.json`, JSON.stringify(reverseMap, null, 2));

  if (except.length !== 0) {
    fs.writeFileSync(`${reverseMapPath}/except/${file}.json`, JSON.stringify(except, null, 2));
  }
});
