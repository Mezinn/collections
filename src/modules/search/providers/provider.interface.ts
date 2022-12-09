import SearchModel from '../searchModel';
import UserEntity from '../../../shared/entities/user.entity';
import Result from '../result';

export interface ProviderInterface {
  search(
    searchModel: SearchModel,
    offset: number,
    limit: number,
    user?: UserEntity,
  ): Promise<Result<any>>;

  length(searchModel: SearchModel, user?: UserEntity): Promise<number>;
}
