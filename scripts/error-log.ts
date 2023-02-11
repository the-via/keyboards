import fs from 'fs/promises';

export class ErrorLogger {
  private _errors: Error[] = [];

  public logError = (err: Error) => {
    this._errors.push(err);
  };

  public getErrors = () => this._errors;

  public writeErrorsToConsole = () => {
    this._errors.forEach((err) => {
      console.error(err);
    });
  };

  public clearLogFile = async () => {
    return fs.rm('build-error.log', {force: true});
  };

  public writeErrorsToLogFile = async () => {
    this._errors.forEach(async (err) => {
      const errorStr = err.toString();
      return fs.writeFile('build-error.log', errorStr);
    });
  };
}
