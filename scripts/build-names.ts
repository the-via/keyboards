import stringify from 'json-stringify-pretty-compact';
import * as glob from 'glob';
import * as fs from 'fs';
import {keyboardDefinitionV3ToVIADefinitionV3} from '@the-via/reader';
import process from 'process';
import {getDefinitionsPath, getOutputPath} from './get-path';
import {writeToErrorLog} from './error-log';

export async function buildNames() {
  try {
    const version = 'v3';
    const outputPath = `${getOutputPath()}`;
    const definitionsPath = getDefinitionsPath(version);
    const paths = glob.sync(definitionsPath, {absolute: true});
    const definitions = paths.map((f) => require(f));

    const names = definitions
      .map(keyboardDefinitionV3ToVIADefinitionV3)
      .reduce((p, n) => [...p, n.name], [])
      .sort();

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }

    fs.writeFileSync(`${outputPath}/keyboard_names.json`, stringify(names));
    console.log(`Generated ${outputPath}/keyboard_names.json`);
  } catch (error) {
    console.error(error);
    await writeToErrorLog(error);
    process.exit(1);
  }
}
