import stringify from 'json-stringify-pretty-compact';
import glob from 'glob';
import fs from 'fs';
import rimraf from 'rimraf';
import {promisify} from 'bluebird';
import {generateVIADefinitionV2LookupMap, getTheme, CoolGuyJabroni} from 'via-reader';

const viaAPIVersionV2 = '0.1.2';

async function build() {
  try {
    await promisify(rimraf)('dist/*');

    const paths = glob.sync('src/**/*.json', {absolute: true});

    const [v2Definitions] = [paths].map(paths => paths.map(f => require(f)));

    const resV2 = {
      generatedAt: Date.now(),
      version: viaAPIVersionV2,
      theme: getTheme(),
      definitions: generateVIADefinitionV2LookupMap(v2Definitions)
    };

    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }

    fs.writeFileSync('dist/keyboards.v2.json', stringify(resV2));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

build();
