// import { Injectable } from '@nestjs/common';
// import { EmailProvider } from '../decorators/email.provider.decorator';
// import { BaseEmailProviderAbstract } from './interfaces/base.email-provider.abstract';
// import { EmailProviderInterface } from './interfaces/email.provider.interface';
// import { EmailOptionsDto } from '../dto/email.options.dto';
// import { AppLogger } from '../../logger/logger.service';
// import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
// import { AwsEmailConfigService } from '../config/aws/aws-email.config.service';
//
// @EmailProvider('aws-ses')
// @Injectable()
// export class AwsSesService
//   extends BaseEmailProviderAbstract
//   implements EmailProviderInterface
// {
//   private client: SESClient;
//
//   name = 'aws-ses';
//   isActive = true;
//
//   private region = 'eu-west-1';
//
//   constructor(
//     private readonly logger: AppLogger,
//     private readonly config: AwsEmailConfigService,
//   ) {
//     super();
//     this.logger = logger.withContext(AwsSesService.name);
//     this.initialize();
//   }
//
//   private initialize(): void {
//     this.client = new SESClient({
//       region: this.region,
//       credentials: {
//         accessKeyId: this.config.sesAccessKeyId,
//         secretAccessKey: this.config.sesSecretKey,
//       },
//     });
//   }
//
//   async sendTemplateEmail(emailOptionsDto: EmailOptionsDto): Promise<void> {
//     this.logger.log(`Sending email notification through: ${this.name}`);
//
//     const html = await this.loadTemplate(
//       emailOptionsDto.templateName,
//       emailOptionsDto.context,
//     );
//
//     const params = {
//       Source: `${this.config.sendFromName} <${this.config.sendFromEmail}>`,
//       Destination: { ToAddresses: [emailOptionsDto.to] },
//       Message: {
//         Subject: { Data: emailOptionsDto.subject },
//         Body: { Html: { Data: html } },
//       },
//     };
//     this.logger.log(`Sending email options...`, params);
//     try {
//       const command = new SendEmailCommand(params);
//       const result = await this.client.send(command);
//       console.log('Email sent! Message ID:', result.MessageId);
//     } catch (e) {
//       this.logger.error('Unable to send email notification through ses', e);
//       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//       throw new Error(`SES Send Failure: ${e.message}`);
//     }
//   }
// }
