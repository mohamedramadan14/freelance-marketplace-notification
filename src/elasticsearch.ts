import { Client } from '@elastic/elasticsearch';
import { Logger } from 'winston';
import { winstonLogger, Level } from '@mohamedramadan14/freelance-shared';
import { config } from '@notifications/config';

const logger: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'notificationElasticSearchServer', Level.debug);

const elasticsearchClient = new Client({
  node: config.ELASTICSEARCH_URL
});

export const createConnectionElasticsearch = async (): Promise<void> => {
  let isConnected = false;

  while (!isConnected) {
    try {
      const health = await elasticsearchClient.cluster.health({});
      logger.info(`Connected to ElasticSearch is ${health.status}`);
      isConnected = true;
    } catch (error) {
      logger.error('Failed to connect to ElasticSearch. Retrying.....');
      logger.log('error', 'Notification Service - Failed to connect to ElasticSearch. call: createConnection()', error);
    }
  }
};
