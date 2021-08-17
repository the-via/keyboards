import glob from 'glob';
import fs from 'fs';
import {
  KeyboardDefinitionV2,
  KeyboardDefinitionV3,
  VIADefinitionV2,
  VIADefinitionV3,
  DefinitionVersion,
} from 'via-reader';

export const buildIsolatedDefinitions = async <
  TInput extends KeyboardDefinitionV2 | KeyboardDefinitionV3,
  TOutput extends VIADefinitionV2 | VIADefinitionV3
>(
  version: DefinitionVersion,
  mapper: (definition: TInput) => TOutput
): Promise<[TOutput, string][]> => {
  const outputPath = `dist/${version}`;

  const globPath =
    version === DefinitionVersion.v2 ? 'src/**/*.json' : `${version}/**/*.json`;
  const paths = glob.sync(globPath, {absolute: true});
  const definitions: TInput[] = paths.map((f) => require(f));

  const viaDefinitions = definitions.map(mapper);

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  return viaDefinitions.map((definition) => {
    const path = `/${version}/${definition.vendorProductId}.json`;
    fs.writeFileSync(`dist${path}`, JSON.stringify(definition));
    return [definition, path];
  });
};
