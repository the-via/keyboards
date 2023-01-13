import util from 'util';
import {
  BuiltInKeycodeModule,
  CustomLightingTypeDefinition,
  defaultKeycodes,
  KeyboardDefinitionV2,
  KeyboardDefinitionV3,
  KeycodeType,
  LightingTypeDefinition,
  LightingTypeDefinitionV2,
  VIAMenu,
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

const isLightingTypeDefinition = (
  lighting: LightingTypeDefinitionV2
): lighting is LightingTypeDefinition => typeof lighting === 'string';

const isCustomLightingTypeDefinition = (
  lighting: LightingTypeDefinitionV2
): lighting is CustomLightingTypeDefinition => typeof lighting !== 'string';

// Unique values for CustomLightingTypeDefinition properties in existing v2 json

// keycodes
// --------
// qmk

// extends
// -------
// qmk_rgblight
// none
// wt_rgb_backlight
// wt_mono_backlight

// effects
// -------
// {All Off 0, Solid Color 1 1, Custom Colors 10, Gradient Vertical Color 1/2 2...}
// {None 1, All 1, Raindrops 1}

// underglowEffects
// ----------------
// {All Off 0, Solid Color 1 1, Breathing 1 1, Breathing 2 1...}
// {None 0, SOLID_COLOR 1, GRADIENT_UP_DOWN 1, GRADIENT_LEFT_RIGHT 1...}
// {None 0, SOLID_COLOR 1, ALPHA_MODS 1, GRADIENT_UP_DOWN 1...}
// {All Off 0, Solid Color 1, Solid - Highlighted Mods 1, Vertical Gradient 1...}
// {All Off 0, Solid Color 1, Breathing 1 1, Breathing 2 1...}

// supportedLightingValues
// -----------------------
// {128, 129, 131}
// {9, 10, 11, 12...}
// {7, 8, 9, 10...}
// {1, 2, 3, 4...}
// {1, 7, 8, 9...}
// {7, 8, 9, 10...}

const mapLightingKeycodes = (
  lightingType: LightingTypeDefinition
): BuiltInKeycodeModule[] => {
  switch (lightingType) {
    case LightingTypeDefinition.QMKLighting:
    case LightingTypeDefinition.QMKRGBLight:
    case LightingTypeDefinition.QMKBacklightRGBLight:
      return [BuiltInKeycodeModule.QMKLighting];
    case LightingTypeDefinition.WTRGBBacklight:
    case LightingTypeDefinition.WTMonoBacklight:
      return [BuiltInKeycodeModule.WTLighting];
    case LightingTypeDefinition.None:
      return [];
  }
};

const resolveKeycodes = (
  lighting: LightingTypeDefinitionV2
): BuiltInKeycodeModule[] => {
  if (isCustomLightingTypeDefinition(lighting)) {
    return lighting.keycodes === KeycodeType.QMK // Found no instances of 'WT' or 'None' in existing data
      ? [...defaultKeycodes, BuiltInKeycodeModule.QMKLighting]
      : [...defaultKeycodes, ...mapLightingKeycodes(lighting.extends)];
  }

  if (isLightingTypeDefinition(lighting)) {
    return [...defaultKeycodes, ...mapLightingKeycodes(lighting)];
  }

  return defaultKeycodes;
};

enum coreMenus {
  QMKRGBLight = 'qmk_rgblight',
  QMKBacklight = 'qmk_backlight',
  QMKBacklightRGBLight = 'qmk_backlight_rgblight'
}

const WilbaPlsHalp = '!!!WILBA!!!';

const mapLightingMenus = (
  lightingType: LightingTypeDefinition
): (VIAMenu | string)[] => {
  switch (lightingType) {
    case LightingTypeDefinition.QMKLighting:
      return [coreMenus.QMKBacklight];
    case LightingTypeDefinition.QMKRGBLight:
      return [coreMenus.QMKRGBLight];
    case LightingTypeDefinition.QMKBacklightRGBLight:
      return [coreMenus.QMKBacklightRGBLight];
    case LightingTypeDefinition.WTRGBBacklight:
    case LightingTypeDefinition.WTMonoBacklight:
      return [WilbaPlsHalp];
    case LightingTypeDefinition.None:
      return [];
  }
};

const resolveMenus = (
  lighting: LightingTypeDefinitionV2
): (VIAMenu | string)[] => {
  if (isCustomLightingTypeDefinition(lighting)) {
    if (
      lighting.effects ||
      lighting.underglowEffects ||
      lighting.supportedLightingValues
    ) {
      return [WilbaPlsHalp];
    }
    return [...mapLightingMenus(lighting.extends)];
  }
  if (isLightingTypeDefinition(lighting)) {
    return [...mapLightingMenus(lighting)];
  }

  return [];
};

const cleanObject = (obj: any) => {
  return Object.keys(obj).reduce((acc,key) => 
    (obj[key].length ? {...acc, [key]:obj[key]} : acc) 
  , {})
}

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

    const {name, vendorId, productId, lighting} = definition.json;

    const keycodes = resolveKeycodes(lighting);
    const menus = resolveMenus(lighting);

    const v3Definition: KeyboardDefinitionV3 = {
      name,
      vendorId,
      productId,
      ...cleanObject({keycodes,menus}),
      ...supportedJson,
    };

    try {
      //if ( ! v3Definition.menus?.includes(WilbaPlsHalp) ) {
        fs.outputFile(`v3/${definition.path}`, stringify(v3Definition));
      //}
    } catch (e) {
      console.error(e);
    }
  });
}

convertV2ToV3();
