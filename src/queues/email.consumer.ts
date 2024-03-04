import { config } from '@notifications/config';
import { IEmailLocals, winstonLogger, Level } from '@mohamedramadan14/freelance-shared';
import { Channel, ConsumeMessage } from 'amqplib';
import { Logger } from 'winston';
import { sendEmail } from '@notifications/queues/mail.transport';
import { createConnection } from '@notifications/queues/connection';

const logger: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'RabbitMQEmailConsumer', Level.debug);

// Auth Service Email Consumer
const consumeAuthEmailMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    // so any message sent to exchange 'email-notification' with routing key 'auth-email' will be consumed via 'auth-email-queue'
    const exchangeName = 'email-notification';
    const routingKey = 'auth-email';
    const queueName = 'auth-email-queue';
    await channel.assertExchange(exchangeName, 'direct');
    // { durable: true } will ensure that the queue will persist data even if a server restart

    const authEmailQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false
    });

    await channel.bindQueue(authEmailQueue.queue, exchangeName, routingKey);

    await channel.consume(authEmailQueue.queue, async (msg: ConsumeMessage | null) => {
      const { receiverEmail, verifyLink, template } = JSON.parse(msg!.content.toString());
      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
        verifyLink
      };
      await sendEmail(template, receiverEmail, locals);
      await channel.ack(msg!);
    });
  } catch (error) {
    logger.log('error', 'Notification Service - call: consumeAuthEmailMessages() - Failed to consume messages from RabbitMQ', error);
  }
};

const consumeOrderEmailMessages = async (channel: Channel): Promise<void> => {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    // so any message sent to exchange 'email-notification' with routing key 'auth-email' will be consumed via 'auth-email-queue'
    const exchangeName = 'order-notification';
    const routingKey = 'order-email';
    const queueName = 'order-email-queue';
    await channel.assertExchange(exchangeName, 'direct');
    // { durable: true } will ensure that the queue will persist data even if a server restart

    const orderEmailQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false
    });

    await channel.bindQueue(orderEmailQueue.queue, exchangeName, routingKey);

    await channel.consume(orderEmailQueue.queue, async (msg: ConsumeMessage | null) => {
      console.log(msg?.content.toString());
      const {
        receiverEmail,
        username,
        template,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total
      } = JSON.parse(msg!.content.toString());
      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: 'https://i.ibb.co/Kyp2m0t/cover.png',
        username,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total
      };
      if (template === 'orderPlaced') {
        await sendEmail('orderPlaced', receiverEmail, locals);
        await sendEmail('orderReceipt', receiverEmail, locals);
      } else {
        await sendEmail(template, receiverEmail, locals);
      }
    });
  } catch (error) {
    logger.log('error', 'Notification Service - call: consumeAuthEmailMessages() - Failed to consume messages from RabbitMQ', error);
  }
};
export { consumeAuthEmailMessages, consumeOrderEmailMessages };
