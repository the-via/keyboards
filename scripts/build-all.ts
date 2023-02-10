import {rimraf} from 'rimraf';
import {buildNames} from './build-names';
import {buildV3} from './build-v3';
import fs from 'fs/promises';
import {clearErrorLog} from './error-log';
async function build() {
  try {
    await rimraf('dist');
    await clearErrorLog();
    await buildV3();
    await buildNames();
  } catch (e) {
    fs.writeFile('./build-error.log', e.toString());
  }
}

build();
