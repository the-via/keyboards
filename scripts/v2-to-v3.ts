import * as util from 'util';
import { KeyboardDefinitionV2 } from 'via-reader';
import * as fs from 'fs-extra';
import * as stringify from 'json-stringify-pretty-compact';

const VIA_DEFAULT_KEYCODES_V3 = Object.freeze([
  "via/default_keycodes"
]);

const VIA_DEFAULT_MENUS_V3 = Object.freeze([
  // "via/default_menus" ?
  "via/keymap",
  "via/layouts",
  "via/macros",
  "via/save_load"
]);

const glob = util.promisify(require('glob'));

async function convertV2ToV3() {
  const definitionFiles = await glob('src/!(v3)/**/*.json');
  const definitions: {
    path: string,
    json: KeyboardDefinitionV2
  }[] = definitionFiles.map((file: string) => {
    const definitionPath = file.replace(/src\//, '');

    return {
      path: definitionPath,
      json: require(`../${file}`)
    };
  });

  await fs.ensureDir('src/v2');
  await fs.ensureDir('src/v3');

  definitions.forEach((definition) => {
    const v3Definition = {
      ...definition.json,
      keycodes: VIA_DEFAULT_KEYCODES_V3,
      menus: VIA_DEFAULT_MENUS_V3,
    };

    try {
      fs.move(`src/${definition.path}`, `src/v2/${definition.path}`);
      fs.outputFile(`src/v3/${definition.path}`, stringify(v3Definition));
    } catch (e) {
      console.error(e);
    }
  });
}

convertV2ToV3();
