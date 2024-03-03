import { Channel, Connection, connect } from 'amqplib';
import { config } from '@notifications/config';
import { Logger } from 'winston';
import { winstonLogger } from '@notifications/dist';
import { Level } from '@notifications/helpers';

const logger: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'NotificationQueueConnection', Level.debug);

const createConnection = async (): Promise<Channel | undefined> => {
  try {
    const connection: Connection = await connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();

    logger.info('Notification Service connected to RabbitMQ Queue Successfully....');
    logger.info('NOtification Service - created channel in rabbitmq successfully...');

    closeConnection(channel, connection);

    return channel;
  } catch (error) {
    logger.error('error', 'Notification Service - call: createConnection() - RabbitMQ', error);
    return undefined;
  }
};

const closeConnection = (channel: Channel, connection: Connection): void => {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
};
export { createConnection, closeConnection };
