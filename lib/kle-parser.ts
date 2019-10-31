import {
  Formatting,
  Cursor,
  ColorCount,
  Dimensions,
  KLEElem,
  Rotation,
  Result
} from './types';

type InnerReduceState = Formatting &
  Dimensions & {
    cursor: Cursor;
    colorCount: ColorCount;
    res: Result[];
  } & Rotation;
type OuterReduceState = {
  cursor: Cursor;
  colorCount: ColorCount;
  prevFormatting: Formatting;
  res: Result[][];
};

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
  const parsedKLE = kle.reduce<OuterReduceState>(
    (prev: OuterReduceState, kle: KLEElem[]) => {
      const parsedRow = kle.reduce<InnerReduceState>(
        (
          {
            cursor: {x, y},
            size,
            marginX,
            marginY,
            res,
            c,
            h,
            t,
            r,
            rx,
            ry,
            colorCount
          }: InnerReduceState,
          n
        ) => {
          // Check if object and apply formatting
          if (typeof n !== 'string') {
            let obj: InnerReduceState = {
              size,
              marginX,
              marginY,
              colorCount,
              c,
              t,
              h,
              r,
              rx,
              ry,
              res,
              cursor: {x, y}
            };
            if (n.w > 1) {
              obj = {...obj, size: 100 * n.w};
            }
            if (typeof n.y === 'number') {
              obj = {
                ...obj,
                marginY: 100 * n.y,
                cursor: {...obj.cursor, y: y + n.y}
              };
            }
            if (typeof n.x === 'number') {
              obj = {
                ...obj,
                marginX: 100 * n.x,
                cursor: {...obj.cursor, x: x + n.x}
              };
            }
            if (typeof n.r === 'number') {
              obj = {
                ...obj,
                r: n.r
              };
            }
            if (typeof n.rx === 'number') {
              obj = {
                ...obj,
                rx: n.rx
              };
            }
            if (typeof n.h === 'number') {
              obj = {
                ...obj,
                h: n.h
              };
            }
            if (typeof n.ry === 'number') {
              obj = {
                ...obj,
                ry: n.ry
              };
            }
            if (typeof n.c === 'string') {
              obj = {...obj, c: n.c};
            }
            if (typeof n.t === 'string') {
              obj = {...obj, t: n.t};
            }
            return obj as InnerReduceState;
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
            const currKey = {
              c,
              t,
              size,
              marginX,
              marginY,
              row,
              col,
              x,
              y,
              r,
              rx,
              ry,
              h,
              w: size / 100
            };

            // Reset carry properties
            return {
              marginX: 0,
              marginY,
              size: 100,
              h: 1,
              c,
              colorCount: newColorCount,
              t,
              r: 0,
              rx: 0,
              ry: 0,
              cursor: {x: x + size / 100, y},
              res: [...res, currKey]
            };
          }
          return {
            marginX,
            marginY,
            size,
            c,
            t,
            h,
            r,
            rx,
            ry,
            res,
            colorCount,
            cursor: {x, y}
          };
        },
        {
          ...prev.prevFormatting,
          cursor: prev.cursor,
          colorCount: prev.colorCount,
          marginX: 0,
          marginY: 0,
          size: 100,
          h: 1,
          r: 0,
          rx: 0,
          ry: 0,
          res: []
        }
      );
      return {
        cursor: {x: 0, y: parsedRow.cursor.y + 1},
        colorCount: parsedRow.colorCount,
        prevFormatting: {c: parsedRow.c, t: parsedRow.t},
        res: [...prev.res, parsedRow.res]
      };
    },
    {
      cursor: {x: 0, y: 0},
      prevFormatting: {c: '#f5f5f5', t: '#444444'},
      res: [],
      colorCount: {}
    }
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

  const flatRes = res.flat();
  const xKeys = flatRes.map(k => k.x);
  const yKeys = flatRes.map(k => k.y);
  const minX = Math.min(...xKeys);
  const minY = Math.min(...yKeys);
  const width = Math.max(...flatRes.map(k => k.x + k.w)) - minX;
  const height = Math.max(...yKeys) + 1 - minY;
  const keys = flatRes.map(k => ({
    ...k,
    c: undefined,
    t: undefined,
    label: undefined,
    size: undefined,
    marginX: undefined,
    marginY: undefined,
    x: k.x - minX,
    y: k.y - minY,
    color: colorMap[`${k.c}:${k.t}`] || 'alpha'
  }));

  return {width, height, keys};
}
