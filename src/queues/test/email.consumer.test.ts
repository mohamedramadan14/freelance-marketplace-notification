import * as connection from '@notifications/queues/connection';
import amqp from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consumer';

jest.mock('@notifications/queues/connection');
jest.mock('amqplib');
jest.mock('@notifications/dist');

describe('Email Consumers', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('consumeAuthEmailMessages()', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
        publish: jest.fn()
      };
      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({
        queue: 'auth-email-queue',
        messageCount: 0,
        consumerCount: 0
      });
      jest.spyOn(connection, 'createConnection').mockResolvedValue(channel as never);
      const channelConnection: amqp.Channel | undefined = await connection.createConnection();
      await consumeAuthEmailMessages(channelConnection!);

      expect(channelConnection!.assertExchange).toHaveBeenCalledWith('email-notification', 'direct');
      expect(channelConnection!.assertQueue).toHaveBeenCalledTimes(1);
      expect(channelConnection!.consume).toHaveBeenCalledTimes(1);
      expect(channelConnection!.bindQueue).toHaveBeenCalledWith('auth-email-queue', 'email-notification', 'auth-email');
    });
  });

  describe('consumeOrderEmailMessages()', () => {
    it('should be called', async () => {
      const channel = {
        assertExchange: jest.fn(),
        assertQueue: jest.fn(),
        bindQueue: jest.fn(),
        consume: jest.fn(),
        publish: jest.fn()
      };
      jest.spyOn(channel, 'assertExchange');
      jest.spyOn(channel, 'assertQueue').mockReturnValue({
        queue: 'order-email-queue',
        messageCount: 0,
        consumerCount: 0
      });
      jest.spyOn(connection, 'createConnection').mockResolvedValue(channel as never);
      const channelConnection: amqp.Channel | undefined = await connection.createConnection();
      await consumeOrderEmailMessages(channelConnection!);

      expect(channelConnection!.assertExchange).toHaveBeenCalledWith('order-notification', 'direct');
      expect(channelConnection!.assertQueue).toHaveBeenCalledTimes(1);
      expect(channelConnection!.consume).toHaveBeenCalledTimes(1);
      expect(channelConnection!.bindQueue).toHaveBeenCalledWith('order-email-queue', 'order-notification', 'order-email');
    });
  });
});
