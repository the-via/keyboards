import stringify from 'json-stringify-pretty-compact';
import glob from 'glob';
import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import {promisify} from 'bluebird';
import {
  generateVIADefinitionV3LookupMap,
  getTheme,
  KeyboardDefinitionIndex,
} from 'via-reader';

const viaAPIVersionV3 = '3.0.0-beta';
const outputPath = 'dist/v3';

async function buildV3() {
  try {
    await promisify(rimraf)('dist/*');

    const paths = glob.sync('v3/**/*.json', {absolute: true});

    const [v3Definitions] = [paths].map((paths) =>
      paths.map((f) => require(f))
    );

    const definitions = generateVIADefinitionV3LookupMap(v3Definitions);

    const definitionIndex: KeyboardDefinitionIndex = {
      generatedAt: Date.now(),
      version: viaAPIVersionV3,
      theme: getTheme(),
      vendorProductIds: Object.keys(definitions),
    };

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }

    fs.writeFileSync(`${outputPath}/index.json`, stringify(definitionIndex));

    Object.values(definitions).forEach((definition) => {
      fs.writeFileSync(
        `${outputPath}/${definition.vendorProductId}.json`,
        stringify(definition)
      );
    });

    // Read all common-menus configurations asynchronously.
    const commonMenusFiles = glob.sync('common-menus/**.json');
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
        `${outputPath}/common-menus.json`,
        stringify(commonMenusJson)
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

buildV3();
