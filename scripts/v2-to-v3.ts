import util from 'util';
import {KeyboardDefinitionV2} from 'via-reader';
import pickBy from 'lodash/pickBy';
import fs from 'fs-extra';
import stringify from 'json-stringify-pretty-compact';

const glob = util.promisify(require('glob'));

const VIA_DEFAULT_KEYCODES_V3 = Object.freeze(['via/default_keycodes']);

const VIA_DEFAULT_MENUS_V3 = Object.freeze([
  // "via/default_menus" ?
  'via/keymap',
  'via/layouts',
  'via/macros',
  'via/save_load',
]);

async function convertV2ToV3() {
  const definitionFiles = await glob('src/!(v2|v3)/**/*.json');
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
    const supportedJson = pickBy(definition.json, (_val, key) => {
      return [
        'customFeatures',
        'lighting',
        'name',
        'productId',
        'vendorId',
      ].some((unsupportedKey) => {
        return unsupportedKey !== key;
      });
    });

    const {name, vendorId, productId} = definition.json;

    const v3Definition = {
      name,
      vendorId,
      productId,
      keycodes: VIA_DEFAULT_KEYCODES_V3,
      menus: VIA_DEFAULT_MENUS_V3,
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
