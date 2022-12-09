import { Injectable } from '@nestjs/common';
import { PasswordType } from '../shared/types/user/password.type';
import {
  AsPasswordHashType,
  PasswordHashType,
} from '../shared/types/user/passwordHash.type';
import * as bcrypt from 'bcrypt';

@Injectable()
export default class PasswordHasher {
  public async hash(password: PasswordType) {
    return AsPasswordHashType(
      await bcrypt.hash(password, Number(process.env.BCRYPT_SALT)),
    );
  }

  public async isEqual(password: PasswordType, passwordHash: PasswordHashType) {
    return await bcrypt.compare(password, passwordHash);
  }
}
