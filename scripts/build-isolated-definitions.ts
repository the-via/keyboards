import glob from 'glob';
import fs from 'fs';
import {
  KeyboardDefinitionV2,
  KeyboardDefinitionV3,
  VIADefinitionV2,
  VIADefinitionV3,
  DefinitionVersion,
} from '@the-via/reader';
import {ValidateFunction} from '@the-via/reader';
import {getDefinitionsPath, getOutputPath, getRelativePath} from './get-path';
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
  const definitions = paths.map((f) => [require(f), getRelativePath(f)]);

  // Map KeyboardDefinition to VIADefintion and valiate. Don't write invalid definitions.
  const validVIADefinitions = definitions
    .map(([definition, path]) => {
      try {
        return [mapper(definition), path];
      } catch (error) {
        throw new Error(`${version} definition invalid: ${path}\n` + error);
      }
    })
    .filter(([definition, path]) => {
      if (!validator(definition)) {
        throw new Error(`${version} definition invalid: ${path}`);
      }
      return true;
    });

  const IDsToPaths = validVIADefinitions.reduce((p, [definition, path]) => {
    const id = definition.vendorProductId;
    if (id in p) {
      p[id] = [...p[id], path];
      return {...p};
    } else {
      return {...p, [id]: [path]};
    }
  }, {} as any);

  const conflictingVIADefinitions = Object.keys(IDsToPaths)
    .filter((key) => IDsToPaths[key].length > 1)
    .map((key) => {
      const vendorID = (parseInt(key) >> 16).toString(16).padStart(4, '0');
      const productID = (parseInt(key) & 0xffff).toString(16).padStart(4, '0');
      return `Duplicate ID vendorId=0x${vendorID} productId=0x${productID} in:
        ${IDsToPaths[key].join(',\n')}`;
    });

  if (conflictingVIADefinitions.length) {
    throw new Error(
      `Duplicate vendor/product IDs: 
      ${conflictingVIADefinitions}`
    );
  }

  if (!fs.existsSync(getOutputPath())) {
    fs.mkdirSync(getOutputPath());
  }
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
  }

  const jsonHash = hashJSON(validVIADefinitions);
  const validIds: number[] = [];
  validVIADefinitions.map(([definition, path]) => {
    if (definition != undefined) {
      fs.writeFileSync(
        `${outputPath}/${definition.vendorProductId}.json`,
        JSON.stringify(definition)
      );
      validIds.push(definition.vendorProductId);
    }
  });
  return [jsonHash, validIds];
};
