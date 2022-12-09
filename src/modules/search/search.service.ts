import SearchModel from './searchModel';
import { Injectable } from '@nestjs/common';
import UserEntity from '../../shared/entities/user.entity';
import { ProviderInterface } from './providers/provider.interface';
import Result from './result';

@Injectable()
export default class SearchService {
  public async search(
    providers: ProviderInterface[],
    searchModel: SearchModel,
    offset: number,
    limit: number,
    user?: UserEntity,
  ) {
    const limitCopy = limit;
    const offsetCopy = offset;

    const results = [];
    let totalCount = 0;
    for (const collection of providers) {
      const collectionLength = await collection.length(searchModel, user);
      totalCount += collectionLength;
      if (offset >= collectionLength) {
        offset -= collectionLength;
      } else {
        const collectionLimit = Math.min(collectionLength - offset, limit);
        limit -= collectionLimit;
        results.push(
          ...(
            await collection.search(searchModel, offset, collectionLimit, user)
          ).records,
        );
        offset = 0;
      }
    }
    return new Result(
      results,
      offsetCopy,
      limitCopy,
      totalCount,
      Math.ceil(totalCount / limitCopy),
    );
  }
}
