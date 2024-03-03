import { Logger } from 'winston';
import express, { Express } from 'express';

import { winstonLogger } from './dist';
import { config } from './config';
import { start } from './server';
import { Level } from './helpers';

const logger: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'notificationApp', Level.debug);

const initialize = (): void => {
  const app: Express = express();
  start(app);
  logger.info('Notification service is started');
};

initialize();
