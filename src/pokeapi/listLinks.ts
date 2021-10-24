/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */

import fs from 'fs';
import path from 'path';

import {
  genFiles, imagesPath, parsedFilesPath, linksPath,
} from '../utils.js';
import { PokemonSprite } from '../interfaces/IPokemonSprite.js';

interface Links {
  frontDefault: Record<string, string>,
  backDefault: Record<string, string>,
  frontShiny: Record<string, string>,
  backShiny: Record<string, string>,
}

const backDir = path.join(imagesPath, 'back');
const backFemaleDir = path.join(imagesPath, 'back/female');
const backShinyDir = path.join(imagesPath, 'back/shiny');
const backShinyFemaleDir = path.join(imagesPath, 'back/shiny/female');
const shinyDir = path.join(imagesPath, 'shiny');
const shinyFemaleDir = path.join(imagesPath, 'shiny/female');
const femaleDir = path.join(imagesPath, 'female');

function isDownloaded(fileName: string, isFemale: boolean, defaultPath: string, femalePath: string): boolean {
  return fs.existsSync(path.join(isFemale ? femalePath : defaultPath, `${fileName}.gif`));
}

genFiles.forEach(async (file) => {
  const rawData = fs.readFileSync(`${parsedFilesPath}/${file}.json`).toString();
  const data: Record<string, PokemonSprite> = JSON.parse(rawData);

  const linksFile: Links = {
    frontDefault: {},
    frontShiny: {},
    backDefault: {},
    backShiny: {},
  };

  for (const key in data) {
    const isFemale = key.startsWith('female-');
    const fileName = isFemale ? key.replace('female-', '') : key;

    if (data[key].front.default !== '' && !isDownloaded(fileName, isFemale, imagesPath, femaleDir)) {
      linksFile.frontDefault[key] = data[key].front.default;
    }

    if (data[key].front.shiny !== '' && !isDownloaded(fileName, isFemale, shinyDir, shinyFemaleDir)) {
      linksFile.frontShiny[key] = data[key].front.shiny;
    }

    if (data[key].back.default !== '' && !isDownloaded(fileName, isFemale, backDir, backFemaleDir)) {
      linksFile.backDefault[key] = data[key].back.default;
    }

    if (data[key].back.shiny !== '' && !isDownloaded(fileName, isFemale, backShinyDir, backShinyFemaleDir)) {
      linksFile.backShiny[key] = data[key].back.shiny;
    }
  }

  fs.writeFileSync(`${linksPath}/${file}.json`, JSON.stringify(linksFile, null, 2));
});
