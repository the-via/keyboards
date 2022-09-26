import glob from 'glob';
import fs from 'fs';
import {
  KeyboardDefinitionV2,
  KeyboardDefinitionV3,
  VIADefinitionV2,
  VIADefinitionV3,
  DefinitionVersion,
} from 'via-reader';
import {ValidateFunction} from 'via-reader/dist/validated-types/via-definition-v3.validator';
import {getDefinitionsPath, getOutputPath} from './get-path';
import {hashJSON} from './hash-json';
/**
 * Builds keyboard definitions into separate valid VIA definitions
 * @param {DefinitionVersion} version definition version
 * @param {(definition: TInput) => TOutput} mapper keyboard-to-via definition mapper
 * @param {ValidateFunction<TOutput>} validator via definition validator
 * @returns {number[]} vendorProductIds for all valid built definitions
 * */
export const buildIsolatedDefinitions = async <
  TInput extends KeyboardDefinitionV2 | KeyboardDefinitionV3,
  TOutput extends VIADefinitionV2 | VIADefinitionV3
>(
  version: DefinitionVersion,
  mapper: (definition: TInput) => TOutput,
  validator: ValidateFunction<TOutput>
): Promise<[string, number[]]> => {
  const outputPath = `${getOutputPath()}/${version}`;
  const definitionsPath = getDefinitionsPath(version);
  const paths = glob.sync(definitionsPath, {absolute: true});
  const definitions: TInput[] = paths.map((f) => require(f));

  // Map KeyboardDefinition to VIADefintion and valiate. Don't write invalid definitions.
  const validVIADefinitions = definitions.map(mapper).filter((definition) => {
    if (!validator(definition)) {
      // TODO: Replace warn with new Error() after all definitions are working
      console.warn(
        `WARN: ${version} definition invalid: ${(<any>definition).name}`
      );
      return false;
    }
    return true;
  });

  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  const jsonHash = hashJSON(validVIADefinitions);
  const validIds = validVIADefinitions.map((definition) => {
    fs.writeFileSync(
      `${outputPath}/${definition.vendorProductId}.json`,
      JSON.stringify(definition)
    );
    return definition.vendorProductId;
  });
  return [jsonHash, validIds];
};
