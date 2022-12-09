import { Injectable } from '@nestjs/common';

@Injectable()
export default class MustBeEqual {
  public async validate<T>(
    context: string[],
    a: T,
    b: T,
    errorMessage: string,
  ) {
    if (a !== b) {
      context.push(errorMessage);
    }
  }
}
