import fs from 'fs';
import glob from 'glob';
import path from 'path';
import {
  keyboardDefinitionV2ToVIADefinitionV2,
  getTheme,
  KeyboardDefinitionIndex,
  keyboardDefinitionV3ToVIADefinitionV3,
  isVIADefinitionV2,
  isVIADefinitionV3,
} from 'via-reader';
import stringify from 'json-stringify-pretty-compact';
import {buildIsolatedDefinitions} from './build-isolated-definitions';
import {getCommonMenusPath, getOutputPath} from './get-path';
import {hashJSON} from './hash-json';
var packageJson = require('../package.json');

export async function buildV3() {
  try {
    const [v2Hash, v2DefinitionIds] = await buildIsolatedDefinitions(
      'v2',
      keyboardDefinitionV2ToVIADefinitionV2,
      isVIADefinitionV2
    );
    const [v3Hash, v3DefinitionIds] = await buildIsolatedDefinitions(
      'v3',
      keyboardDefinitionV3ToVIADefinitionV3,
      isVIADefinitionV3
    );

    const genTime = Date.now();

    const supportedKbsJSON: KeyboardDefinitionIndex = {
      generatedAt: genTime,
      version: packageJson.version,
      theme: getTheme(),
      vendorProductIds: {
        v2: v2DefinitionIds,
        v3: v3DefinitionIds.filter((vpid) => !v2DefinitionIds.includes(vpid)),
      },
    };

    fs.writeFileSync(
      `${getOutputPath()}/supported_kbs.json`,
      stringify(supportedKbsJSON)
    );

    // Read all common-menus configurations asynchronously.
    const commonMenusFiles = glob.sync(`${getCommonMenusPath()}/**.json`);
    const commonMenusJson = {} as Record<string, string>;
    const commonMenusReaders = commonMenusFiles.map((commonMenuFile) => {
      return fs.promises.readFile(commonMenuFile, 'utf8');
    });

    // Combine all common-menus configurations into a single core.json file
    Promise.all(commonMenusReaders).then((commonMenus) => {
      commonMenus.forEach((menu, i) => {
        // Parse out just the filename for the key:
        // common-menus/qmk_audio.json -> qmk_audio
        const fileName = path.parse(commonMenusFiles[i]).name;

        commonMenusJson[fileName] = JSON.parse(menu);
      });
      fs.writeFileSync(
        `${getOutputPath()}/common-menus.json`,
        stringify(commonMenusJson)
      );
      fs.writeFileSync(
        `${getOutputPath()}/hash.json`,
        stringify(
          hashJSON([
            v2Hash,
            v3Hash,
            commonMenusJson,
            {...supportedKbsJSON, ...{generatedAt: undefined}},
          ])
        )
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
