import stringify from 'json-stringify-pretty-compact';
import fs from 'fs-extra';
import {DefinitionName, VIADefinitionV3} from '@the-via/reader';
import {getOutputPath} from './get-path';

const getDefinitionNames = (name: DefinitionName): string[] =>
  typeof name === 'string' ? [name] : name.options;

export async function buildNames(definitions: VIADefinitionV3[]) {
  const outputPath = `${getOutputPath()}`;

  const names = definitions
    .flatMap(({name}) => getDefinitionNames(name))
    .sort();

  if (!(await fs.exists(outputPath))) {
    await fs.mkdir(outputPath);
  }

  await fs.writeFile(`${outputPath}/keyboard_names.json`, stringify(names));
  console.log(`Generated ${outputPath}/keyboard_names.json`);
}
