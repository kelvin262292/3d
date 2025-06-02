/**
 * Logger utility for the application
 * Provides structured logging with different levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  private formatMessage(level: LogLevel, message: string, context?: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      data
    };
  }

  private shouldLog(level: LogLevel): boolean {
    // In production, only log warnings and errors
    if (this.isProduction) {
      return level === 'warn' || level === 'error';
    }
    // In development, log everything
    return true;
  }

  private output(logEntry: LogEntry): void {
    if (!this.shouldLog(logEntry.level)) {
      return;
    }

    const { level, message, timestamp, context, data } = logEntry;
    const contextStr = context ? `[${context}]` : '';
    const prefix = `${timestamp} ${level.toUpperCase()} ${contextStr}`;

    // In production, we would send to external logging service
    // For now, using console but with structured format
    if (this.isProduction) {
      // In production, use JSON format for log aggregation
      console.log(JSON.stringify(logEntry));
    } else {
      // In development, use readable format
      switch (level) {
        case 'debug':
          console.debug(`${prefix} ${message}`, data || '');
          break;
        case 'info':
          console.info(`${prefix} ${message}`, data || '');
          break;
        case 'warn':
          console.warn(`${prefix} ${message}`, data || '');
          break;
        case 'error':
          console.error(`${prefix} ${message}`, data || '');
          break;
      }
    }
  }

  debug(message: string, context?: string, data?: any): void {
    this.output(this.formatMessage('debug', message, context, data));
  }

  info(message: string, context?: string, data?: any): void {
    this.output(this.formatMessage('info', message, context, data));
  }

  warn(message: string, context?: string, data?: any): void {
    this.output(this.formatMessage('warn', message, context, data));
  }

  error(message: string, context?: string, data?: any): void {
    this.output(this.formatMessage('error', message, context, data));
  }

  // Convenience methods for common use cases
  auth(message: string, data?: any): void {
    this.info(message, 'AUTH', data);
  }

  payment(message: string, data?: any): void {
    this.info(message, 'PAYMENT', data);
  }

  database(message: string, data?: any): void {
    this.info(message, 'DATABASE', data);
  }

  api(message: string, data?: any): void {
    this.info(message, 'API', data);
  }

  websocket(message: string, data?: any): void {
    this.info(message, 'WEBSOCKET', data);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export types for external use
export type { LogLevel, LogEntry };