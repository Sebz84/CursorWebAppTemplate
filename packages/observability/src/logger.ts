import pino from 'pino';

const isProd = process.env.NODE_ENV === 'production';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? (isProd ? 'info' : 'debug'),
  transport: isProd
    ? undefined
    : {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard'
        }
      }
});

export const withRequest = (requestId: string) => logger.child({ requestId });
import pino from 'pino';

let loggerInstance: pino.Logger | null = null;

export const getLogger = () => {
  if (!loggerInstance) {
    loggerInstance = pino({
      level: process.env.LOG_LEVEL ?? 'info',
      transport:
        process.env.NODE_ENV === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'SYS:standard'
              }
            }
          : undefined
    });
  }

  return loggerInstance;
};

export type Logger = ReturnType<typeof getLogger>;

