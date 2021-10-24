/* eslint-disable no-underscore-dangle */
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);

export const generationsFilesPath = path.join(__dirname, '../data/generations');
export const parsedFilesPath = path.join(__dirname, '../data/parsed');
export const reverseMapPath = path.join(__dirname, '../data/reverseMap');
export const linksPath = path.join(__dirname, '../data/links');
export const imagesPath = path.join(__dirname, '../data/images');

export const projectPokemonCacheFile = path.join(__dirname, '../data/cache.json');

export const genFiles = [
  'gen1',
  'gen2',
  'gen3',
  'gen4',
  'gen5',
  'gen6',
  'gen7',
  'gen8',
  'lgpe',
];
