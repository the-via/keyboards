import * as glob from 'glob';
import * as rimraf from 'rimraf';
import {promisify} from 'bluebird';
import * as stringify from 'json-stringify-pretty-compact';
import * as fs from 'fs';

async function gen() {
  await promisify(rimraf)('dist/*');

  const definitions = glob
    .sync('src/**/*.json', {absolute: true})
    .map(f => ({f, json: require(f)}));

  definitions
    .map(({f, json}) => ({
      f: `${f.slice(0, -4)}v2.json`,
      json: {...json, layouts: {keymap: json.layouts.all}}
    }))
    .forEach(f => fs.writeFileSync(f.f, stringify(f.json)));
}

gen();
