import { Injectable } from '@nestjs/common';

@Injectable()
export default class LengthCannotBeGreaterThan {
  public async validate(context: string[], value: string, maxLength) {
    if (value && value.length > maxLength) {
      context.push(`Value length cannot exceed ${maxLength} characters`);
    }
  }
}
