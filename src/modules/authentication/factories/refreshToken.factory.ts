import { Injectable } from '@nestjs/common';
import UserEntity from '../../../shared/entities/user.entity';
import RefreshTokenRepository from '../../../shared/repositories/refreshToken.repository';
import ValueFactory from './value.factory';
import RefreshTokenEntity from '../../../shared/entities/refreshToken.entity';
import * as moment from 'moment';
import { AsValueType } from '../../../shared/types/refreshToken/value.type';

@Injectable()
export default class RefreshTokenFactory {
  public constructor(
    private refreshTokenRepository: RefreshTokenRepository,
    private valueFactory: ValueFactory,
  ) {}

  public async create(user: UserEntity) {
    let value = null;
    let alreadyExists = false;

    do {
      value = await this.valueFactory.create();
      alreadyExists = Boolean(
        await this.refreshTokenRepository.findByValue(value),
      );
    } while (alreadyExists);

    const token = new RefreshTokenEntity();
    token.user = user;
    token.value = AsValueType(value);
    token.expiresAt = moment()
      .add(...process.env.REFRESH_TOKEN_TTL.split(' '))
      .toDate();
    await this.refreshTokenRepository.save(token);
    return token;
  }
}
