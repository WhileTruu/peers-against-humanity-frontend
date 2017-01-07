import { Logger, transports } from 'winston';
import chalk from 'chalk';

const levelColors = {
  ERROR: chalk.bold.red.inverse,
  WARN: chalk.bold.yellow.inverse,
  INFO: chalk.bold.blue.inverse,
};

const logger = new Logger({
  transports: [
    new (transports.Console)({
      formatter(options) {
        const level = options.level.toUpperCase();
        const levelColor = levelColors[level] || (a => a);
        const message = options.message || '';
        return `${levelColor(`[${level}]`)} ${message}`;
      },
    }),
  ],
});

export default logger;

export function loggingMiddleware() {
  return (request, response, next) => {
    const startTime = Date.now();
    response.on('finish', () => {
      const duration = Date.now() - startTime;
      logger.info(`${chalk.cyan((new Date().toUTCString()))} ${chalk.green(request.method)} ${chalk.blue(request.originalUrl)} ${duration}ms`);
    });
    next();
  };
}
