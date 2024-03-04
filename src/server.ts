import http from 'http';

import 'express-async-errors';
import { Logger } from 'winston';
import { Application } from 'express';
import { createConnection } from '@notifications/queues/connection';
import { healthRoutes } from '@notifications/routes';
import { createConnectionElasticsearch } from '@notifications/elasticsearch';
import { config } from '@notifications/config';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';
import { winstonLogger, Level } from '@mohamedramadan14/freelance-shared';

const SERVER_PORT = 4001;
const SERVICE = 'Notification Service';

const { ELASTICSEARCH_URL } = config;
const logger: Logger = winstonLogger(`${ELASTICSEARCH_URL}`, 'notificationServer', Level.debug);

export const start = (app: Application): void => {
  startServer(app);
  app.use('', healthRoutes);
  startQueues();
  startElasticSearch();
};

const startQueues = async (): Promise<void> => {
  const emailChannel: Channel = (await createConnection()) as Channel;
  await consumeAuthEmailMessages(emailChannel);
  await consumeOrderEmailMessages(emailChannel);
};

const startElasticSearch = (): void => {
  createConnectionElasticsearch().then(() => {
    logger.info('Connected to ElasticSearch');
  });
};

const startServer = (app: Application): void => {
  try {
    const httpServer: http.Server = new http.Server(app);
    logger.info(`Worker with process id of ${process.pid} started on notification server`);
    httpServer.listen(SERVER_PORT, () => {
      logger.info(`${SERVICE} - Server started on port ${SERVER_PORT}`);
    });
  } catch (error) {
    logger.log('error', `${SERVICE} - Failed to start server : call: startServer ()`, error);
  }
};
