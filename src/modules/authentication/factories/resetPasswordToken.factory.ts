import UserEntity from '../../../shared/entities/user.entity';
import * as moment from 'moment';
import ValueFactory from './value.factory';
import ResetPasswordTokenRepository from '../../../shared/repositories/resetPasswordToken.repository';
import ResetPasswordTokenEntity from '../../../shared/entities/resetPasswordToken.entity';
import { AsValueType } from '../../../shared/types/resetPasswordToken/value.type';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class ResetPasswordTokenFactory {
  public constructor(
    private resetPasswordTokenRepository: ResetPasswordTokenRepository,
    private valueFactory: ValueFactory,
  ) {}

  public async create(user: UserEntity) {
    let value = null;
    let alreadyExists = false;

    do {
      value = await this.valueFactory.create();
      alreadyExists = Boolean(
        await this.resetPasswordTokenRepository.findByValue(value),
      );
    } while (alreadyExists);

    const token = new ResetPasswordTokenEntity();
    token.user = user;
    token.value = AsValueType(value);
    token.expiresAt = moment()
      .add(...process.env.RESET_PASSWORD_TOKEN_TTL.split(' '))
      .toDate();
    await this.resetPasswordTokenRepository.save(token);
    return token;
  }
}
