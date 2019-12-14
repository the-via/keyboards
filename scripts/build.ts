import * as stringify from 'json-stringify-pretty-compact';
import * as glob from 'glob';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import {promisify} from 'bluebird';
import {
  generateVIADefinitionLookupMap,
  generateVIADefinitionV2LookupMap
} from 'via-reader';

const viaAPIVersionV1 = '0.0.1';
const viaAPIVersionV2 = '0.1.1';

async function build() {
  await promisify(rimraf)('dist/*');

  const paths = glob.sync('src/**/*.json', {absolute: true});
  const fileIsV2 = (path: string) => path.indexOf('v2.json') !== -1;
  const [v1Paths, v2Paths] = [
    paths.filter(path => !fileIsV2(path)),
    paths.filter(fileIsV2)
  ];

  const [v1Definitions, v2Definitions] = [v1Paths, v2Paths].map(paths =>
    paths.map(f => require(f))
  );

  const resV1 = {
    version: viaAPIVersionV1,
    generatedAt: Date.now(),
    definitions: generateVIADefinitionLookupMap(v1Definitions)
  };

  const resV2 = {
    version: viaAPIVersionV2,
    generatedAt: Date.now(),
    definitions: generateVIADefinitionV2LookupMap(v2Definitions)
  };

  try {
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }

    fs.writeFileSync('dist/keyboards.json', stringify(resV1));
    fs.writeFileSync('dist/keyboards.v2.json', stringify(resV2));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

build();
