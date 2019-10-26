import {ParsedKLE, generateParsedKLE} from './kle-parser';

enum LightingSupport {
  None = 0,
  QMKLighting = 1,
  WTRGBBacklight = 2,
  WTMonoBacklight = 3
}

type KLEFormattingObject = Partial<{
  c: string;
  t: string;
  x: number;
  y: number;
  w: number;
  a: number;
}>;

type KLELayoutDefinition = (string | KLEFormattingObject)[][];

type KeyboardDefinition = {
  name: string;
  vendorId: string;
  productId: string;
  lights: LightingSupport;
  layouts: {[name: string]: KLELayoutDefinition};
};

type VIADefinition = {
  name: string;
  vendorProductId: number;
  lights: LightingSupport;
  layouts: {
    [layoutName: string]: {
      colorMap: ParsedKLE['colorMap'];
      layout: ParsedKLE['res'];
    };
  };
};

function getVendorProductId({productId, vendorId}: KeyboardDefinition): number {
  const parsedVendorId = parseInt(vendorId, 16);
  const parsedProductId = parseInt(productId, 16);
  return parsedVendorId * 65536 + parsedProductId;
}

export function keyboardDefinitionToVIADefinition(
  definition: KeyboardDefinition
): VIADefinition {
  const {name, lights} = definition;
  const layouts = Object.entries(definition.layouts).reduce(
    (p, [k, v]) => ({...p, [k]: generateParsedKLE(v)}),
    {}
  );
  return {
    name,
    lights,
    layouts,
    vendorProductId: getVendorProductId(definition)
  };
}

export function generateVIADefinitionLookupMap(
  definitions: KeyboardDefinition[]
) {
  return definitions
    .map(keyboardDefinitionToVIADefinition)
    .reduce((p, n) => ({...p, [n.vendorProductId]: n}), {});
}
