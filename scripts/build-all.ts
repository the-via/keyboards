import {rimraf} from 'rimraf';
import {buildNames} from './build-names';
import {buildDefinitions} from './build-definitions';
import fs from 'fs/promises';
import {clearErrorLog} from './error-log';
async function build() {
  try {
    await rimraf('dist');
    await clearErrorLog();
    await buildDefinitions();
    await buildNames();
  } catch (e) {
    fs.writeFile('./build-error.log', e.toString());
  }
}

build();
