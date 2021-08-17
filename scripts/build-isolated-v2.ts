import * as glob from 'glob';
import * as fs from 'fs';
import rimraf from 'rimraf';
import {promisify} from 'bluebird';
import {keyboardDefinitionV2ToVIADefinitionV2, getTheme} from 'via-reader';

const viaAPIVersionV2 = '2.0.0';

async function build() {
  try {
    await promisify(rimraf)('dist/*');

    const paths = glob.sync('src/**/*.json', {absolute: true});

    const v2Definitions = paths.map((f) => require(f));

    const resV2 = {
      generatedAt: Date.now(),
      version: viaAPIVersionV2,
      theme: getTheme(),
    };

    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }
    const viaDefinitionsV2 = v2Definitions.map(
      keyboardDefinitionV2ToVIADefinitionV2
    );
    viaDefinitionsV2.forEach((viaDefinitionV2) => {
      fs.writeFileSync(
        `dist/${viaDefinitionV2.vendorProductId}.json`,
        JSON.stringify(viaDefinitionV2)
      );
    });
    fs.writeFileSync(
      `dist/supported_kbs.json`,
      JSON.stringify({
        ...resV2,
        supportedKbs: viaDefinitionsV2.map((d) => d.vendorProductId),
      })
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

build();
