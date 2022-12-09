import * as uuid from 'uuid';
import * as md5 from 'md5';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class ValueFactory {
  public async create(): Promise<string> {
    return md5(uuid.v4());
  }
}
