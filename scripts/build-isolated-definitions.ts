import glob from 'glob';
import fs from 'fs-extra';
import {
  KeyboardDefinitionV2,
  KeyboardDefinitionV3,
  VIADefinitionV2,
  VIADefinitionV3,
  DefinitionVersion,
} from '@the-via/reader';
import {getDefinitionsPath, getOutputPath, getRelativePath} from './get-path';
import {hashJSON} from './hash-json';
import {ErrorLogger} from './error-log';
/**
 * Builds keyboard definitions into separate valid VIA definitions
 * @param {DefinitionVersion} version definition version
 * @param {(definition: TInput) => TOutput} mapper keyboard-to-via definition mapper
 * @returns {number[]} vendorProductIds for all valid built definitions
 * */

type ConvertedDefinition<T> = {
  viaDefinition: T;
  path: string;
};

export const buildIsolatedDefinitions = async <
  TInput extends KeyboardDefinitionV2 | KeyboardDefinitionV3,
  TOutput extends VIADefinitionV2 | VIADefinitionV3
>(
  version: DefinitionVersion,
  mapper: (definition: TInput) => TOutput,
  logger: ErrorLogger
): Promise<[string, number[], ConvertedDefinition<TOutput>[]]> => {
  const outputPath = `${getOutputPath()}/${version}`;
  const definitionsPath = getDefinitionsPath(version);
  const paths = glob.sync(definitionsPath, {absolute: true});
  const definitions = paths.map((f) => ({
    keyboardDefinition: require(f) as TInput,
    path: getRelativePath(f),
  }));

  const isValidConvertedDefinition = (
    def: ConvertedDefinition<TOutput> | undefined
  ): def is ConvertedDefinition<TOutput> => !!def;

  // Map KeyboardDefinition to VIADefintion and valiate. Don't write invalid definitions.
  const validVIADefinitions = definitions
    .map(({keyboardDefinition, path}) => {
      try {
        const viaDefinition = mapper(keyboardDefinition);
        return {viaDefinition, path};
      } catch (error) {
        logger.logError(
          new Error(`${version} definition invalid: ${path}\n` + error)
        );
      }
    })
    .filter(isValidConvertedDefinition);

  const IDsToPaths = validVIADefinitions.reduce((p, {viaDefinition, path}) => {
    const id = viaDefinition.vendorProductId;
    if (id in p) {
      p[id] = [...p[id], path];
      return {...p};
    } else {
      return {...p, [id]: [path]};
    }
  }, {} as any);

  Object.keys(IDsToPaths)
    .filter((key) => IDsToPaths[key].length > 1)
    .map((key) => {
      const vendorID = (parseInt(key) >> 16).toString(16).padStart(4, '0');
      const productID = (parseInt(key) & 0xffff).toString(16).padStart(4, '0');
      logger.logError(
        new Error(`Duplicate ID vendorId=0x${vendorID} productId=0x${productID} in:
      ${IDsToPaths[key].join(',\n')}`)
      );
    });

  if (!(await fs.exists(getOutputPath()))) {
    await fs.mkdir(getOutputPath());
  }
  if (!(await fs.exists(outputPath))) {
    await fs.mkdir(outputPath);
  }

  const jsonHash = hashJSON(validVIADefinitions);
  const validIds: number[] = [];
  await Promise.all(
    validVIADefinitions.map(async ({viaDefinition}) => {
      if (viaDefinition != undefined) {
        await fs.writeFile(
          `${outputPath}/${viaDefinition.vendorProductId}.json`,
          JSON.stringify(viaDefinition)
        );
        validIds.push(viaDefinition.vendorProductId);
      }
    })
  );
  return [jsonHash, validIds.sort(), validVIADefinitions];
};
