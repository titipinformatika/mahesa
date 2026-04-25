type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  [key: string]: unknown;
}

class Logger {
  private format(level: LogLevel, message: string, meta?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta,
    };
  }

  info(message: string, meta?: Record<string, unknown>) {
    console.log(JSON.stringify(this.format('info', message, meta)));
  }

  warn(message: string, meta?: Record<string, unknown>) {
    console.warn(JSON.stringify(this.format('warn', message, meta)));
  }

  error(message: string, meta?: Record<string, unknown>) {
    console.error(JSON.stringify(this.format('error', message, meta)));
  }

  debug(message: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(JSON.stringify(this.format('debug', message, meta)));
    }
  }
}

export const logger = new Logger();
