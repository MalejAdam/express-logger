import * as winston from 'winston';
import expressWinston from 'express-winston';
import httpContext from 'express-http-context';
import { Request } from 'express';

const loggerConfig = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.label({ label: 'client-app' }),
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.json(),
        winston.format.errors({ stack: true }),
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
  exitOnError: false,
};

const winstonLogger = winston.createLogger({
  ...loggerConfig,
  level: process.env.LOG_LEVEL || 'info',
  silent: !process.env.LOG_LEVEL && process.env.NODE_ENV === 'test',
});

interface LoggerMethod {
  (msg: string, details?: any): void;
}

const formatMessage = (message: string): string => {
  const requestId = httpContext.get('requestId');
  message += requestId ? ` - requestId: ${requestId}` : '';

  return message;
}

export const logger = {
  error: ((msg, details?) => winstonLogger.error(formatMessage(msg), details)) as LoggerMethod,
  warn: ((msg, details?) => winstonLogger.warn(formatMessage(msg), details)) as LoggerMethod,
  info: ((msg, details?) => winstonLogger.info(formatMessage(msg), details)) as LoggerMethod,
  http: ((msg, details?) => winstonLogger.http(formatMessage(msg), details)) as LoggerMethod,
  verbose: ((msg, details?) =>
    winstonLogger.verbose(formatMessage(msg), details)) as LoggerMethod,
  debug: ((msg, details?) => winstonLogger.debug(formatMessage(msg), details)) as LoggerMethod,
  silly: ((msg, details?) => winstonLogger.silly(formatMessage(msg), details)) as LoggerMethod,
};

const filter = (req: Request, propName: string) => {
  if (propName === 'headers') {
    const { ...res } = req[propName];
    return res;
  }

  return req.headers;
};

export const winstonExpress = expressWinston.logger({
  ...loggerConfig,
  requestFilter: filter,
});
