import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Util } from '../utils';

@Injectable()
export class SanitizeMiddleware implements NestMiddleware {
  constructor(private readonly util: Util) {}

  use(req: Request, res: Response, next: NextFunction): void {
    req.body = this.sanitize(req.body);

    this.sanitizeInPlace(req.query);
    this.sanitizeParamsInPlace(req.params);

    next();
  }

  private sanitize(input: unknown): unknown {
    if (typeof input === 'string') {
      return this.util.sanitizeString(input);
    }

    if (Array.isArray(input)) {
      return input.map((item) => this.sanitize(item));
    }

    if (typeof input === 'object' && input !== null) {
      const sanitized: Record<string, unknown> = {};
      Object.keys(input).forEach((key) => {
        const value = (input as Record<string, unknown>)[key];
        sanitized[key] = this.sanitize(value);
      });
      return sanitized;
    }

    return input;
  }

  private sanitizeInPlace(obj: unknown): void {
    if (typeof obj === 'object' && obj !== null) {
      Object.keys(obj).forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
        const value = (obj as any)[key];

        if (typeof value === 'string') {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (obj as any)[key] = this.util.sanitizeString(value);
        } else if (Array.isArray(value)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (obj as any)[key] = value.map((item) => {
            if (typeof item === 'string') {
              return this.util.sanitizeString(item);
            } else if (typeof item === 'object' && item !== null) {
              this.sanitizeInPlace(item);
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              return item;
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return item;
          });
        } else if (typeof value === 'object' && value !== null) {
          this.sanitizeInPlace(value);
        }
      });
    }
  }

  private sanitizeParamsInPlace(params: { [key: string]: string }): void {
    Object.keys(params).forEach((key) => {
      if (typeof params[key] === 'string') {
        params[key] = this.util.sanitizeString(params[key]);
      }
    });
  }
}
