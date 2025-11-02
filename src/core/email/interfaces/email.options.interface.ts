export interface IEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  context?: Record<string, any>;
  mailFromName?: string;
  mailFromEmail?: string;
}
