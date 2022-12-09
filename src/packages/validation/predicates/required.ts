import { Injectable } from '@nestjs/common';

@Injectable()
export default class Required {
  public async validate<T>(context: string[], value: T) {
    if (!value) {
      context.push('Field is required');
    }
  }
}
