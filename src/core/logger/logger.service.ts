import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import chalk from 'chalk';
/**
 * Usage:
 * import { Injectable } from '@nestjs/common';
 * import { AppLogger } from '../core/logger/logger.service';
 *
 * @Injectable()
 * export class SomeService {
 *   constructor (private readonly logger: AppLogger) {
 *     this.logger.setContext(SomeService.name);
 *   }
 *
 *   doSomething() {
 *     this.logger.log('Doing something important...');
 *   }
 * }
 */
@Injectable()
export class AppLogger implements LoggerService {
  private context?: string;

  constructor(private readonly configService: ConfigService) {}

  withContext(context: string): AppLogger {
    const newLogger = new AppLogger(this.configService);
    newLogger.setContext(context);
    return newLogger;
  }

  private setContext(context: string): void {
    this.context = context;
  }

  private getContextTag(): string {
    return `[${this.context || 'AppLogger'}]`;
  }

  private formatMessage(
    level: string,
    message: any,
    color: chalk.Chalk,
  ): string {
    const emoji =
      {
        log: '🔹',
        error: '❌',
        warn: '⚠️',
        debug: '🐞',
        verbose: '🔍',
      }[level] || '';

    const formatted =
      typeof message === 'object'
        ? JSON.stringify(message, null, 2)
        : String(message);

    return `${this.getCurrentTimestamp()} ${emoji} ${color(
      `[${level.toUpperCase()}] ${this.getContextTag()} ${formatted}`,
    )}`;
  }

  private getCurrentTimestamp(): string {
    const now = new Date();
    return now.toLocaleString('en-NG', {
      timeZone: 'Africa/Lagos',
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }

  log(message: any, data?: any): void {
    if (data) {
      console.log(this.formatMessage('log', message, chalk.blueBright), data);
    } else console.log(this.formatMessage('log', message, chalk.blueBright));
  }

  error(message: any, data?: any): void {
    if (data) {
      console.error(this.formatMessage('error', message, chalk.red), data);
    } else console.error(this.formatMessage('error', message, chalk.red));
  }

  warn(message: any): void {
    console.warn(this.formatMessage('warn', message, chalk.yellow));
  }

  debug(message: any): void {
    if (this.configService.get<LogLevel>('logger.level') === 'debug') {
      console.debug(this.formatMessage('debug', message, chalk.magenta));
    }
  }

  verbose(message: any): void {
    if (this.configService.get<LogLevel>('logger.level') === 'verbose') {
      console.debug(this.formatMessage('verbose', message, chalk.cyan));
    }
  }
}
