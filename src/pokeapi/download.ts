/* eslint-disable prefer-destructuring */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-extraneous-dependencies */

import fs from 'fs';
import path from 'path';
import { Stream } from 'stream';

import axios from 'axios';

import { genFiles, imagesPath, parsedFilesPath } from '../utils.js';
import { PokemonSprite } from '../interfaces/IPokemonSprite.js';

async function downloadImage(url: string, imagePath: string) {
  if (fs.existsSync(imagePath)) {
    return null;
  }

  try {
    const response = await axios.request<Stream>({ url, responseType: 'stream' });

    return new Promise<void>((resolve, reject) => {
      response.data
        .pipe(fs.createWriteStream(imagePath))
        .on('finish', () => {
          console.info('The download finished for: ', url);

          resolve();
        })
        .on('error', (e: any) => {
          if (fs.existsSync(imagePath)) {
            console.error('Deleting file: ', imagePath);
            fs.rmSync(imagePath);
          }

          reject(e);
        });
    });
  } catch {
    console.error('Download failed for URL: ', url);
  }

  return null;
}

const backDir = path.join(imagesPath, 'back');
const backFemaleDir = path.join(imagesPath, 'back/female');
const backShinyDir = path.join(imagesPath, 'back/shiny');
const backShinyFemaleDir = path.join(imagesPath, 'back/shiny/female');
const shinyDir = path.join(imagesPath, 'shiny');
const shinyFemaleDir = path.join(imagesPath, 'shiny/female');
const femaleDir = path.join(imagesPath, 'female');

if (!fs.existsSync(imagesPath)) {
  fs.mkdirSync(imagesPath);
  fs.mkdirSync(backDir);
  fs.mkdirSync(backFemaleDir);
  fs.mkdirSync(backShinyDir);
  fs.mkdirSync(backShinyFemaleDir);
  fs.mkdirSync(shinyDir);
  fs.mkdirSync(shinyFemaleDir);
  fs.mkdirSync(femaleDir);
}

genFiles.forEach(async (file) => {
  const rawData = fs.readFileSync(`${parsedFilesPath}/${file}.json`).toString();
  const data: Record<string, PokemonSprite> = JSON.parse(rawData);

  for (const key in data) {
    const isFemale = key.startsWith('female-');
    const fileName = isFemale ? key.replace('female-', '') : key;

    if (!fs.existsSync(path.join(isFemale ? femaleDir : imagesPath, `${fileName}.gif`))) {
      console.log('Downloading images for: ', key);
    }

    if (data[key].front.default !== '') {
      await downloadImage(data[key].front.default, path.join(isFemale ? femaleDir : imagesPath, `${fileName}.gif`));
    }

    if (data[key].front.shiny !== '') {
      await downloadImage(data[key].front.shiny, path.join(isFemale ? shinyFemaleDir : shinyDir, `${fileName}.gif`));
    }

    if (data[key].back.default !== '') {
      await downloadImage(data[key].back.default, path.join(isFemale ? backFemaleDir : backDir, `${fileName}.gif`));
    }

    if (data[key].back.shiny !== '') {
      await downloadImage(data[key].back.shiny, path.join(isFemale ? backShinyFemaleDir : backShinyDir, `${fileName}.gif`));
    }
  }
});
