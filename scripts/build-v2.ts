import stringify from 'json-stringify-pretty-compact';
import * as glob from 'glob';
import * as fs from 'fs';
import {getTheme, keyboardDefinitionV2ToVIADefinitionV2} from 'via-reader';
import process from 'process';
import path from 'path';
import {getDefinitionsPath, getOutputPath} from './get-path';

const viaAPIVersionV2 = '0.1.2';

export async function buildV2() {
  try {
    console.log(getDefinitionsPath());
    console.log(getOutputPath());
    const paths = glob.sync(getDefinitionsPath(), {absolute: true});
    console.log(path.resolve('./'));

    const [v2Definitions] = [paths].map((paths) =>
      paths.map((f) => require(f))
    );

    const resV2 = {
      generatedAt: Date.now(),
      version: viaAPIVersionV2,
      theme: getTheme(),
      definitions: v2Definitions
        .map(keyboardDefinitionV2ToVIADefinitionV2)
        .reduce((p, n) => {
          if (n.vendorProductId in p) {
            console.log(
              `Duplicate id found: ${n.name} collides with ${
                p[n.vendorProductId].name
              }`
            );
          }
          return {...p, [n.vendorProductId]: n};
        }, {} as any),
    };

    const outputPath = getOutputPath();
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }

    fs.writeFileSync(`${outputPath}/keyboards.v2.json`, stringify(resV2));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
