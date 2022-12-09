import { Injectable } from '@nestjs/common';

@Injectable()
export default class MustBeUnique {
  public async validate(context: string[], callback: () => Promise<boolean>) {
    const isUnique = await callback();
    if (!isUnique) {
      context.push('Value already exists or not available');
    }
  }
}
