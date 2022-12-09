import { Injectable } from '@nestjs/common';
import SearchRunner from '../searchRunner';
import SearchModel from '../searchModel';
import { ProviderInterface } from './provider.interface';
import UserEntity from '../../../shared/entities/user.entity';

@Injectable()
export default class WorkProvider implements ProviderInterface {
  public constructor(private searchRunner: SearchRunner) {}

  public async search(
    searchModel: SearchModel,
    offset: number,
    limit: number,
    user?: UserEntity,
  ) {
    return this.searchRunner.search(searchModel, offset, limit);
  }

  public async length(searchModel) {
    return this.searchRunner.count(searchModel);
  }
}
