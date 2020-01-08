import * as stringify from 'json-stringify-pretty-compact';
import {parseConfig} from 'via-reader';
import * as rimraf from 'rimraf';
import {promisify} from 'bluebird';
import * as glob from 'glob';
import {getVendorProductId} from 'via-reader';
const {exec} = require('child_process');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
//const qmkRepoPath = '../qmk_firmware/keyboards';

type PartialConfig = {
  VENDOR_ID: string;
  PRODUCT_ID: string;
};

async function generateCommand(folder: string, skipExisting = false) {
  if (skipExisting && fs.existsSync(`${folder}/keymaps/via`)) {
    console.log('Skipping', folder);
  }
  const configH = await readFile(`${folder}/config.h`, 'utf8');
  const config = (parseConfig(configH) as any) as PartialConfig;
  const {VENDOR_ID, PRODUCT_ID} = config;

  const vendorProductId = getVendorProductId({
    vendorId: VENDOR_ID,
    productId: PRODUCT_ID
  });
  const command = folder.replace(/^.+?keyboards\//, '');
  const qmkMap = {[vendorProductId]: command};
  return qmkMap;
}

async function processFiles(qmkPath: string) {
  const paths = glob.sync(`${qmkPath}/keyboards/**/keymaps/via/rules.mk`, {
    absolute: true
  });
  const folders = paths.map(path =>
    path.replace(/\/keymaps\/via\/rules\.mk$/, '')
  );
  const rmrf = promisify(rimraf);
  const failedFiles: any[] = [];
  await rmrf('qmk_temp/*');
  if (!fs.existsSync('qmk_temp')) {
    fs.mkdirSync('qmk_temp');
  }
  let commands = {};
  for (let i = 0; i < folders.length; i++) {
    try {
      const command = await generateCommand(folders[i]);
      commands = {...commands, ...command};
    } catch (e) {
      failedFiles.push([e, folders[i]]);
    }
  }
  const commandArr = Object.entries(commands);
  const execCommand = promisify(exec) as any;
  let vpidPaths = {};
  for (let i = 0; i < commandArr.length; i++) {
    await execCommand(`cd ${qmkPath} && make ${commandArr[i][1]}:via`);
    const binPaths = glob.sync(`${qmkPath}/**.bin`, {
      absolute: true
    });
    const hexPaths = glob.sync(`${qmkPath}/**.hex`, {
      absolute: true
    });
    const fwPaths = [...binPaths, ...hexPaths];
    vpidPaths = {
      ...vpidPaths,
      [commandArr[i][0]]: fwPaths.map(p => p.replace(/.+\//, ''))
    };
    fwPaths.forEach(async p => {
      await execCommand(`mv ${p} ./dist`);
    });
    fs.writeFileSync('dist/fwPaths.json', stringify(vpidPaths));
  }
}

processFiles(process.argv[2]);
