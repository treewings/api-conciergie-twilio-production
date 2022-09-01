import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'DD/MM/YYYY HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: { service: process.env.LOG_SERVICE_NAME },
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.File({ filename: 'error.log', level: 'error', maxFiles: 10, maxsize: 100000000 }),
    new transports.File({ filename: 'general.log',  maxFiles: 10, maxsize: 100000000 })
  ]
});

export default logger;
