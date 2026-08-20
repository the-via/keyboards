import fs from 'fs-extra';
import {globSync} from 'glob';
import path from 'path';
import {getDefinitionsPath} from './get-path';

const LEGACY_LIGHTING_MODULE = 'qmk_lighting';
const EXPLICIT_LIGHTING_MODULES = [
  'qmk_backlight_keycodes',
  'qmk_rgblight_keycodes',
  'qmk_rgb_matrix_keycodes',
  'qmk_backlight_rgblight_keycodes',
];

const invalidDefinitions = globSync(getDefinitionsPath('v3'), {
  absolute: true,
}).flatMap((definitionPath) => {
  const definition = fs.readJSONSync(definitionPath) as {
    keycodes?: string[];
  };

  return definition.keycodes?.includes(LEGACY_LIGHTING_MODULE)
    ? [path.relative(process.cwd(), definitionPath)]
    : [];
});

if (invalidDefinitions.length > 0) {
  console.error(
    [
      `${LEGACY_LIGHTING_MODULE} is a legacy compatibility fallback and is not accepted in remote v3 definitions.`,
      `Use the lighting module or modules matching the keyboard firmware: ${EXPLICIT_LIGHTING_MODULES.join(', ')}.`,
      '',
      'Definitions using the legacy module:',
      ...invalidDefinitions.map((definitionPath) => `- ${definitionPath}`),
    ].join('\n'),
  );
  process.exit(1);
}

console.log('Validated v3 lighting keycode modules.');
