import { Injectable } from '@nestjs/common';
import * as EmailValidator from 'email-validator';

@Injectable()
export default class MustBeEmail {
  public async validate(context: string[], value: string) {
    const isValid = EmailValidator.validate(value);
    if (!isValid) {
      context.push('Value must be an email address');
    }
  }
}
