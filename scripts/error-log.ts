import fs from 'fs/promises';

export const clearErrorLog = async () => {
  return fs.rm('build-error.log', {force: true});
};
export const writeToErrorLog = async (err: Error) => {
  const errorStr = err.toString();
  return fs.writeFile('build-error.log', errorStr);
};
