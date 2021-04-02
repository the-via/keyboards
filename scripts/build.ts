import stringify from 'json-stringify-pretty-compact';
import glob from 'glob';
import fs from 'fs';
import rimraf from 'rimraf';
import {promisify} from 'bluebird';
import {generateVIADefinitionV3LookupMap, getTheme} from 'via-reader';

const viaAPIVersionV2 = '0.1.2';

async function build() {
  try {
    await promisify(rimraf)('dist/*');

    const paths = glob.sync('src/**/*.json', {absolute: true});

    const [v3Definitions] = [paths].map(paths => paths.map(f => require(f)));

    const resV2 = {
      generatedAt: Date.now(),
      version: viaAPIVersionV2,
      theme: getTheme(),
      definitions: generateVIADefinitionV3LookupMap(v3Definitions)
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
