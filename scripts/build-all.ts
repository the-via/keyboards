import {rimraf} from 'rimraf';
import {buildNames} from './build-names';
import {buildV3} from './build-v3';

async function build() {
  await rimraf('dist')

  await buildV3();
  await buildNames();
}

build();
