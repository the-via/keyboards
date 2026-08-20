#!/usr/bin/env node
'use strict';

async function main() {
  const tsx = await import('tsx');
  const {tsImport} = require('tsx/esm/api');

  await tsImport(
    './scripts/build-all',
    './node_modules/via-keyboards/tsconfig.json',
  );
}
main();
