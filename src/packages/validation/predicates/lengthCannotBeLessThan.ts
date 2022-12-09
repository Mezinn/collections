import { Injectable } from '@nestjs/common';

@Injectable()
export default class LengthCannotBeLessThan {
  public async validate(context: string[], value: string, minLength: number) {
    if (value && value.length < minLength) {
      context.push(`Value length cannot be less than ${minLength} characters`);
    }
  }
}
