import { Injectable } from '@nestjs/common';

@Injectable()
export default class CannotBeEmpty {
  public async validate(context: string[], value: string) {
    if (!value.length) {
      context.push('Field cannot be empty');
    }
  }
}
