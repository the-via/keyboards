import * as glob from 'glob';
import * as fs from 'fs';
import rimraf from 'rimraf';
import {promisify} from 'bluebird';
import {
  keyboardDefinitionV2ToVIADefinitionV2,
  getTheme,
  KeyboardDefinitionIndex,
} from 'via-reader';

const viaAPIVersionV2 = '2.0.0';
const outputPath = 'dist/v2';

async function build() {
  try {
    await promisify(rimraf)(`${outputPath}/*'`);

    const paths = glob.sync('src/**/*.json', {absolute: true});

    const v2Definitions = paths.map((f) => require(f));

    const viaDefinitionsV2 = v2Definitions.map(
      keyboardDefinitionV2ToVIADefinitionV2
    );

    const resV2: KeyboardDefinitionIndex = {
      generatedAt: Date.now(),
      version: viaAPIVersionV2,
      theme: getTheme(),
      vendorProductIds: viaDefinitionsV2.map((d) => d.vendorProductId),
    };

    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }

    fs.writeFileSync(`${outputPath}/supported_kbs.json`, JSON.stringify(resV2));

    viaDefinitionsV2.forEach((viaDefinitionV2) => {
      fs.writeFileSync(
        `${outputPath}/${viaDefinitionV2.vendorProductId}.json`,
        JSON.stringify(viaDefinitionV2)
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

build();
