import rimraf from 'rimraf';
import {promisify} from 'bluebird';
import {buildV2} from './build-v2';
import {buildV3} from './build-v3';

async function build() {
  await promisify(rimraf)('dist/*');

  await buildV2();
  await buildV3();
}

build();
