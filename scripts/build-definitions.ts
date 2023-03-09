import fs from 'fs-extra';
import {
  keyboardDefinitionV2ToVIADefinitionV2,
  getTheme,
  KeyboardDefinitionIndex,
  keyboardDefinitionV3ToVIADefinitionV3,
} from '@the-via/reader';
import stringify from 'json-stringify-pretty-compact';
import {buildIsolatedDefinitions} from './build-isolated-definitions';
import {getOutputPath} from './get-path';
import {hashJSON} from './hash-json';
import {ErrorLogger} from './error-log';
var packageJson = require('../package.json');

export async function buildDefinitions(logger: ErrorLogger) {
  const [v2Hash, v2DefinitionIds] = await buildIsolatedDefinitions(
    'v2',
    keyboardDefinitionV2ToVIADefinitionV2,
    logger
  );
  const [v3Hash, v3DefinitionIds, v3Definitions] =
    await buildIsolatedDefinitions(
      'v3',
      keyboardDefinitionV3ToVIADefinitionV3,
      logger
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

  if (!(await fs.exists(getOutputPath()))) {
    await fs.mkdir(getOutputPath());
  }
  await fs.writeFile(
    `${getOutputPath()}/supported_kbs.json`,
    stringify(supportedKbsJSON)
  );
  console.log(`Generated ${getOutputPath()}/supported_kbs.json`);

  await fs.writeFile(
    `${getOutputPath()}/hash.json`,
    stringify(
      hashJSON([
        v2Hash,
        v3Hash,
        {...supportedKbsJSON, ...{generatedAt: undefined}},
      ])
    )
  );
  console.log(`Generated ${getOutputPath()}/hash.json`);

  return v3Definitions;
}
