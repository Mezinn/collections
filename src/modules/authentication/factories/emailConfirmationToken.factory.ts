import { Injectable } from '@nestjs/common';
import UserEntity from '../../../shared/entities/user.entity';
import * as moment from 'moment';
import EmailConfirmationTokenRepository from '../../../shared/repositories/emailConfirmationToken.repository';
import ValueFactory from './value.factory';
import EmailConfirmationTokenEntity from '../../../shared/entities/emailConfirmationToken.entity';
import { AsValueType } from '../../../shared/types/emailConfirmationToken/value.type';

@Injectable()
export default class EmailConfirmationTokenFactory {
  public constructor(
    private emailConfirmationTokenRepository: EmailConfirmationTokenRepository,
    private valueFactory: ValueFactory,
  ) {}

  public async create(user: UserEntity) {
    let value = null;
    let alreadyExists = false;

    do {
      value = await this.valueFactory.create();
      alreadyExists = Boolean(
        await this.emailConfirmationTokenRepository.findByValue(value),
      );
    } while (alreadyExists);

    const token = new EmailConfirmationTokenEntity();
    token.user = user;
    token.value = AsValueType(value);
    token.expiresAt = moment()
      .add(...process.env.EMAIL_CONFIRMATION_TOKEN_TTL.split(' '))
      .toDate();
    await this.emailConfirmationTokenRepository.save(token);
    return token;
  }
}
