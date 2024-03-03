import path from 'path';

import { Logger } from 'winston';
import { config } from '@notifications/config';
import nodemailer, { Transporter } from 'nodemailer';
import Email from 'email-templates';

import { IEmailLocals, winstonLogger } from './dist';
enum Level {
  debug = 'debug',
  info = 'info',
  warn = 'warn',
  error = 'error'
}

const logger: Logger = winstonLogger(`${config.ELASTICSEARCH_URL}`, 'NotificationService', Level.debug);

const prepareEmail = async (template: string, receiver: string, locals: IEmailLocals): Promise<void> => {
  console.log(config.SENDER_EMAIL);

  try {
    const smtpTransport: Transporter = nodemailer.createTransport({
      host: 'smtp.mailspons.com',
      port: 587,
      auth: {
        user: `${config.SENDER_EMAIL}`,
        pass: `${config.SENDER_EMAIL_PASSWORD}`
      }
    });
    const email: Email = new Email({
      message: {
        from: `Freelance Marketplace App <${config.SENDER_EMAIL}>`
      },
      send: true,
      preview: false,
      transport: smtpTransport,
      views: {
        options: {
          extension: 'ejs'
        }
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../build')
        }
      }
    });

    await email.send({
      template: path.join(__dirname, '..', 'src/emails', template),
      message: { to: receiver },
      locals
    });
  } catch (error) {
    logger.error(error);
  }
};

export { Level, prepareEmail };
