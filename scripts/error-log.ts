import fs from 'fs-extra';

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

  public clearLogFile = () => fs.rm('build-error.log', {force: true});

  public writeErrorsToLogFile = async () => {
    this._errors.forEach(async (err) => {
      const errorStr = err.toString();
      await fs.writeFile('build-error.log', errorStr);
    });
  };
}
