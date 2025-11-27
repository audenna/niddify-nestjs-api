import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ParseJsonPipe implements PipeTransform {
  constructor(private readonly keys: string[]) {}

  transform(value: any): any {
    for (const key of this.keys) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (value[key] && typeof value[key] === 'string') {
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
          value[key] = JSON.parse(value[key]);
        } catch (e) {
          console.error(e);
          throw new Error(`Invalid JSON for field: ${key}`);
        }
      }
    }
    return value;
  }
}
