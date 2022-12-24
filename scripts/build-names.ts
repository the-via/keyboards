import stringify from 'json-stringify-pretty-compact';
import * as glob from 'glob';
import * as fs from 'fs';
import {keyboardDefinitionV2ToVIADefinitionV2} from 'via-reader';
import process from 'process';
import path from 'path';
import {getDefinitionsPath, getOutputPath} from './get-path';

export async function buildNames() {
  try {
    const paths = glob.sync(getDefinitionsPath(), {absolute: true});
    let foundDuplicateId = false;
    console.log(path.resolve('./'));

    const [v2Definitions] = [paths].map((paths) =>
      paths.map((f) => require(f))
    );

    const resV2 = Object.values(
      v2Definitions
        .map(keyboardDefinitionV2ToVIADefinitionV2)
        .reduce((p, n) => {
          if (n.vendorProductId in p) {
            const isIdentical =
              JSON.stringify(p[n.vendorProductId]) === JSON.stringify(n);
            console.log(
              `Duplicate id found: ${n.name} collides with ${
                p[n.vendorProductId].name
              } and is${!isIdentical ? ' not' : ''} identical`
            );
            foundDuplicateId = true;
          }
          return {...p, [n.vendorProductId]: n};
        }, {} as any)
    )
      .map((d: any) => d.name)
      .sort();

    if (foundDuplicateId) {
      throw new Error('Found duplicate vendor & product id pair');
    }

    const outputPath = getOutputPath();
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }

    fs.writeFileSync(`${outputPath}/keyboard_names.json`, stringify(resV2));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
