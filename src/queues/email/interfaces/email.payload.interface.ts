export interface IEmailPayload {
  to: string;
  subject: string;
  body: string | object | number;
  templatePath?: string;
}
