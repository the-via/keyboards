import rimraf from 'rimraf';
import {promisify} from 'bluebird';
import {buildNames} from './build-names';
import {buildV3} from './build-v3';

async function build() {
  await promisify(rimraf)('dist/*');

  await buildNames();
  await buildV3();
}

build();
