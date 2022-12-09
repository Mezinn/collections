import { Injectable } from '@nestjs/common';
import UserEntity from '../../../shared/entities/user.entity';
import EmailConfirmationTokenEntity from '../../../shared/entities/emailConfirmationToken.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export default class ConfirmEmailMail {
  constructor(private mailerService: MailerService) {}

  public send(
    user: UserEntity,
    emailConfirmationToken: EmailConfirmationTokenEntity,
  ): void {
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Email confirmation',
      template: 'confirmRegistration',
      context: {
        emailConfirmationToken: emailConfirmationToken.value,
      },
    });
  }
}
