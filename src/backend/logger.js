import { Logger, transports } from 'winston';
import { red, blue, yellow, green } from 'chalk';

const levelColors = {
  ERROR: red,
  WARN: yellow,
  INFO: blue,
};

const logger = new Logger({
  transports: [
    new (transports.Console)({
      formatter(options) {
        const level = options.level.toUpperCase();
        const levelColor = levelColors[level] || (a => a);
        const message = options.message || '';
        return `[${levelColor(level)}] ${message}`;
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
      logger.info(`${green(request.method)} ${blue(request.originalUrl)} ${duration}ms`);
    });
    next();
  };
}
