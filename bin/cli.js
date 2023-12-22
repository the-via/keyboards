#!/usr/bin/env node
'use strict';
var tsNode = require('ts-node');
tsNode.register({
  project: './node_modules/via-keyboards/tsconfig.json',
});
require('../scripts/build-all');
