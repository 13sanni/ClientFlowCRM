import pino from 'pino'
import pinoHttp from 'pino-http'
import { env } from '../config/env.js'

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    env.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
})

// @ts-ignore - pino-http module exports are sometimes strictly typed as uncallable depending on TS version
export const httpLogger = (pinoHttp as any)({
  logger,
  customLogLevel: (req: any, res: any, err: any) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn'
    } else if (res.statusCode >= 500 || err) {
      return 'error'
    }
    return 'info'
  },
})
