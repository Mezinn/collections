import { Injectable } from '@nestjs/common';
import {
  AsPassphraseType,
  PassphraseType,
} from '../../../shared/types/user/passphrase.type';
import * as uuid from 'uuid';
import * as md5 from 'md5';

@Injectable()
export default class PassphraseFactory {
  public create(): PassphraseType {
    const value = uuid.v4();
    const hashed = md5(value);
    return AsPassphraseType(hashed);
  }
}
