type LoggerLevel = 'log' | 'warn' | 'error' | 'debug'

export class Logger {
  prefix: string
  static create(prefix?: string) {
    return new Logger(prefix)
  }

  constructor(prefix = 'debug') {
    this.prefix = prefix
  }

  log(...args: unknown[]) {
    this.maybeLog('log', ...args)
  }

  warn(...args: unknown[]) {
    this.maybeLog('warn', ...args)
  }

  error(...args: unknown[]) {
    this.maybeLog('error', ...args)
  }

  private maybeLog(level: LoggerLevel, ...args: unknown[]) {
    if (typeof args[0] === 'string') {
      const message = `[prefix:${this.prefix}]:${args[0]}`
      console[level](message, ...args.slice(1))
    } else {
      console[level](this.prefix, ...args)
    }
  }
}
