import stringify from 'json-stringify-pretty-compact';
import * as glob from 'glob';
import * as fs from 'fs';
import {getTheme, keyboardDefinitionV2ToVIADefinitionV2} from 'via-reader';

const viaAPIVersionV2 = '0.1.2';

export async function buildV2() {
  try {
    const paths = glob.sync('src/**/*.json', {absolute: true});

    const [v2Definitions] = [paths].map((paths) =>
      paths.map((f) => require(f))
    );

    const resV2 = {
      generatedAt: Date.now(),
      version: viaAPIVersionV2,
      theme: getTheme(),
      definitions: v2Definitions
        .map(keyboardDefinitionV2ToVIADefinitionV2)
        .reduce((p, n) => ({...p, [n.vendorProductId]: n}), {}),
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
