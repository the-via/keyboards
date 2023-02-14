import fs from 'fs-extra';
import {buildNames} from './build-names';
import {buildDefinitions} from './build-definitions';
import {ErrorLogger} from './error-log';

async function build() {
  const logger = new ErrorLogger();

  try {
    await fs.remove('dist');
    await logger.clearLogFile();

    const v3ConvertedDefinitions = await buildDefinitions(logger);

    await buildNames(
      v3ConvertedDefinitions.map((converted) => converted.viaDefinition)
    );
  } catch (error) {
    logger.logError(error);
  } finally {
    if (logger.getErrors().length > 0) {
      logger.writeErrorsToConsole();
      await logger.writeErrorsToLogFile();
      process.exit(1);
    }
  }
}

build();
