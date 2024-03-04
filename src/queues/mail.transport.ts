import { config } from '@notifications/config';
import { IEmailLocals, winstonLogger, Level } from '@mohamedramadan14/freelance-shared';
import { prepareEmail } from '@notifications/helpers';
import { Logger } from 'winston';

const logger: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'MailTransport', Level.debug);

const sendEmail = async (template: string, receiver: string, locals: IEmailLocals): Promise<void> => {
  try {
    logger.info(`Sending email to ${receiver}...`);
    prepareEmail(template, receiver, locals)
      .then(() => {
        logger.info('Email Sent Successfully...');
      })
      .catch((error) => {
        logger.log('error', 'Notification Service - MailTransport - call: sendEmail() - Failed to prepare and send email', error);
      });
  } catch (error) {
    logger.log('error', 'Notification Service - MailTransport - call: sendEmail() - Failed to send email', error);
  }
};

export { sendEmail };
