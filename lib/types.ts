type KLEDimensions = {a: number; x: number; w: number; y: number};
type OtherKLEProps = {[key: string]: any};
type KeyColor = string;
type LegendColor = string;
type Margin = number;
type Size = number;
type MatrixPosition = {row: number; col: number};

export type Cursor = {x: number; y: number};
export type Formatting = {c: KeyColor; t: LegendColor};
export type Dimensions = {marginX: Margin; marginY: Margin; size: Size};
export type KLEElem = KLEDimensions & Formatting | OtherKLEProps | string;
export type ColorCount = {[key: string]: number};
export type ParsedKLE = {
  res: Result[][];
  colorMap: {[k: string]: string};
};
export type Result ={w:number} & Formatting & Dimensions & Cursor & MatrixPosition;
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

export type KeyboardDefinition = {
  name: string;
  vendorId: string;
  productId: string;
  lights: LightingSupport;
  layouts: {[name: string]: KLELayoutDefinition};
};

export type VIADefinition = {
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
