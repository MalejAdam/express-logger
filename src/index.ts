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
  level: process.env.LOG_LEVEL || 'silly',
  silent: !process.env.LOG_LEVEL && process.env.NODE_ENV === 'test',
});

interface LoggerMethod {
  (msg: string, details?: any): void;
}

const formatMessage = (message: any): any => {
  const requestId = httpContext.get('request-id');

  if(typeof message === 'object') {
    return { ...message, requestId };
  }

  if (message) {
    message += requestId ? ` - requestId: ${requestId}` : '';
    
    return message
  }

  return { requestId }
}

export const logger = {
  error: ((msg, details?) => winstonLogger.error(msg, formatMessage(details))) as LoggerMethod,
  warn: ((msg, details?) => winstonLogger.warn(msg, formatMessage(details))) as LoggerMethod,
  info: ((msg, details?) => winstonLogger.info(msg, formatMessage(details))) as LoggerMethod,
  http: ((msg, details?) => winstonLogger.http(msg, formatMessage(details))) as LoggerMethod,
  verbose: ((msg, details?) =>
    winstonLogger.verbose(msg, formatMessage(details))) as LoggerMethod,
  debug: ((msg, details?) => winstonLogger.debug(msg, formatMessage(details))) as LoggerMethod,
  silly: ((msg, details?) => winstonLogger.silly(msg, formatMessage(details))) as LoggerMethod,
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
