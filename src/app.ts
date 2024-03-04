import { Logger } from 'winston';
import express, { Express } from 'express';
import { winstonLogger , Level} from '@mohamedramadan14/freelance-shared';
import { config } from '@notifications/config';
import { start } from '@notifications/server';


const logger: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'notificationApp', Level.debug);

const initialize = (): void => {
  const app: Express = express();
  start(app);
  logger.info('Notification service is started');
};

initialize();
