import util from 'util';
import {
  defaultKeycodes,
  defaultMenus,
  KeyboardDefinitionV2,
  KeyboardDefinitionV3,
} from 'via-reader';
import fs from 'fs-extra';
import stringify from 'json-stringify-pretty-compact';

const glob = util.promisify(require('glob'));

const OMITTED_V2_KEYS = [
  'customFeatures',
  'lighting',
  'name',
  'productId',
  'vendorId',
] as const;

type SUPPORTED_V2_KEYS = Omit<
  KeyboardDefinitionV2,
  typeof OMITTED_V2_KEYS[number]
>;

async function convertV2ToV3() {
  const definitionFiles = await glob('src/**/*.json');
  const definitions: {
    path: string;
    json: KeyboardDefinitionV2;
  }[] = definitionFiles.map((file: string) => {
    const definitionPath = file.replace(/src\//, '');

    return {
      path: definitionPath,
      json: require(`../${file}`),
    };
  });

  await fs.ensureDir('v3');

  definitions.forEach((definition) => {
    // Strip all OMITTED_V2_KEYS from the JSON
    const supportedJson = Object.fromEntries(
      Object.entries(definition.json).filter(([key]) => {
        return !(OMITTED_V2_KEYS as readonly string[]).includes(key);
      })
    ) as SUPPORTED_V2_KEYS;

    const {name, vendorId, productId} = definition.json;

    const v3Definition: KeyboardDefinitionV3 = {
      name,
      vendorId,
      productId,
      keycodes: defaultKeycodes,
      menus: defaultMenus,
      ...supportedJson,
    };

    try {
      fs.outputFile(`v3/${definition.path}`, stringify(v3Definition));
    } catch (e) {
      console.error(e);
    }
  });
}

convertV2ToV3();
