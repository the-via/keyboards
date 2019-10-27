type KeyColor = string;
type LegendColor = string;
type Margin = number;
type Size = number;
type Formatting = {c: KeyColor; t: LegendColor};
type Dimensions = {marginX: Margin; marginY: Margin; size: Size};
export type Result = Formatting & Dimensions & {label: string};
type ColorCount = {[key: string]: number};
type KLEDimensions = {a: number; x: number; w: number; y: number};
type OtherKLEProps = {[key: string]: any};
type KLEElem = KLEDimensions & Formatting | OtherKLEProps | string;
type InnerReduceState = Formatting &
  Dimensions & {colorCount: ColorCount; res: Result[]};
type OuterReduceState = {
  colorCount: ColorCount;
  prevFormatting: Formatting;
  res: Result[][];
};
export type ParsedKLE = {
  res: Result[][];
  colorMap: {[k: string]: string};
};

// {c, t, label: n, size, margin}

export function parseKLE(kle: string): any {
  const kleArr = kle.split(',\n');
  return kleArr.map(row =>
    JSON.parse(
      row
        .replace(/\n/g, '\\n')
        .replace(/\\/g, '\\\\')
        .replace(/\"\\(?!,)/g, '\\\\')
        .replace(/([{,])([A-Za-z][0-9A-Za-z]?)(:)/g, '$1"$2"$3')
    )
  );
}

export function generateParsedKLE(kle: KLEElem[][]) {
  const parsedKLE: OuterReduceState = kle.reduce(
    (prev: OuterReduceState, kle: any[]) => {
      const parsedRow: InnerReduceState = kle.reduce(
        (
          {size, marginX, marginY, res, c, t, colorCount}: InnerReduceState,
          n: KLEElem
        ) => {
          // Check if object and apply formatting
          if (typeof n !== 'string') {
            let obj = {size, marginX, marginY, colorCount, c, t, res};
            if (n.w > 1) {
              obj = {...obj, size: 100 * n.w};
            }
            if (typeof n.y === 'number') {
              obj = {...obj, marginY: 100 * n.y};
            }
            if (typeof n.x === 'number') {
              obj = {...obj, marginX: 100 * n.x};
            }
            if (typeof n.c === 'string') {
              obj = {...obj, c: n.c};
            }
            if (typeof n.t === 'string') {
              obj = {...obj, t: n.t};
            }
            return obj;
          } else if (typeof n === 'string') {
            const colorCountKey = `${c}:${t}`;
            const [row, col] = n.split(',').map(num => parseInt(num, 10));
            const newColorCount = {
              ...colorCount,
              [colorCountKey]:
                colorCount[colorCountKey] === undefined
                  ? 1
                  : colorCount[colorCountKey] + 1
            };
            return {
              marginX: 0,
              marginY,
              size: 100,
              c,
              colorCount: newColorCount,
              t,
              res: [...res, {c, t, label: n, size, marginX, marginY, row, col}]
            };
          }
          return {marginX, marginY, size, c, t, res, colorCount};
        },
        {
          ...prev.prevFormatting,
          colorCount: prev.colorCount,
          marginX: 0,
          marginY: 0,
          size: 100,
          res: []
        }
      );
      return {
        colorCount: parsedRow.colorCount,
        prevFormatting: {c: parsedRow.c, t: parsedRow.t},
        res: [...prev.res, parsedRow.res]
      };
    },
    {prevFormatting: {c: '#f5f5f5', t: '#444444'}, res: [], colorCount: {}}
  );

  const {colorCount, res} = parsedKLE;
  const colorCountKeys = Object.keys(colorCount);
  colorCountKeys.sort((a, b) => colorCount[b] - colorCount[a]);
  if (colorCountKeys.length > 3) {
    console.error('Please correct layout:', parsedKLE);
  }

  const colorMap = {
    [colorCountKeys[0]]: 'alpha',
    [colorCountKeys[1]]: 'mod',
    [colorCountKeys[2]]: 'accent'
  };

  const keys = res.map(row =>
    row.map(k => ({
      ...k,
      c: undefined,
      t: undefined,
      label: undefined,
      keyColor: colorMap[`${k.c}:${k.t}`] || 'alpha'
    }))
  );

  return {keys};
}
