import util from 'util';
// import {KeyboardDefinitionV2, KeyboardDefinitionV3} from 'via-reader';
import {KeyboardDefinitionV2} from 'via-reader';
import fs from 'fs-extra';
import stringify from 'json-stringify-pretty-compact';

const glob = util.promisify(require('glob'));


const VIA_DEFAULT_KEYCODES_V3 = [
  'via/default_keycodes',
];

const VIA_DEFAULT_MENUS_V3 = [
  // "via/default_menus" ?
  'via/keymap',
  'via/layouts',
  'via/macros',
  'via/save_load',
];

// const VIA_DEFAULT_KEYCODES: KeyboardDefinitionV3['keycodes'] = {
const VIA_DEFAULT_KEYCODES = {
  keycodes: VIA_DEFAULT_KEYCODES_V3,
  menu: VIA_DEFAULT_MENUS_V3
};

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
    const omittedKeys = [
      'customFeatures',
      'lighting',
      'name',
      'productId',
      'vendorId',
    ];

    const supportedJson = Object.entries(definition.json).reduce((res, [key, val]) => {
      if (omittedKeys.includes(key)) return res;
      res[key] = val;
      return res;
    }, {});


    const {name, vendorId, productId} = definition.json;

    // const v3Definition: KeyboardDefinitionV3 = {
    const v3Definition = {
      name,
      vendorId,
      productId,
      ...VIA_DEFAULT_KEYCODES,
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
