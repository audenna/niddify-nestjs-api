import * as Handlebars from 'handlebars';
import * as path from 'path';
import { readdir } from 'fs/promises';
import { OnModuleInit } from '@nestjs/common';
import { promises as fs } from 'fs';

/**
 * Example Usage:
 * export class MailgunProvider extends BaseEmailProviderAbstract {
 *   // constructor, Mailgun config...
 *   async sendTemplateEmail(...) {
 *     const html = await this.loadTemplate(templateName, context);
 *     // Mailgun API call
 *   }
 * }
 */
export abstract class BaseEmailProviderAbstract implements OnModuleInit {
  private static partialsRegistered = false;

  async onModuleInit(): Promise<void> {
    await this.registerPartials();
  }

  private async registerPartials(): Promise<void> {
    if (BaseEmailProviderAbstract.partialsRegistered) return;

    const baseDir = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
    const partialsDir = path.join(process.cwd(), baseDir, 'views', 'partials');

    const files = await readdir(partialsDir);

    for (const file of files) {
      const match = /^(.+)\.hbs$/.exec(file);
      if (!match) continue;

      const name = match[1];
      const filepath = path.join(partialsDir, file);
      const template = await fs.readFile(filepath, 'utf8');

      Handlebars.registerHelper('year', () => new Date().getFullYear());
      Handlebars.registerPartial(name, template);
    }

    BaseEmailProviderAbstract.partialsRegistered = true;
  }

  protected async loadTemplate(
    templateNameAndPath: string,
    context?: Record<string, any>,
  ): Promise<string> {
    const baseDir = process.env.NODE_ENV === 'production' ? 'dist' : 'src';
    const filePath = path.join(
      process.cwd(),
      baseDir,
      'views',
      'templates',
      `${templateNameAndPath}.hbs`,
    );
    const fileContent = await fs.readFile(filePath, 'utf8');
    const template = Handlebars.compile(fileContent);
    return template(context ?? {});
  }
}
