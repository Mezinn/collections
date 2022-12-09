import { Injectable } from '@nestjs/common';
import UserEntity from '../../../shared/entities/user.entity';
import { MailerService } from '@nestjs-modules/mailer';
import ResetPasswordTokenEntity from '../../../shared/entities/resetPasswordToken.entity';

@Injectable()
export default class ResetPasswordMail {
  public constructor(private mailerService: MailerService) {}

  public send(user: UserEntity, resetPasswordToken: ResetPasswordTokenEntity) {
    this.mailerService.sendMail({
      to: user.email,
      subject: 'Password resetting',
      template: 'forgotPassword',
      context: {
        forgotPasswordToken: resetPasswordToken.value,
      },
    });
  }
}
